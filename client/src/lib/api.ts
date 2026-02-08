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
  login: async (email: string, password: string) => {
    return api.post("/api/auth/login", { email, password });
  },

  signup: (email: string, password: string, name: string) =>
    api.post("/api/auth/register", { email, password, name }),

  generateRoadmap: async (techStack: string, experienceLevel: string) => {
    return api.post("/api/projects/generate", { techStack, experienceLevel });
  },

  getProjects: async () => {
    return api.get("/api/projects");
  },

  getProjectById: async (id: string) => {
    return api.get(`/api/projects/${id}`);
  },

  deleteProject: async (id: string) => {
    return api.delete(`/api/projects/delete/${id}`);
  },
};

export default api;
