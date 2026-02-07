import axios from "axios";

//import base url from env
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Bearer token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401 responses (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const apiService = {
  // === AUTH ENDPOINTS ===
  // TODO: Implement these on backend at /api/auth/...

  /**
   * Login with email and password
   * Expected: POST /api/auth/login
   * Body: { email: string, password: string }
   * Response: { token: string, user: { id, email } }
   */
  login: async (email: string, password: string) => {
    return api.post("/api/auth/login", { email, password });
  },

  /**
   * Signup with email and password
   * Expected: POST /api/auth/signup
   * Body: { email: string, password: string }
   * Response: { token: string, user: { id, email } }
   */
  signup: (email: string, password: string, name: string) =>
    api.post("/api/auth/register", { email, password, name }),

  // === PROJECT ENDPOINTS ===
  // TODO: Implement these on backend at /api/projects/...

  /**
   * Generate a new roadmap
   * Expected: POST /api/projects/generate
   * Body: { techStack: string, experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' }
   * Response: { id, title, techStack, experienceLevel, phases: [...], createdAt }
   */
  generateRoadmap: async (techStack: string, experienceLevel: string) => {
    return api.post("/api/projects/generate", { techStack, experienceLevel });
  },

  /**
   * Get all projects for current user
   * Expected: GET /api/projects
   * Response: Array of project objects
   */
  getProjects: async () => {
    return api.get("/api/projects");
  },

  /**
   * Get a specific project by ID
   * Expected: GET /api/projects/:id
   * Response: Project object with full details including phases and tasks
   */
  getProjectById: async (id: string) => {
    return api.get(`/api/projects/${id}`);
  },

  /**
   * Optional: Delete a project
   * Expected: DELETE /api/projects/:id
   * Response: { success: true }
   */
  deleteProject: async (id: string) => {
    return api.delete(`/api/projects/delete/${id}`);
  },
};

export default api;
