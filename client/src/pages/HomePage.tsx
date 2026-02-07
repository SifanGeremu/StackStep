"use client";

import { useNavigate, Link } from "react-router-dom";
import { AuthState } from "@/hooks/useAuth";

interface HomePageProps {
  auth: AuthState;
}

export default function HomePage({ auth }: HomePageProps) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (auth.isAuthenticated) {
      navigate("/generate");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold text-text hidden sm:inline">
                StackStep
              </span>
            </div>

            {/* Auth Links */}
            <div className="flex items-center gap-4">
              {auth.isAuthenticated ? (
                <>
                  <span className="text-text-light text-sm hidden sm:inline">
                    {auth.userEmail}
                  </span>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-accent font-semibold hover:bg-accent hover:text-white rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors hidden sm:inline-block"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-20">
        {/* Subtle background accent */}
        <div className="pointer-events-none absolute -top-16 -left-20 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-accent/20 to-purple-200 blur-3xl opacity-60" />

        <div className="max-w-4xl w-full text-center space-y-10 z-10">
          {/* Title */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-text leading-tight tracking-tight">
              Learn Tech Stacks by Building Real Projects
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-text-light max-w-3xl mx-auto">
              Generate phased, beginner-friendly project roadmaps for any tech
              stack — clear, actionable tasks to help you learn by building.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              aria-label="Get started"
              className="inline-flex items-center justify-center px-10 py-4 bg-accent text-white text-lg font-semibold rounded-full hover:bg-accent-hover transition-all shadow-xl transform-gpu hover:-translate-y-0.5 active:scale-95"
            >
              Get Started
            </button>

            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-6 py-3 bg-background border border-border-color text-text font-medium rounded-full hover:bg-gray-50 transition"
            >
              Create account
            </Link>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center mb-4 mx-auto shadow-md">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-text mb-2">
                Tell Us Your Stack
              </h3>
              <p className="text-text-light text-sm">
                Enter any tech stack (MERN, Next.js + Tailwind, Django +
                Postgres)
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center mb-4 mx-auto shadow-md">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-text mb-2">Get a Roadmap</h3>
              <p className="text-text-light text-sm">
                Our AI creates phased, beginner-friendly plans
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center mb-4 mx-auto shadow-md">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-text mb-2">
                Learn by Building
              </h3>
              <p className="text-text-light text-sm">
                Follow clear, actionable tasks and build real projects
              </p>
            </div>
          </div>

          {/* Call to Action Footer */}
          <div className="mt-12 pt-8 border-t-2 border-border-color">
            <p className="text-text-light mb-4">
              Ready to start your learning journey?
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-block px-8 py-3 bg-accent text-white text-lg font-semibold rounded-full hover:bg-accent-hover transition-all hover:shadow-lg active:scale-95"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card-bg border-t-2 border-border-color py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-text-light text-sm">
          <p>&copy; 2024 StackStep. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
