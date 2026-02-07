"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { apiService } from "@/lib/api";
import { AuthState } from "@/hooks/useAuth";

interface Task {
  id: string;
  title: string;
  description: string;
  expectedOutcome: string;
}

interface Phase {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
}

interface ProjectDetail {
  id: string;
  title: string;
  techStack: string;
  experienceLevel: string;
  description: string;
  phases: Phase[];
  createdAt: string;
}

interface ProjectDetailPageProps {
  auth: AuthState & { logout: () => void };
}

/**
 * Project Detail Page (Protected)
 * Shows project roadmap with accordion phases and tasks
 * TODO: Connect to GET /api/projects/:id
 */
export default function ProjectDetailPage({ auth }: ProjectDetailPageProps) {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      toast.error("Invalid project id");
      return;
    }

    loadProject();
  }, [id]);

  const loadProject = async () => {
    console.log("Current project ID from URL:", id); // ← this will show us what's wrong

    if (!id || id === "undefined") {
      toast.error("No valid project ID in URL");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.getProjectById(id);
      setProject(response.data);
    } catch (err: any) {
      console.error("Failed to load project:", err);
      toast.error(err.response?.data?.message || "Failed to load project");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar auth={auth} />
        <LoadingSpinner />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar auth={auth} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card text-center py-16">
            <h2 className="text-2xl font-bold text-text mb-2">
              Project not found
            </h2>
            <p className="text-text-light">
              The project you're looking for doesn't exist.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar auth={auth} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">{project.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <span className="inline-block px-4 py-2 bg-accent text-white text-sm font-semibold rounded-full">
              {project.techStack}
            </span>
            <span className="inline-block px-4 py-2 bg-background border-2 border-border-color text-text text-sm font-semibold rounded-full">
              {project.experienceLevel} Level
            </span>
          </div>

          {/* Description */}
          <p className="text-text-light text-lg leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Phases Accordion */}
        <div className="space-y-4">
          {project.phases.map((phase, phaseIndex) => (
            <div key={phase.id} className="card p-0 overflow-hidden">
              {/* Phase Header (Accordion Toggle) */}
              <button
                onClick={() =>
                  setExpandedPhase(expandedPhase === phase.id ? null : phase.id)
                }
                className="w-full px-6 py-4 flex items-start justify-between hover:bg-background transition-colors"
              >
                <div className="text-left flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-accent text-white font-bold rounded-full text-sm">
                      {phaseIndex + 1}
                    </span>
                    <h3 className="text-lg font-bold text-text">
                      {phase.title}
                    </h3>
                  </div>
                  {phase.description && (
                    <p className="text-text-light text-sm ml-11">
                      {phase.description}
                    </p>
                  )}
                </div>
                <ChevronDown
                  size={24}
                  className={`text-accent transition-transform flex-shrink-0 ml-4 ${
                    expandedPhase === phase.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Phase Content (Tasks) */}
              {expandedPhase === phase.id && (
                <div className="border-t-2 border-border-color px-6 py-6 bg-background">
                  <div className="space-y-4">
                    {phase.tasks.map((task, taskIndex) => (
                      <div
                        key={task.id}
                        className="flex gap-4 pb-4 last:pb-0 border-b border-border-color last:border-b-0"
                      >
                        {/* Task Number */}
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center justify-center w-8 h-8 bg-background border-2 border-accent text-accent rounded-lg text-sm font-semibold">
                            {taskIndex + 1}
                          </div>
                        </div>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-text mb-1 text-balance">
                            {task.title}
                          </h4>
                          <p className="text-text-light text-sm mb-3">
                            {task.description}
                          </p>

                          {/* Expected Outcome */}
                          <div className="flex gap-2 items-start p-3 bg-white rounded-lg border border-border-color">
                            <CheckCircle2
                              size={18}
                              className="text-accent flex-shrink-0 mt-0.5"
                            />
                            <div>
                              <p className="text-xs font-semibold text-text-light mb-1">
                                Expected Outcome
                              </p>
                              <p className="text-sm text-text">
                                {task.expectedOutcome}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 p-8 bg-white border-2 border-border-color rounded-lg text-center">
          <h3 className="text-2xl font-bold text-text mb-3">
            Ready to start learning?
          </h3>
          <p className="text-text-light mb-6">
            Follow each task in order. Don't rush—understanding each step is
            more important than speed.
          </p>
          <button className="inline-block px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors">
            Start Learning
          </button>
        </div>
      </main>
    </div>
  );
}
