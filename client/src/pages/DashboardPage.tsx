/* Brief
   Reader: a learner opening their saved roadmaps
   Question: which roadmap should I continue, or do I need a new one?
   Action: open a project, or generate a new roadmap
   Register: visual
*/
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/formic/components/Button";
import EmptyState from "@/formic/components/EmptyState";
import LoadingState from "@/formic/components/LoadingState";
import { useToast } from "@/formic/components/Toast";
import {
  CardGroup,
  CardHeader,
  CardTitle,
  CardFooter,
  CardButton,
} from "@/formic/components/cards";
import { Badge, Card, Chip, Progress, iconFor } from "@/formic/components/primitives";
import { AuthedShell } from "@/components/Shell";
import { apiService } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { AuthState } from "@/hooks/useAuth";

interface Project {
  id?: string;
  _id?: string;
  title: string;
  techStack: string;
  experienceLevel: string;
  createdAt: string;
  description?: string;
  projectDescription?: string;
  phases?: any[];
}

interface DashboardPageProps {
  auth: AuthState & { logout: () => void };
}

function projectId(project: Project) {
  return project._id || project.id || project.title;
}

function taskProgress(project: Project) {
  const tasks = (project.phases || []).flatMap((phase) => phase.tasks || []);
  const total = tasks.length;
  const completed = tasks.filter((task: { status?: string }) => task.status === "completed").length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pct };
}

export default function DashboardPage({ auth }: DashboardPageProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
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
      toast({ tone: "error", title: "Failed to load projects" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDescription = (id?: string) => {
    if (!id) return;
    setExpandedDescriptions((current) => ({ ...current, [id]: !current[id] }));
  };

  const openProject = (project: Project) => {
    navigate(`/projects/${project._id || project.id}`);
  };

  const latest = projects[0];
  const caption = isLoading
    ? "Loading your roadmaps"
    : projects.length === 0
      ? "No roadmaps yet"
      : `${projects.length} roadmap${projects.length === 1 ? "" : "s"}${latest ? ` · Latest: ${latest.title}` : ""}`;

  return (
    <AuthedShell
      auth={auth}
      active="dashboard"
      title="Your projects"
      caption={caption}
      actions={
        <Button
          variant={projects.length === 0 ? "secondary" : "accent"}
          icon={iconFor("Generate new")}
          onClick={() => navigate("/generate")}
        >
          Generate new
        </Button>
      }
    >
      {isLoading ? (
        <LoadingState label="Loading projects" />
      ) : projects.length === 0 ? (
        <EmptyState
          kind="first"
          title="No projects yet"
          description="Create your building roadmap to get started"
          action={
            <Button variant="accent" icon={iconFor("Generate your first roadmap")} onClick={() => navigate("/generate")}>
              Generate your first roadmap
            </Button>
          }
        />
      ) : (
        <CardGroup columns={3}>
          {projects.map((project) => {
            const id = projectId(project);
            const desc = project.description || project.projectDescription || "";
            const isExpanded = !!expandedDescriptions[id];
            const shown = !desc
              ? "No description provided."
              : isExpanded
                ? desc
                : desc.length > 300
                  ? desc.substring(0, 300).trim() + "…"
                  : desc;
            const tags = (project.techStack || "")
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
              .slice(0, 2);
            const progress = Array.isArray(project.phases) ? taskProgress(project) : null;

            return (
              <Card key={project._id || id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle>{project.title}</CardTitle>
                    <Badge>{project.experienceLevel}</Badge>
                  </div>
                  <p className="text-caption text-ink-2">{shown}</p>
                  {desc.length > 300 && (
                    <Button variant="link" size="sm" onClick={() => toggleDescription(id)}>
                      {isExpanded ? "Show less" : "Show more"}
                    </Button>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <Chip key={tag}>{tag}</Chip>
                      ))}
                    </div>
                  )}
                  {progress && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-small text-ink-2">
                        <span>Progress</span>
                        <span className="font-medium text-ink tabular-nums">
                          {progress.completed}/{progress.total}
                        </span>
                      </div>
                      <Progress value={progress.pct} label={`${project.title} progress`} />
                    </div>
                  )}
                  <p className="text-small text-ink-2">{formatDate(project.createdAt)}</p>
                </CardHeader>
                <CardFooter>
                  <CardButton onClick={() => openProject(project)}>View roadmap</CardButton>
                  <Button variant="ghost" size="sm" icon={iconFor("Open")} onClick={() => openProject(project)}>
                    Open
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </CardGroup>
      )}
    </AuthedShell>
  );
}
