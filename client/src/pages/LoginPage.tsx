"use client";

import React from "react";

import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiService } from "@/lib/api";
import { AuthState } from "@/hooks/useAuth";

interface LoginPageProps {
  auth: AuthState & { login: (token: string, email: string) => void };
}

export default function LoginPage({ auth }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  console.log("Current API base URL:", import.meta.env.VITE_API_URL);
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [auth.isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.login(email, password);

      const { token, user } = response.data;

      auth.login(token, user?.email || email);

      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">StackStep</h1>
          <p className="text-text-light">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className="card space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-text mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-text mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border-color" />
            <span className="text-text-light text-xs">OR</span>
            <div className="flex-1 h-px bg-border-color" />
          </div>

          {/* Signup Link */}
          <p className="text-center text-text-light text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-accent font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
