"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Lightweight inline modal used instead of Radix Dialog to avoid missing dependency
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { apiService } from "@/lib/api";
import { AuthState } from "@/hooks/useAuth";

interface Task {
  
  id?: string;
  _id?: string;
  order?: number;
  title?: string;
  description?: string;
  expectedOutcome?: string;
  [key: string]: any;
}

interface Phase {
  id?: string;
  _id?: string;
  order?: number;
  title?: string;
  purpose?: string;
  description?: string;
  tasks?: Task[];
  [key: string]: any;
}

interface ProjectDetail {
  id?: string;
  _id?: string;
  projectTitle?: string;
  title?: string;
  techStack?: string;
  experienceLevel?: string;
  projectDescription?: string;
  description?: string;
  phases?: Phase[];
  createdAt?: string;
  [key: string]: any;
}

interface ProjectDetailPageProps {
  auth: AuthState & { logout: () => void };
}


export default function ProjectDetailPage({ auth }: ProjectDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  useEffect(() => {
    if (!id || id === "undefined") {
      setProject(null);
      setIsLoading(false);
      toast.error("No valid project ID in URL");
      return;
    }

    // Reset project state and show loading
    setProject(null);
    setIsLoading(true);

    const fetchProject = async () => {
      try {
        const response = await apiService.getProjectById(id);
        const fetchedProject = response.data?.project || response.data;

        if (!fetchedProject) {
          toast.error("Project not found");
          setProject(null);
        } else {
          setProject(fetchedProject);
        }
      } catch (err: any) {
        console.error("Failed to load project:", err);
        toast.error(err.response?.data?.message || "Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-text mb-4">
                {project.title || project.projectTitle}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 items-center mb-4">
                <span className="inline-block px-4 py-2 bg-accent text-white text-sm font-semibold rounded-full">
                  {project.techStack}
                </span>
                <span className="inline-block px-4 py-2 bg-background border-2 border-border-color text-text text-sm font-semibold rounded-full">
                  {project.experienceLevel || project.level} Level
                </span>
              </div>

              {/* Description */}
              <p className="text-text-light text-lg leading-relaxed">
                {project.description || project.projectDescription}
              </p>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting…" : "Delete Project"}
              </button>

              {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-black/50"
                    onClick={() => setShowDeleteModal(false)}
                  />

                  <div className="relative bg-background p-6 rounded-lg z-10 max-w-lg w-full">
                    <h3 className="text-lg font-semibold mb-2">
                      Delete Project
                    </h3>
                    <p className="text-sm text-text-light">
                      This will permanently delete the project and all
                      associated data. This action cannot be undone.
                    </p>

                    <div className="mt-4 flex gap-2 justify-end">
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 bg-background border border-border-color text-text font-semibold rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={async () => {
                          try {
                            setIsDeleting(true);
                            const projectId = id || project._id || project.id;
                            if (!projectId) {
                              toast.error("Missing project id");
                              return;
                            }
                            await apiService.deleteProject(
                              projectId.toString(),
                            );
                            toast.success("Project deleted");
                            setShowDeleteModal(false);
                            navigate(`/projects`);
                          } catch (err: any) {
                            console.error("Failed to delete project:", err);
                            toast.error(
                              err.response?.data?.message ||
                                "Failed to delete project",
                            );
                          } finally {
                            setIsDeleting(false);
                          }
                        }}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        {isDeleting ? "Deleting…" : "Delete Project"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phases Accordion */}
        <div className="space-y-4">
          {(project.phases || []).map((phase, phaseIndex) => (
            <div
              key={phase.id || phase._id || `phase-${phaseIndex}`}
              className="card p-0 overflow-hidden"
            >
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
                      {phase.title ||
                        phase.name ||
                        `Phase ${phase.order ?? phaseIndex + 1}`}
                    </h3>
                  </div>
                  {(phase.purpose || phase.description) && (
                    <p className="text-text-light text-sm ml-11">
                      {phase.purpose || phase.description}
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
                    {/* Definition of Done for phase (if provided) */}
                    {(phase.definitionOfDone || phase.definition_of_done) && (
                      <div className="p-4 bg-white border border-border-color rounded-lg">
                        <p className="text-sm font-semibold text-text mb-2">
                          Definition of Done
                        </p>
                        <ul className="space-y-2">
                          {(
                            phase.definitionOfDone ||
                            phase.definition_of_done ||
                            []
                          ).map((dod: any, i: number) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2
                                size={18}
                                className="text-accent flex-shrink-0 mt-0.5"
                              />
                              <p className="text-sm text-text-light">
                                {typeof dod === "string"
                                  ? dod
                                  : JSON.stringify(dod)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(phase.tasks || []).map((task, taskIndex) => (
                      <div
                        key={task.id || task._id || `task-${taskIndex}`}
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
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-text mb-1 text-balance">
                              {task.title ||
                                `Task ${task.order ?? taskIndex + 1}`}
                            </h4>
                            {typeof task.order !== "undefined" && (
                              <span className="text-xs text-text-light">
                                Order: {task.order}
                              </span>
                            )}
                          </div>

                          <p className="text-text-light text-sm mb-3">
                            {task.description ||
                              task.desc ||
                              JSON.stringify(
                                task.description || task.body || "",
                              )}
                          </p>

                          {/* Expected Outcome (flexible keys) */}
                          {(task.expectedOutcome ||
                            task.expected_outcome ||
                            task.outcome) && (
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
                                  {task.expectedOutcome ||
                                    task.expected_outcome ||
                                    task.outcome}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Render any additional task fields for transparency */}
                          {Object.keys(task).some(
                            (k) =>
                              ![
                                "id",
                                "_id",
                                "order",
                                "title",
                                "description",
                                "desc",
                                "body",
                                "expectedOutcome",
                                "expected_outcome",
                                "outcome",
                              ].includes(k),
                          ) && (
                            <div className="mt-3 bg-gray-50 p-3 rounded border border-border-color text-sm text-text-light">
                              <pre className="whitespace-pre-wrap break-words">
                                {JSON.stringify(task, null, 2)}
                              </pre>
                            </div>
                          )}
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
