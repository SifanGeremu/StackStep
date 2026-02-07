'use client';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import DashboardPage from '@/pages/DashboardPage'
import GeneratePage from '@/pages/GeneratePage'
import ProjectDetailPage from '@/pages/ProjectDetailPage'
import ProtectedRoute from '@/components/ProtectedRoute'

/**
 * Main App Component
 * Handles routing and authentication state
 */
export default function App() {
  const auth = useAuth()

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage auth={auth} />} />
        <Route path="/login" element={<LoginPage auth={auth} />} />
        <Route path="/signup" element={<SignupPage auth={auth} />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
              <DashboardPage auth={auth} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate"
          element={
            <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
              <GeneratePage auth={auth} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
              <ProjectDetailPage auth={auth} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast Notifications */}
      <Toaster
        position="bottom-right"
        theme="light"
        toastOptions={{
          style: {
            background: '#FAF3E1',
            color: '#222222',
            borderColor: '#E8DFD3',
          },
        }}
      />
    </Router>
  )
}
