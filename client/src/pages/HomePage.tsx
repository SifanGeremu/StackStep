'use client';

import { useNavigate, Link } from 'react-router-dom'
import { AuthState } from '@/hooks/useAuth'

interface HomePageProps {
  auth: AuthState
}

/**
 * Landing / Home Page
 * Public page showing StackStep pitch
 * CTA button redirects to /login if not authenticated or /generate if authenticated
 */
export default function HomePage({ auth }: HomePageProps) {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (auth.isAuthenticated) {
      navigate('/generate')
    } else {
      navigate('/login')
    }
  }

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
      <section className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-text leading-tight text-balance">
              Learn Tech Stacks by Building
            </h1>
            <p className="text-xl sm:text-2xl text-text-light max-w-2xl mx-auto text-balance">
              Generate beginner-friendly phased project roadmaps for any tech
              stack — no code dumps, just clear tasks to learn by building.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleGetStarted}
            className="inline-block px-8 py-4 bg-accent text-white text-lg font-bold rounded-lg hover:bg-accent-hover transition-all hover:shadow-lg active:scale-95"
          >
            Get Started
          </button>

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="card">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-bold text-text mb-2">Tell Us Your Stack</h3>
              <p className="text-text-light text-sm">
                Enter any tech stack (MERN, Next.js + Tailwind, etc.)
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-bold text-text mb-2">Get a Roadmap</h3>
              <p className="text-text-light text-sm">
                Our AI generates a phased, beginner-friendly roadmap
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-bold text-text mb-2">Learn by Building</h3>
              <p className="text-text-light text-sm">
                Follow clear, actionable tasks and build projects
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
              className="inline-block px-8 py-4 bg-accent text-white text-lg font-bold rounded-lg hover:bg-accent-hover transition-all hover:shadow-lg active:scale-95"
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
  )
}
