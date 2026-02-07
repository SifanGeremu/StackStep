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
}

interface DashboardPageProps {
  auth: AuthState & { logout: () => void };
}


export default function DashboardPage({ auth }: DashboardPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar auth={auth} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-text mb-2">Your Projects</h1>
            <p className="text-text-light">
              View and manage your learning roadmaps
            </p>
          </div>
          <Link
            to="/generate"
            className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors w-full sm:w-auto justify-center sm:justify-start"
          >
            <Plus size={20} />
            Generate New
          </Link>
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
              <div key={project._id} className="card flex flex-col h-full">
                {/* Title */}
                <h3 className="text-xl font-bold text-text mb-2">
                  {project.title}
                </h3>

                {/* Tech Stack Tag */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                    {project.techStack.split(",")[0].trim()}
                  </span>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-text-light text-sm mb-4 flex-grow">
                    {project.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-text-light mb-4 border-t border-border-color pt-4">
                  <span>{project.experienceLevel}</span>
                  <span>{formatDate(project.createdAt)}</span>
                </div>

                {/* View Button */}
                <Link
                  to={`/projects/${project._id || project.id}`}
                  className="w-full px-4 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors text-center"
                >
                  View Roadmap
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
