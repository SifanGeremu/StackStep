# Backend Integration Guide

This guide shows how to connect the StackStep frontend to your backend API.

## 🔌 Current State

The frontend includes **mock data and mock API calls** for testing UI without a backend.

## 🎯 Integration Checklist

### Step 1: Update Environment Variables

Create or update `.env.local`:

```env
VITE_API_URL=http://localhost:5000
```

For production, update to your deployed API URL:

```env
VITE_API_URL=https://api.stackstep.com
```

### Step 2: Implement Backend Endpoints

Your backend must implement these endpoints. See expected request/response formats below.

### Step 3: Replace Mock Calls

Find all `// TODO:` comments and uncomment the real API calls.

Search for: `TODO:` in your editor to find all 6 integration points.

---

## 📡 Backend Endpoint Specifications

### Authentication Endpoints

#### POST `/api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@example.com"
  }
}
```

**Error (401):**
```json
{
  "message": "Invalid email or password"
}
```

**Frontend Integration:**
File: `src/pages/LoginPage.tsx` (line ~50)

From:
```tsx
// Mock successful login for demo purposes
const token = `token_${Date.now()}`
auth.login(token, email)
```

To:
```tsx
const response = await apiService.login(email, password)
const { token, user } = response.data
auth.login(token, user.email)
```

---

#### POST `/api/auth/signup`

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_456",
    "email": "newuser@example.com"
  }
}
```

**Error (400):**
```json
{
  "message": "Email already exists"
}
```

**Frontend Integration:**
File: `src/pages/SignupPage.tsx` (line ~60)

From:
```tsx
// Mock successful signup for demo purposes
const token = `token_${Date.now()}`
auth.login(token, email)
```

To:
```tsx
const response = await apiService.signup(email, password)
const { token, user } = response.data
auth.login(token, user.email)
```

---

### Project Endpoints

#### GET `/api/projects`

Returns all projects for the authenticated user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": "proj_1",
    "title": "Build a Blog with MERN",
    "techStack": "MongoDB, Express, React, Node.js",
    "experienceLevel": "Beginner",
    "description": "Learn full-stack development by building a blog app",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "proj_2",
    "title": "Next.js E-Commerce Site",
    "techStack": "Next.js, Tailwind CSS, Prisma, PostgreSQL",
    "experienceLevel": "Intermediate",
    "description": "Build a modern e-commerce platform",
    "createdAt": "2024-01-10T15:45:00Z"
  }
]
```

**Frontend Integration:**
File: `src/pages/DashboardPage.tsx` (line ~40)

From:
```tsx
// Mock data for demo
const mockProjects = [...]
setProjects(mockProjects)
```

To:
```tsx
const response = await apiService.getProjects()
setProjects(response.data)
```

---

#### POST `/api/projects/generate`

Generates a new roadmap using LLM.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "techStack": "MERN Stack (MongoDB, Express, React, Node.js)",
  "experienceLevel": "Beginner"
}
```

**Response (201):**
```json
{
  "id": "proj_3",
  "title": "Learn MERN Stack: Build a Blog",
  "techStack": "MongoDB, Express, React, Node.js",
  "experienceLevel": "Beginner",
  "description": "A comprehensive guide to building a full-stack blog application...",
  "phases": [
    {
      "id": "phase_1",
      "title": "Phase 1: Project Setup & Basics",
      "description": "Initialize your project and understand the fundamentals",
      "tasks": [
        {
          "id": "task_1",
          "title": "Setup Node.js and npm",
          "description": "Install Node.js and npm on your machine. Learn about package management.",
          "expectedOutcome": "Node.js and npm installed, verified with `node -v` and `npm -v`"
        }
      ]
    }
  ],
  "createdAt": "2024-01-20T12:00:00Z"
}
```

**Error (400):**
```json
{
  "message": "Invalid tech stack or experience level"
}
```

**Frontend Integration:**
File: `src/pages/GeneratePage.tsx` (line ~40)

From:
```tsx
// Mock successful generation for demo purposes
const mockProjectId = `project_${Date.now()}`
```

To:
```tsx
const response = await apiService.generateRoadmap(techStack, experienceLevel)
const { id } = response.data
```

---

#### GET `/api/projects/:id`

Gets full details of a single project including all phases and tasks.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "proj_1",
  "title": "Build a Blog with MERN Stack",
  "techStack": "MongoDB, Express, React, Node.js",
  "experienceLevel": "Beginner",
  "description": "Learn full-stack web development by building a feature-rich blog application using the MERN stack.",
  "phases": [
    {
      "id": "phase_1",
      "title": "Phase 1: Project Setup & Basics",
      "description": "Initialize your project and understand the fundamentals",
      "tasks": [
        {
          "id": "task_1",
          "title": "Setup Node.js and npm",
          "description": "Install Node.js and npm on your machine. Learn about package management.",
          "expectedOutcome": "Node.js and npm installed, verified with `node -v` and `npm -v`"
        },
        {
          "id": "task_2",
          "title": "Create Express server",
          "description": "Initialize a new Node project and create a basic Express server.",
          "expectedOutcome": "Server running on http://localhost:5000 with a hello world route"
        }
      ]
    },
    {
      "id": "phase_2",
      "title": "Phase 2: Build API Routes",
      "description": "Create RESTful API endpoints for your blog",
      "tasks": [...]
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error (404):**
```json
{
  "message": "Project not found"
}
```

**Frontend Integration:**
File: `src/pages/ProjectDetailPage.tsx` (line ~55)

From:
```tsx
// Mock data for demo
const mockProject = {...}
setProject(mockProject)
```

To:
```tsx
const response = await apiService.getProjectById(id!)
setProject(response.data)
```

---

## 🔐 Authentication Details

### Token Format

Expected JWT format:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...
```

### How Frontend Sends Token

The axios interceptor in `src/lib/api.ts` automatically adds the token to all requests:

```tsx
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 401 Handling

When backend returns 401 (unauthorized):
- Frontend clears token from localStorage
- User is redirected to `/login`
- They see the login page

---

## 🧪 Testing Integration

### 1. Test Login

```bash
# Frontend: Go to http://localhost:3000/login
# Enter any email and password
# Expected: Redirects to /dashboard, token in localStorage
```

Check browser DevTools Console:
```
localStorage.getItem('token') // Should show token
localStorage.getItem('userEmail') // Should show email
```

### 2. Test API Calls

Use Network tab in DevTools to see requests:
- Headers should include: `Authorization: Bearer {token}`
- Response should match expected format

### 3. Check Error Handling

Try these error scenarios:
- Invalid credentials on login
- Expired/invalid token (backend returns 401)
- Network error (no backend running)

Frontend should show toast errors for all cases.

---

## 🚀 Deployment

### Environment Variables

**Development (.env.local):**
```
VITE_API_URL=http://localhost:5000
```

**Production (deploy to Vercel, set in dashboard):**
```
VITE_API_URL=https://api.stackstep.com
```

### CORS Setup

Your backend must allow CORS from frontend URL:

**Express example:**
```js
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173', 'https://stackstep.vercel.app'],
  credentials: true
}));
```

---

## 📋 API Client Reference

All API calls use the client in `src/lib/api.ts`:

```tsx
import { apiService } from '@/lib/api'

// Login
const response = await apiService.login(email, password)

// Signup
const response = await apiService.signup(email, password)

// Get projects
const response = await apiService.getProjects()

// Generate roadmap
const response = await apiService.generateRoadmap(techStack, level)

// Get project details
const response = await apiService.getProjectById(projectId)

// Delete project (optional)
const response = await apiService.deleteProject(projectId)
```

---

## ❓ Troubleshooting

### "CORS error"
- Enable CORS on backend
- Verify frontend URL is in CORS allowlist

### "401 error after login"
- Check token is being returned from API
- Verify Authorization header format
- Check backend is validating token correctly

### "Mock data still showing"
- Make sure you uncommented/replaced the API calls
- Check browser DevTools Network tab for actual API requests
- Hard refresh (Ctrl+Shift+R) to clear cache

### "API not found"
- Verify backend is running on correct port
- Check VITE_API_URL in .env.local
- Restart frontend dev server after env changes

---

**Questions? Check the files marked with `// TODO:` for specific line numbers to update.**
