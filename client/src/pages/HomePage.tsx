import { useNavigate, Link } from "react-router-dom";
import {
  Layers,
  Map,
  Hammer,
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  Target,
  ListChecks,
  BookOpen,
} from "lucide-react";
import { AuthState } from "@/hooks/useAuth";

interface HomePageProps {
  auth: AuthState;
}

const STACKS = [
  "MERN",
  "Next.js + Tailwind",
  "React + Firebase",
  "Django + PostgreSQL",
  "Go + React",
  "FastAPI + Vue",
];

const STEPS = [
  {
    icon: Layers,
    title: "Describe your stack",
    description:
      "Enter any combination of technologies — frameworks, databases, and tools.",
  },
  {
    icon: Sparkles,
    title: "Get a phased roadmap",
    description:
      "AI generates a structured plan with phases, tasks, and clear outcomes.",
  },
  {
    icon: Hammer,
    title: "Build and track progress",
    description:
      "Work through actionable tasks and mark them complete as you learn.",
  },
];

const FEATURES = [
  {
    icon: Target,
    title: "Project-based learning",
    description:
      "Every roadmap centers on building real projects, not passive tutorials.",
  },
  {
    icon: ListChecks,
    title: "Actionable tasks",
    description:
      "Each phase breaks down into concrete steps with expected outcomes.",
  },
  {
    icon: BookOpen,
    title: "Tailored to your level",
    description:
      "Choose beginner, intermediate, or advanced to match where you are.",
  },
  {
    icon: Map,
    title: "Structured phases",
    description:
      "Progress from foundations to deployment with a clear learning path.",
  },
];

function RoadmapPreview() {
  return (
    <div className="card p-0 overflow-hidden shadow-xl border-border-color/80">
      <div className="px-5 py-4 border-b border-border-color bg-white flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-accent uppercase tracking-wider">
            Sample roadmap
          </p>
          <h3 className="font-semibold text-text mt-0.5">MERN Stack</h3>
        </div>
        <span className="text-xs text-text-light bg-background px-2.5 py-1 rounded-full">
          Beginner
        </span>
      </div>

      <div className="p-4 space-y-3 bg-card-bg">
        <div className="rounded-lg border border-border-color bg-white overflow-hidden">
          <div className="px-4 py-3 flex items-center gap-3 border-b border-border-color">
            <span className="w-7 h-7 rounded-md bg-accent text-white text-sm font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <div className="min-w-0">
              <p className="font-medium text-text text-sm">Foundation Setup</p>
              <p className="text-xs text-text-light truncate">
                Project structure & tooling
              </p>
            </div>
          </div>
          <div className="px-4 py-3 space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm">
              <CheckCircle2 size={16} className="text-accent shrink-0" />
              <span className="text-text-light line-through">
                Initialize monorepo
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <CheckCircle2 size={16} className="text-accent shrink-0" />
              <span className="text-text">Configure MongoDB connection</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Circle size={16} className="text-border-color shrink-0" />
              <span className="text-text-light">Set up Express API routes</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border-color bg-white px-4 py-3 flex items-center gap-3 opacity-70">
          <span className="w-7 h-7 rounded-md bg-accent/20 text-accent text-sm font-bold flex items-center justify-center shrink-0">
            2
          </span>
          <div className="min-w-0">
            <p className="font-medium text-text text-sm">REST API & Auth</p>
            <p className="text-xs text-text-light">JWT, CRUD endpoints</p>
          </div>
        </div>

        <div className="rounded-lg border border-border-color bg-white px-4 py-3 flex items-center gap-3 opacity-50">
          <span className="w-7 h-7 rounded-md bg-accent/20 text-accent text-sm font-bold flex items-center justify-center shrink-0">
            3
          </span>
          <div className="min-w-0">
            <p className="font-medium text-text text-sm">React Frontend</p>
            <p className="text-xs text-text-light">Components & state</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ auth }: HomePageProps) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(auth.isAuthenticated ? "/generate" : "/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-accent rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base sm:text-lg">
                  S
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-text">
                StackStep
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              {auth.isAuthenticated ? (
                <>
                  <span className="text-text-light text-sm hidden md:inline">
                    {auth.userEmail}
                  </span>
                  <Link to="/dashboard" className="btn-primary text-sm sm:text-base">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 sm:px-4 py-2 text-accent font-semibold hover:bg-accent/5 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary text-sm sm:text-base hidden sm:inline-flex"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-accent/15 to-orange-100 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-accent/10 to-amber-50 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20 lg:pt-28 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border-color text-sm text-text-light">
                <Sparkles size={14} className="text-accent" />
                AI-powered learning roadmaps
              </div>

              <div className="space-y-5">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text leading-[1.1] tracking-tight text-balance">
                  Learn tech stacks by building real projects
                </h1>
                <p className="text-lg sm:text-xl text-text-light max-w-xl leading-relaxed">
                  Turn any stack into a phased, beginner-friendly roadmap with
                  clear tasks and outcomes — so you learn by doing, not just
                  reading.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleGetStarted} className="btn-primary inline-flex items-center justify-center gap-2 text-base px-8 py-3.5 rounded-full shadow-lg shadow-accent/20">
                  Start learning
                  <ArrowRight size={18} />
                </button>
                <Link
                  to={auth.isAuthenticated ? "/dashboard" : "/signup"}
                  className="btn-secondary inline-flex items-center justify-center text-base px-8 py-3.5 rounded-full"
                >
                  {auth.isAuthenticated ? "View projects" : "Create free account"}
                </Link>
              </div>

              <p className="text-sm text-text-light">
                No credit card required · Works with any tech stack
              </p>
            </div>

            <div className="lg:pl-4">
              <RoadmapPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Supported stacks */}
      <section className="border-y border-border-color bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-text-light mb-6">
            Popular stacks learners start with
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {STACKS.map((stack) => (
              <span
                key={stack}
                className="px-4 py-2 rounded-full bg-background border border-border-color text-sm font-medium text-text"
              >
                {stack}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              From stack to roadmap in minutes
            </h2>
            <p className="text-text-light text-lg">
              Three simple steps to go from "I want to learn X" to a structured
              project plan you can follow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative card p-8 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <step.icon size={24} className="text-accent" />
                </div>
                <span className="text-xs font-bold text-accent/60 uppercase tracking-wider">
                  Step {i + 1}
                </span>
                <h3 className="font-semibold text-text text-lg mt-2 mb-3">
                  {step.title}
                </h3>
                <p className="text-text-light text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 bg-white border-y border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              Why StackStep
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Built for developers who learn by building
            </h2>
            <p className="text-text-light text-lg">
              Skip the endless tutorial rabbit holes. Get a focused path with
              tasks you can actually complete.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-5 p-6 rounded-xl border border-border-color bg-card-bg"
              >
                <div className="w-11 h-11 bg-accent rounded-lg flex items-center justify-center shrink-0">
                  <feature.icon size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-text-light text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-10 sm:p-14 bg-gradient-to-br from-white to-card-bg border-accent/20 shadow-lg">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Ready to start building?
            </h2>
            <p className="text-text-light text-lg mb-8 max-w-xl mx-auto">
              Generate your first roadmap in under a minute. Pick a stack, choose
              your level, and start learning.
            </p>
            <button
              onClick={handleGetStarted}
              className="btn-primary inline-flex items-center gap-2 text-base px-10 py-3.5 rounded-full shadow-lg shadow-accent/20"
            >
              Generate your roadmap
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card-bg border-t border-border-color py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-text">StackStep</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-text-light">
              <Link to="/login" className="hover:text-accent">
                Sign In
              </Link>
              <Link to="/signup" className="hover:text-accent">
                Sign Up
              </Link>
              {auth.isAuthenticated && (
                <Link to="/dashboard" className="hover:text-accent">
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border-color text-center text-text-light text-sm">
            <p>&copy; {new Date().getFullYear()} StackStep. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
