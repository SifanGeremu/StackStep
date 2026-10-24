/* Brief
   Reader: someone deciding whether StackStep is how they want to learn a stack
   Question: what does a roadmap look like, and how do I get one?
   Action: start learning, or sign in if they already have projects
   Register: text
*/
import { useNavigate } from "react-router-dom";
import AppShell from "@/formic/components/AppShell";
import Button from "@/formic/components/Button";
import Panel from "@/formic/components/Panel";
import { Badge, Chip, Icon, iconFor } from "@/formic/components/primitives";
import type { AuthState } from "@/hooks/useAuth";

interface HomePageProps {
  auth: AuthState;
}

const STACKS = [
  "MERN",
  "AI",
  "Next.js + Tailwind",
  "React + Firebase",
  "Django + PostgreSQL",
  "Go + React",
  "FastAPI + Vue",
];

const STEPS = [
  {
    title: "Describe your stack",
    description:
      "Enter any combination of technologies — frameworks, databases, and tools.",
  },
  {
    title: "Get a phased roadmap",
    description:
      "AI generates a structured plan with phases, tasks, and clear outcomes.",
  },
  {
    title: "Build and track progress",
    description:
      "Work through actionable tasks and mark them complete as you learn.",
  },
];

const FEATURES = [
  {
    title: "Project-based learning",
    description:
      "Every roadmap centers on building real projects, not passive tutorials.",
  },
  {
    title: "Actionable tasks",
    description:
      "Each phase breaks down into concrete steps with expected outcomes.",
  },
  {
    title: "Tailored to your level",
    description:
      "Choose beginner, intermediate, or advanced to match where you are.",
  },
  {
    title: "Structured phases",
    description:
      "Progress from foundations to deployment with a clear learning path.",
  },
];

const PREVIEW_TASKS = [
  { done: true, label: "Initialize monorepo", muted: true },
  { done: true, label: "Configure MongoDB connection", muted: false },
  { done: false, label: "Set up Express API routes", muted: true },
];

function RoadmapPreview() {
  return (
    <Panel title="MERN Stack" caption="Sample roadmap" actions={<Badge>Beginner</Badge>}>
      <div className="flex flex-col gap-3">
        <div className="rounded-md border border-line bg-canvas p-3">
          <p className="text-body font-medium text-ink">1. Foundation Setup</p>
          <p className="mt-0.5 text-caption text-ink-2">Project structure and tooling</p>
          <ul className="mt-3 flex flex-col gap-2">
            {PREVIEW_TASKS.map((task) => (
              <li key={task.label} className="flex items-center gap-2">
                <Icon
                  name={task.done ? "circle-check" : "clock"}
                  size={16}
                  className={task.done ? "text-accent" : "text-ink-3"}
                />
                <span
                  className={`text-caption ${task.muted ? "text-ink-2" : "text-ink"} ${task.done && task.muted ? "line-through" : ""}`}
                >
                  {task.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border border-line bg-canvas px-3 py-2.5">
          <p className="text-body font-medium text-ink">2. REST API and Auth</p>
          <p className="text-caption text-ink-2">JWT, CRUD endpoints</p>
        </div>
        <div className="rounded-md border border-line bg-canvas px-3 py-2.5">
          <p className="text-body font-medium text-ink">3. React Frontend</p>
          <p className="text-caption text-ink-2">Components and state</p>
        </div>
      </div>
    </Panel>
  );
}

export default function HomePage({ auth }: HomePageProps) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(auth.isAuthenticated ? "/generate" : "/login");
  };

  return (
    <AppShell
      rail="none"
      title="StackStep"
      caption="Learn by building"
      actions={
        auth.isAuthenticated ? (
          <>
            <span className="hidden max-w-48 truncate text-caption text-ink-2 md:inline">
              {auth.userEmail}
            </span>
            <Button variant="secondary" size="sm" icon={iconFor("Dashboard")} onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" icon={iconFor("Sign in")} onClick={() => navigate("/login")}>
              Sign in
            </Button>
            <span className="hidden sm:inline-flex">
              <Button variant="secondary" size="sm" onClick={() => navigate("/signup")}>
                Get started
              </Button>
            </span>
          </>
        )
      }
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Badge tone="neutral">
              <Icon name="sparkles" size={12} />
              AI-powered learning roadmaps
            </Badge>
            <h2 className="text-display-lg font-semibold tracking-tight text-ink">
              Learn tech stacks by building real projects
            </h2>
            <p className="max-w-xl text-lead text-ink-2">
              Turn any stack into a phased, beginner-friendly roadmap with clear tasks and
              outcomes — so you learn by doing, not just reading.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="accent" icon={iconFor("Start learning")} onClick={handleGetStarted}>
                Start learning
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(auth.isAuthenticated ? "/dashboard" : "/signup")}
              >
                {auth.isAuthenticated ? "View projects" : "Create free account"}
              </Button>
            </div>
            <p className="text-caption text-ink-2">
              No credit card required · Works with any tech stack
            </p>
          </div>
          <RoadmapPreview />
        </div>

        <Panel title="Popular stacks" caption="What learners start with">
          <div className="flex flex-wrap gap-2">
            {STACKS.map((stack) => (
              <Chip key={stack} size="md">
                {stack}
              </Chip>
            ))}
          </div>
        </Panel>

        <Panel title="How it works" caption="From a stack to a roadmap you can follow">
          <ol className="flex flex-col gap-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-inset text-tiny font-medium text-ink">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-body font-medium text-ink">{step.title}</p>
                  <p className="mt-0.5 text-caption text-ink-2">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Why StackStep" caption="For developers who learn by building">
          <p className="mb-4 text-body text-ink-2">
            Skip the endless tutorial rabbit holes. Get a focused path with tasks you can
            actually complete.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="min-w-0">
                <p className="text-body font-medium text-ink">{feature.title}</p>
                <p className="mt-0.5 text-caption text-ink-2">{feature.description}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Ready to start building?" caption="Generate your first roadmap in under a minute. Pick a stack, choose your level, and start learning.">
          <Button variant="secondary" icon={iconFor("Generate your roadmap")} onClick={handleGetStarted}>
            Generate your roadmap
          </Button>
        </Panel>

        <footer className="flex flex-col gap-4 border-t border-line pt-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-body font-medium text-ink">StackStep</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Sign in
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/signup")}>
                Sign up
              </Button>
              {auth.isAuthenticated && (
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
              )}
            </div>
          </div>
          <p className="text-caption text-ink-2">
            © {new Date().getFullYear()} StackStep. All rights reserved.
          </p>
        </footer>
      </div>
    </AppShell>
  );
}
