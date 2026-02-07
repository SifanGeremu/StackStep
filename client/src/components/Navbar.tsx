'use client';

import { LogOut, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthState } from '@/hooks/useAuth'

interface NavbarProps {
  auth: AuthState & { logout: () => void }
}

/**
 * Navigation bar for protected pages
 * Shows logo, "Generate New" button, user email, and logout
 */
export default function Navbar({ auth }: NavbarProps) {
  const handleLogout = () => {
    auth.logout()
    window.location.href = '/'
  }

  return (
    <nav className="bg-white border-b-2 border-border-color sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-2xl font-bold text-text hidden sm:inline">
              StackStep
            </h1>
          </Link>

          {/* Center: Generate New Button */}
          <Link
            to="/generate"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-accent-hover transition-colors"
          >
            <Plus size={20} />
            Generate New
          </Link>

          {/* Right: User Email & Logout */}
          <div className="flex items-center gap-4">
            <span className="text-text-light text-sm hidden sm:inline">
              {auth.userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-background rounded-lg transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={20} className="text-accent" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
