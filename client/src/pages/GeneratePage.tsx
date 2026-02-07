'use client';

import React from "react"

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import { apiService } from '@/lib/api'
import { AuthState } from '@/hooks/useAuth'

interface GeneratePageProps {
  auth: AuthState & { logout: () => void }
}

/**
 * Generate Page (Protected)
 * Form to create a new project roadmap
 * TODO: Connect to POST /api/projects/generate
 */
export default function GeneratePage({ auth }: GeneratePageProps) {
  const navigate = useNavigate()
  const [techStack, setTechStack] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('Beginner')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!techStack.trim()) {
      toast.error('Please enter a tech stack')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Replace with real API call to backend
      // const response = await apiService.generateRoadmap(techStack, experienceLevel)
      // const { id } = response.data

      // Mock successful generation for demo purposes
      const mockProjectId = `project_${Date.now()}`

      toast.success('Roadmap generated successfully!')
      navigate(`/projects/${mockProjectId}`)
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        'Failed to generate roadmap. Please try again.'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar auth={auth} />

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text mb-4">
              Generate Your Roadmap
            </h1>
            <p className="text-text-light text-lg">
              Tell us which tech stack you want to learn, and we'll create a
              phased roadmap tailored to your level.
            </p>
          </div>

          {/* Form Card */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Tech Stack Input */}
              <div>
                <label
                  htmlFor="techStack"
                  className="block text-sm font-semibold text-text mb-3"
                >
                  Tech Stack
                </label>
                <p className="text-text-light text-sm mb-4">
                  E.g., MERN, Next.js + Tailwind, React + Firebase, Django +
                  PostgreSQL
                </p>
                <textarea
                  id="techStack"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="Enter the technologies you want to learn..."
                  className="input-field resize-none h-24 font-sans"
                  disabled={isLoading}
                />
              </div>

              {/* Experience Level Select */}
              <div>
                <label
                  htmlFor="level"
                  className="block text-sm font-semibold text-text mb-3"
                >
                  Your Experience Level
                </label>
                <select
                  id="level"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="input-field font-sans"
                  disabled={isLoading}
                >
                  <option value="Beginner">Beginner - Just starting out</option>
                  <option value="Intermediate">
                    Intermediate - Some experience
                  </option>
                  <option value="Advanced">Advanced - Experienced developer</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-4 bg-accent text-white text-lg font-bold rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && <Loader size={20} className="animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Roadmap'}
              </button>

              {/* Help Text */}
              <div className="p-4 bg-background border-2 border-border-color rounded-lg">
                <p className="text-text-light text-sm">
                  💡 <strong>Tip:</strong> Be specific about the tech stack.
                  Include frameworks, databases, and tools you want to learn. Our
                  AI will create a phased roadmap with clear tasks for each phase.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
