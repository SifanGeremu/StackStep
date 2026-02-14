"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { apiService } from "@/lib/api";
import { AuthState } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";

interface Project {
  id?: string;
  _id?: string;
  title: string;
  techStack: string;
  experienceLevel: string;
  createdAt: string;
  description?: string;
  phases?: any[];
}

interface DashboardPageProps {
  auth: AuthState & { logout: () => void };
}

export default function DashboardPage({ auth }: DashboardPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});
  console.log("VITE_API_URL from env:", import.meta.env.VITE_API_URL);
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getProjects();
      setProjects(response.data);
    } catch (err) {
      console.error("Failed to load projects:", err);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const truncate = (text?: string, n = 300) =>
    !text ? "" : text.length > n ? text.substring(0, n).trim() + "…" : text;

  const toggleDescription = (id?: string) => {
    if (!id) return;
    setExpandedDescriptions((s) => ({ ...s, [id]: !s[id] }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar auth={auth} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-text mb-2">
                Your Projects
              </h1>
              <p className="text-text-light max-w-xl">
                Curated roadmaps you can follow step-by-step. Track progress,
                mark tasks complete, and focus on what matters.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/generate"
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors"
              >
                <Plus size={18} />
                Generate New
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-border-color rounded-lg">
              <div className="text-xs text-text-light">Total Projects</div>
              <div className="text-2xl font-bold text-text">
                {projects.length}
              </div>
            </div>

            <div className="p-4 bg-white border border-border-color rounded-lg">
              <div className="text-xs text-text-light">Recent</div>
              <div className="text-sm text-text">
                {projects[0]?.title || "—"}
              </div>
              <div className="text-xs text-text-light">
                {projects[0]?.techStack?.split(",")[0] || ""}
              </div>
            </div>

            <div className="p-4 bg-white border border-border-color rounded-lg">
              <div className="text-xs text-text-light">Action</div>
              <div className="mt-2">
                <Link
                  to="/generate"
                  className="inline-block px-3 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-hover"
                >
                  Create Roadmap
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : projects.length === 0 ? (
          <div className="card text-center py-16">
            <h3 className="text-2xl font-bold text-text mb-2">
              No projects yet
            </h3>
            <p className="text-text-light mb-6">
              Create your building roadmap to get started
            </p>
            <Link
              to="/generate"
              className="inline-block px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors"
            >
              Generate Your First Roadmap
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-lg border border-border-color p-6 flex flex-col h-full shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-text-light mb-3">
                      {(() => {
                        const desc =
                          project.description ||
                          project.projectDescription ||
                          "";
                        const id = project._id || project.id || project.title;
                        const isExpanded = !!expandedDescriptions[id];
                        if (!desc) return "No description provided.";
                        if (isExpanded) return desc;
                        return desc.length > 300
                          ? desc.substring(0, 300).trim() + "…"
                          : desc;
                      })()}
                    </p>
                    {(project.description || project.projectDescription || "")
                      .length > 300 && (
                      <button
                        onClick={() =>
                          toggleDescription(
                            project._id || project.id || project.title,
                          )
                        }
                        className="text-xs text-accent font-medium"
                      >
                        {expandedDescriptions[
                          project._id || project.id || project.title
                        ]
                          ? "Show less"
                          : "Show more"}
                      </button>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {(project.techStack || "")
                        .split(",")
                        .slice(0, 2)
                        .map((t) => (
                          <span
                            key={t}
                            className="inline-block px-2 py-0.5 bg-accent/10 text-accent text-xs font-semibold rounded"
                          >
                            {t.trim()}
                          </span>
                        ))}
                    </div>

                    {/* Progress */}
                    {Array.isArray(project.phases) &&
                      (() => {
                        const tasks = (project.phases || []).flatMap(
                          (p) => p.tasks || [],
                        );
                        const total = tasks.length;
                        const completed = tasks.filter(
                          (t: any) => t.status === "completed",
                        ).length;
                        const pct = total
                          ? Math.round((completed / total) * 100)
                          : 0;
                        return (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-text-light mb-1">
                              <div>Progress</div>
                              <div className="font-medium text-text">
                                {completed}/{total}
                              </div>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="h-2 bg-accent"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div className="text-xs text-text-light">
                      {project.experienceLevel}
                    </div>
                    <div className="text-sm font-medium text-text mt-2">
                      {formatDate(project.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <Link
                    to={`/projects/${project._id || project.id}`}
                    className="inline-block px-4 py-2 bg-accent text-white rounded-md font-semibold hover:bg-accent-hover transition-colors text-sm"
                  >
                    View Roadmap
                  </Link>

                  <Link
                    to={`/projects/${project._id || project.id}`}
                    className="text-xs text-text-light hover:text-text"
                  >
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
