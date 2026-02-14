"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  // Update task status (optimistic UI)
  const updateTaskStatus = async (
    projectId: string,
    taskId: string,
    status: "pending" | "in-progress" | "completed",
  ) => {
    const prev = project;
    try {
      // optimistic update
      setProject((p) => {
        if (!p) return p;
        const copy: any = JSON.parse(JSON.stringify(p));
        for (const phase of copy.phases || []) {
          for (const task of phase.tasks || []) {
            if ((task._id || task.id || "") === taskId) {
              task.status = status;
              if (status === "in-progress")
                task.startedAt = new Date().toISOString();
              if (status === "completed")
                task.completedAt = new Date().toISOString();
              if (status === "pending") {
                task.startedAt = undefined;
                task.completedAt = undefined;
              }
            }
          }
        }
        return copy;
      });

      await apiService.updateTaskStatus(projectId, taskId, status);
      toast.success("Task updated");
    } catch (err: any) {
      console.error("Failed to update task status:", err);
      toast.error(err?.response?.data?.message || "Failed to update task");
      // revert
      setProject(prev);
    }
  };

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

  const excludedTaskKeys = [
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
    "status",
    "startedAt",
    "completedAt",
  ];

  const prettifyKey = (k: string) =>
    k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const renderValue = (val: any) => {
    if (val === null || typeof val === "undefined")
      return <span className="text-text-light">—</span>;
    if (
      typeof val === "string" ||
      typeof val === "number" ||
      typeof val === "boolean"
    )
      return <span className="text-text">{String(val)}</span>;
    if (Array.isArray(val)) {
      if (val.length === 0) return <span className="text-text-light">[]</span>;
      return (
        <ul className="list-disc ml-4 text-sm text-text-light">
          {val.slice(0, 6).map((v, i) => (
            <li key={i}>
              {typeof v === "object" ? JSON.stringify(v) : String(v)}
            </li>
          ))}
          {val.length > 6 && <li>...and {val.length - 6} more</li>}
        </ul>
      );
    }
    if (typeof val === "object") {
      const entries = Object.entries(val || {}).slice(0, 6);
      if (entries.length === 0)
        return <span className="text-text-light">{{}}</span>;
      return (
        <div className="space-y-1 text-sm text-text-light">
          {entries.map(([k, v]) => (
            <div key={k}>
              <span className="font-medium text-text">{prettifyKey(k)}:</span>{" "}
              <span className="text-text">
                {typeof v === "object" ? JSON.stringify(v) : String(v)}
              </span>
            </div>
          ))}
          {Object.keys(val).length > 6 && (
            <div className="text-xs text-text-light">
              +{Object.keys(val).length - 6} more
            </div>
          )}
        </div>
      );
    }
    return <span className="text-text">{String(val)}</span>;
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Header - Hero with stats and actions */}
        <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-border-color">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-text mb-2 leading-tight">
                {project.title || project.projectTitle}
              </h1>
              <p className="text-sm text-text-light mb-4 max-w-2xl">
                {project.description ||
                  project.projectDescription ||
                  "A focused, hands-on roadmap to build something real with this tech stack. Follow the phases and mark tasks as you go."}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                  {project.techStack}
                </span>
                <span className="inline-block px-3 py-1 bg-background border border-border-color text-text text-xs font-semibold rounded-full">
                  {project.experienceLevel || project.level} Level
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col items-end gap-3">
              <div className="w-full md:w-auto text-right">
                <div className="text-xs text-text-light">Progress</div>
                <div className="w-56 bg-gray-100 rounded-full h-3 mt-1 overflow-hidden">
                  {(() => {
                    const phasesCount = (project.phases || []).length;
                    const tasks = (project.phases || []).flatMap(
                      (p) => p.tasks || [],
                    );
                    const tasksCount = tasks.length;
                    const completed = tasks.filter(
                      (t: any) => t.status === "completed",
                    ).length;
                    const pct = tasksCount
                      ? Math.round((completed / tasksCount) * 100)
                      : 0;
                    return (
                      <div
                        className="h-3 bg-accent"
                        style={{ width: `${pct}%` }}
                      />
                    );
                  })()}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // expand first phase
                    const first = project.phases?.[0];
                    if (first) setExpandedPhase(first.id || first._id || first);
                    // scroll to phases area
                    const el = document.querySelector("[data-phases-anchor]");
                    if (el)
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover"
                >
                  Start Project
                </button>

                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard");
                    } catch (e) {
                      toast.error("Failed to copy link");
                    }
                  }}
                  className="px-3 py-2 bg-background border border-border-color text-text rounded-lg"
                >
                  Copy Link
                </button>
              </div>
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

                          {/* Task status & actions */}
                          <div className="mt-3 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span
                                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                                  task.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : task.status === "in-progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {task.status || "pending"}
                              </span>
                              {task.startedAt && (
                                <span className="text-xs text-text-light">
                                  Started:{" "}
                                  {new Date(task.startedAt).toLocaleString()}
                                </span>
                              )}
                              {task.completedAt && (
                                <span className="text-xs text-text-light">
                                  Completed:{" "}
                                  {new Date(task.completedAt).toLocaleString()}
                                </span>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateTaskStatus(
                                    id || project._id || project.id || "",
                                    task._id || task.id || "",
                                    "in-progress",
                                  )
                                }
                                disabled={
                                  task.status === "in-progress" ||
                                  task.status === "completed"
                                }
                                className="px-3 py-1 bg-yellow-500 text-white text-sm font-semibold rounded hover:bg-yellow-600 disabled:opacity-50"
                              >
                                Start
                              </button>

                              <button
                                onClick={() =>
                                  updateTaskStatus(
                                    id || project._id || project.id || "",
                                    task._id || task.id || "",
                                    "completed",
                                  )
                                }
                                disabled={task.status === "completed"}
                                className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700 disabled:opacity-50"
                              >
                                Complete
                              </button>
                            </div>
                          </div>

                          {/* Render any additional task fields for transparency */}
                          {Object.keys(task).some(
                            (k) => !excludedTaskKeys.includes(k),
                          ) && (
                            <div className="mt-3 bg-gray-50 p-3 rounded border border-border-color text-sm text-text-light">
                              <div className="space-y-2">
                                {Object.keys(task)
                                  .filter((k) => !excludedTaskKeys.includes(k))
                                  .map((k) => (
                                    <div key={k} className="flex gap-2">
                                      <div className="w-36 text-xs text-text-light">
                                        {prettifyKey(k)}
                                      </div>
                                      <div className="flex-1">
                                        {renderValue((task as any)[k])}
                                      </div>
                                    </div>
                                  ))}
                              </div>
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
