import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ToastProvider from "@/formic/components/Toast";
import { useAuth } from "@/hooks/useAuth";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import GeneratePage from "@/pages/GeneratePage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import ProtectedRoute from "@/components/ProtectedRoute";

/**
 * Main App Component
 * Handles routing and authentication state
 */
export default function App() {
  const auth = useAuth();

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage auth={auth} />} />
          <Route path="/login" element={<LoginPage auth={auth} />} />
          <Route path="/signup" element={<SignupPage auth={auth} />} />

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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}
