# StackStep

StackStep helps developers learn tech stacks by generating phased, project-based roadmaps. It pairs an LLM-driven planner with opinionated, actionable tasks so learners can "learn by building" instead of reading large dumps.

This README highlights the architecture, why this project matters, how to run it locally, and where to look when evaluating the code — useful for recruiters and engineers reviewing the repository.

---

## Elevator Pitch

- Purpose: Turn a simple tech-stack prompt (e.g. "MERN", "Next.js + Tailwind") into a structured, phased roadmap of projects and tasks.
- Audience: Junior-to-intermediate developers who want guided, project-based learning.
- What to look for: clear API boundaries, secure auth, well-structured frontend with reusable components, and the server's LLM orchestration logic.

---

## Highlights / Notable Features

- LLM-driven roadmap generation (server-side service).
- User accounts + JWT authentication.
- Per-user projects and phases with tasks and definition-of-done (DoD).
- Responsive React frontend (Vite + Tailwind) with accessible components.
- Focus on developer experience: clean components, clear data shapes, and small, testable services.

---

## Tech Stack

- Frontend: React, Vite, TypeScript (mix of tsx/tsx), TailwindCSS
- Backend: Node.js (ESM), Express, Mongoose (MongoDB)
- Auth: JWT
- LLM integration: server-side service (llm.service.js)
- Tooling: Sonner for toasts, Lucide icons, axios for HTTP

---

## Quick Setup (Local)

Requirements:

- Node.js 18+ and npm (or pnpm)
- MongoDB running locally or a hosted connection

1. Install dependencies

```bash
# from repo root
cd client
npm install

cd ../server
npm install
```

2. Environment

- Server: create `.env` or set env vars
  - `MONGO_URI` — MongoDB connection string
  - `JWT_SECRET` — JWT signing secret (use strong secret in prod)
  - `PORT` — optional (default 5000)

- Client: create `.env` in `client/` if needed
  - `VITE_API_URL` — e.g. `http://localhost:5000`

3. Start services

```bash
# server (from server/)
npm run dev

# client (from client/)
npm run dev
```

Open `http://localhost:5173` (Vite default) to view the app.

---

## How It Works — Short Walkthrough

- Frontend `Generate` page posts `{ techStack, experienceLevel }` to `POST /api/projects/generate`.
- Server invokes `llm.service.js` to compose a phased plan (phases, tasks, DoD).
- `projectService.saveProject()` persists the plan to MongoDB with owner information.
- Users can view their projects at `/dashboard` and project details at `/projects/:id`.

Key server files to review:

- `server/service/llm.service.js` — LLM prompt composition and parsing
- `server/service/projectService.js` — project persistence
- `server/controller/*.js` — route handlers (create, get, delete)

Key frontend files:

- `client/src/pages/GeneratePage.tsx` — form to create a roadmap
- `client/src/pages/ProjectDetailPage.tsx` — phase/task rendering (DoD visible)
- `client/src/hooks/useAuth.ts` — auth state management

---

## API (selected endpoints)

- POST `/api/projects/generate` — Generate a roadmap. Body: `{ techStack, experienceLevel }`.
- GET `/api/projects` — List authenticated user's projects (JWT required).
- GET `/api/projects/:id` — Fetch project detail (owner-only).
- DELETE `/api/projects/:id` — Delete project (owner-only).
- POST `/api/auth/register` — Register; returns `{ token, user }` on success.
- POST `/api/auth/login` — Login; returns `{ token, user }`.

All protected endpoints require `Authorization: Bearer <token>` header.

---

## Security & Data Considerations

- JWT-based auth with token stored in `localStorage` (auth pattern is simple and pragmatic for a demo app; for production, consider httpOnly cookies).
- Projects are stored with a `user` ObjectId — endpoints enforce ownership checks.
- LLM outputs are validated before save; untrusted LLM content should be sanitized and treated as user-provided content.

---

## What to Inspect for a Review (Recruiter Guidance)

- Code organization and separation of concerns (service vs controller vs routes).
- Error handling and input validation (`express-validator` usage + controller checks).
- Auth flow and secure ownership checks.
- Frontend component design (reusability, small components, layout).
- LLM prompt handling and robustness to unexpected outputs.

---

## Development Notes

- The project uses plain Tailwind component classes plus a small UI wrapper library in `client/components/ui`.
- To change the LLM behavior, examine `server/service/prompt.service.js` and `llm.service.js`.

---

## Contributing

- Fork, create a branch, open a PR with focused changes.
- Keep changes small and include tests where applicable.

---

## License & Contact

This repo is provided for demonstration and interviewing purposes. Include a LICENSE file if you want to make the project open-source.

For questions or a walkthrough, contact: [Your Name] — replace with a direct email or LinkedIn in the repo.

---

Thank you for reviewing StackStep — the codebase is intentionally compact and focused on delivering a production-like experience with an emphasis on learning-by-building workflows.
