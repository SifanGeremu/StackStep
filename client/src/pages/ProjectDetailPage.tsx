/* Brief
   Reader: a learner working through one roadmap
   Question: what is this project, and which task should I do next?
   Action: start the first phase, copy the link, or mark a task started or complete
   Register: balanced
*/
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@/formic/components/Button";
import EmptyState from "@/formic/components/EmptyState";
import LoadingState from "@/formic/components/LoadingState";
import Panel from "@/formic/components/Panel";
import { useToast } from "@/formic/components/Toast";
import { Badge, Card, Disclosure, Icon, Progress, iconFor, type BadgeTone } from "@/formic/components/primitives";
import { AuthedShell } from "@/components/Shell";
import { apiService } from "@/lib/api";
import type { AuthState } from "@/hooks/useAuth";

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
  level?: string;
  [key: string]: any;
}

interface ProjectDetailPageProps {
  auth: AuthState & { logout: () => void };
}

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

const prettifyKey = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

function statusTone(status?: string): BadgeTone {
  if (status === "completed") return "green";
  if (status === "in-progress") return "orange";
  return "neutral";
}

export default function ProjectDetailPage({ auth }: ProjectDetailPageProps) {
  const { id } = useParams();
  const toast = useToast();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState<string | Phase | null | undefined>(null);

  const updateTaskStatus = async (
    projectId: string,
    taskId: string,
    status: "pending" | "in-progress" | "completed",
  ) => {
    const prev = project;
    try {
      setProject((current) => {
        if (!current) return current;
        const copy: any = JSON.parse(JSON.stringify(current));
        for (const phase of copy.phases || []) {
          for (const task of phase.tasks || []) {
            if ((task._id || task.id || "") === taskId) {
              task.status = status;
              if (status === "in-progress") task.startedAt = new Date().toISOString();
              if (status === "completed") task.completedAt = new Date().toISOString();
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
      toast({ tone: "success", title: "Task updated" });
    } catch (err: any) {
      console.error("Failed to update task status:", err);
      toast({ tone: "error", title: err?.response?.data?.message || "Failed to update task" });
      setProject(prev);
    }
  };

  useEffect(() => {
    if (!id || id === "undefined") {
      setProject(null);
      setIsLoading(false);
      toast({ tone: "error", title: "No valid project ID in URL" });
      return;
    }

    setProject(null);
    setIsLoading(true);

    const fetchProject = async () => {
      try {
        const response = await apiService.getProjectById(id);
        const fetchedProject = response.data?.project || response.data;

        if (!fetchedProject) {
          toast({ tone: "error", title: "Project not found" });
          setProject(null);
        } else {
          setProject(fetchedProject);
        }
      } catch (err: any) {
        console.error("Failed to load project:", err);
        toast({ tone: "error", title: err.response?.data?.message || "Failed to load project" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const renderValue = (val: any) => {
    if (val === null || typeof val === "undefined") return <span className="text-ink-2">—</span>;
    if (typeof val === "string" || typeof val === "number" || typeof val === "boolean")
      return <span className="text-ink">{String(val)}</span>;
    if (Array.isArray(val)) {
      if (val.length === 0) return <span className="text-ink-2">[]</span>;
      return (
        <ul className="list-disc pl-4 text-caption text-ink-2">
          {val.slice(0, 6).map((item, index) => (
            <li key={index}>{typeof item === "object" ? JSON.stringify(item) : String(item)}</li>
          ))}
          {val.length > 6 && <li>...and {val.length - 6} more</li>}
        </ul>
      );
    }
    if (typeof val === "object") {
      const entries = Object.entries(val || {}).slice(0, 6);
      if (entries.length === 0) return <span className="text-ink-2">{"{}"}</span>;
      return (
        <div className="flex flex-col gap-1 text-caption text-ink-2">
          {entries.map(([key, value]) => (
            <div key={key}>
              <span className="font-medium text-ink">{prettifyKey(key)}:</span>{" "}
              <span className="text-ink">{typeof value === "object" ? JSON.stringify(value) : String(value)}</span>
            </div>
          ))}
          {Object.keys(val).length > 6 && (
            <div className="text-small text-ink-2">+{Object.keys(val).length - 6} more</div>
          )}
        </div>
      );
    }
    return <span className="text-ink">{String(val)}</span>;
  };

  const startProject = () => {
    const first = project?.phases?.[0];
    if (first) setExpandedPhase(first.id || first._id || first);
    const el = document.querySelector("[data-phases-anchor]");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ tone: "success", title: "Link copied to clipboard" });
    } catch (e) {
      toast({ tone: "error", title: "Failed to copy link" });
    }
  };

  if (isLoading) {
    return (
      <AuthedShell auth={auth} active={null} title="Project">
        <LoadingState label="Loading roadmap" />
      </AuthedShell>
    );
  }

  if (!project) {
    return (
      <AuthedShell auth={auth} active={null} title="Project">
        <EmptyState
          kind="error"
          title="Project not found"
          description="The project you're looking for doesn't exist."
        />
      </AuthedShell>
    );
  }

  const tasks = (project.phases || []).flatMap((phase) => phase.tasks || []);
  const tasksCount = tasks.length;
  const completed = tasks.filter((task: Task) => task.status === "completed").length;
  const pct = tasksCount ? Math.round((completed / tasksCount) * 100) : 0;
  const title = project.title || project.projectTitle || "Project";
  const description =
    project.description ||
    project.projectDescription ||
    "A focused, hands-on roadmap to build something real with this tech stack. Follow the phases and mark tasks as you go.";
  const level = project.experienceLevel || project.level;

  return (
    <AuthedShell
      auth={auth}
      active={null}
      title={title}
      caption={project.techStack ? `${project.techStack}${level ? ` · ${level} level` : ""}` : undefined}
      actions={
        <>
          <Button variant="accent" onClick={startProject}>
            Start project
          </Button>
          <Button variant="secondary" icon={iconFor("Copy link")} onClick={copyLink}>
            Copy link
          </Button>
        </>
      }
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <p className="text-body text-ink-2">{description}</p>

        <div className="flex flex-wrap items-center gap-2">
          {project.techStack && <Badge>{project.techStack}</Badge>}
          {level && <Badge tone="neutral">{level} level</Badge>}
        </div>

        <div className="flex max-w-sm flex-col gap-1">
          <div className="flex items-center justify-between text-small text-ink-2">
            <span>Progress</span>
            <span className="font-medium text-ink tabular-nums">
              {completed}/{tasksCount}
            </span>
          </div>
          <Progress value={pct} label="Roadmap progress" />
        </div>

        <div className="flex flex-col gap-3" data-phases-anchor>
          {(project.phases || []).map((phase, phaseIndex) => {
            const open = expandedPhase === phase.id;
            const phaseTitle =
              phase.title || phase.name || `Phase ${phase.order ?? phaseIndex + 1}`;
            const purpose = phase.purpose || phase.description;
            const done = phase.definitionOfDone || phase.definition_of_done;

            return (
              <Card key={phase.id || phase._id || `phase-${phaseIndex}`} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-body font-medium text-ink">
                      {phaseIndex + 1}. {phaseTitle}
                    </p>
                    {purpose && <p className="mt-0.5 text-caption text-ink-2">{purpose}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={iconFor(open ? "Hide tasks" : "Show tasks")}
                    aria-expanded={open}
                    onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                  >
                    {open ? "Hide tasks" : "Show tasks"}
                  </Button>
                </div>

                <Disclosure open={open}>
                  <div className="mt-4 flex flex-col gap-4 border-t border-line pt-4">
                    {done && (
                      <div className="rounded-md bg-inset p-3">
                        <p className="text-caption font-medium text-ink">Definition of done</p>
                        <ul className="mt-2 flex flex-col gap-2">
                          {(done || []).map((item: any, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <Icon name="circle-check" size={16} className="mt-0.5 shrink-0 text-accent" />
                              <p className="text-caption text-ink-2">
                                {typeof item === "string" ? item : JSON.stringify(item)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(phase.tasks || []).map((task, taskIndex) => {
                      const outcome = task.expectedOutcome || task.expected_outcome || task.outcome;
                      const extraKeys = Object.keys(task).filter((key) => !excludedTaskKeys.includes(key));
                      const taskId = task._id || task.id || "";
                      const projectKey = id || project._id || project.id || "";

                      return (
                        <div
                          key={task.id || task._id || `task-${taskIndex}`}
                          className="flex gap-3 border-b border-line pb-4 last:border-b-0 last:pb-0"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-control border border-line-strong text-caption font-medium text-accent">
                            {taskIndex + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-body font-medium text-ink">
                                {task.title || `Task ${task.order ?? taskIndex + 1}`}
                              </h3>
                              {typeof task.order !== "undefined" && (
                                <span className="text-small text-ink-2">Order: {task.order}</span>
                              )}
                            </div>
                            <p className="mt-1 text-caption text-ink-2">
                              {task.description || task.desc || JSON.stringify(task.description || task.body || "")}
                            </p>

                            {outcome && (
                              <div className="mt-3 flex gap-2 rounded-md border border-line bg-canvas p-3">
                                <Icon name="circle-check" size={16} className="mt-0.5 shrink-0 text-accent" />
                                <div>
                                  <p className="text-small font-medium text-ink-2">Expected outcome</p>
                                  <p className="text-caption text-ink">{outcome}</p>
                                </div>
                              </div>
                            )}

                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge tone={statusTone(task.status)}>{task.status || "pending"}</Badge>
                                {task.startedAt && (
                                  <span className="text-small text-ink-2">
                                    Started: {new Date(task.startedAt).toLocaleString()}
                                  </span>
                                )}
                                {task.completedAt && (
                                  <span className="text-small text-ink-2">
                                    Completed: {new Date(task.completedAt).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  disabled={task.status === "in-progress" || task.status === "completed"}
                                  onClick={() => updateTaskStatus(projectKey, taskId, "in-progress")}
                                >
                                  Start
                                </Button>
                                <Button
                                  size="sm"
                                  variant="success"
                                  icon={iconFor("Complete")}
                                  disabled={task.status === "completed"}
                                  onClick={() => updateTaskStatus(projectKey, taskId, "completed")}
                                >
                                  Complete
                                </Button>
                              </div>
                            </div>

                            {extraKeys.length > 0 && (
                              <div className="mt-3 rounded-md bg-inset p-3">
                                <div className="flex flex-col gap-2">
                                  {extraKeys.map((key) => (
                                    <div key={key} className="flex gap-2">
                                      <div className="w-36 shrink-0 text-small text-ink-2">{prettifyKey(key)}</div>
                                      <div className="min-w-0 flex-1">{renderValue(task[key])}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Disclosure>
              </Card>
            );
          })}
        </div>

        <Panel
          title="Ready to start learning?"
          caption="Follow each task in order. Don't rush — understanding each step is more important than speed."
        >
          <Button variant="secondary">Start learning</Button>
        </Panel>
      </div>
    </AuthedShell>
  );
}
