#!/bin/bash

# StackStep Frontend - Directory Tree

# To generate this tree, run: npm install && npm run build
# The project structure is shown below

cat << 'EOF'

📦 stackstep-frontend/
 ├── 📄 index.html                        # HTML entry point
 ├── 📄 vite.config.ts                    # Vite configuration
 ├── 📄 tsconfig.json                     # TypeScript configuration
 ├── 📄 tsconfig.node.json                # TypeScript Node config
 ├── 📄 tailwind.config.js                # Tailwind CSS theme & colors
 ├── 📄 postcss.config.js                 # PostCSS configuration
 ├── 📄 package.json                      # Dependencies & scripts
 ├── 📄 .env.example                      # Environment variables template
 ├── 📄 .gitignore                        # Git ignore rules
 │
 ├── 📚 Documentation (Start here!)
 │   ├── 📄 README.md                     # Full documentation
 │   ├── 📄 QUICKSTART.md                 # 30-second setup guide
 │   ├── 📄 BACKEND_INTEGRATION.md        # API integration guide
 │   └── 📄 PROJECT_STRUCTURE.md          # This structure reference
 │
 ├── 📁 src/
 │   │
 │   ├── 📄 main.tsx                      # React entry point
 │   ├── 📄 App.tsx                       # Main app & router
 │   ├── 📄 index.css                     # Global Tailwind styles
 │   │
 │   ├── 📂 pages/ (6 page components)
 │   │   ├── HomePage.tsx                 # Public: Landing page
 │   │   ├── LoginPage.tsx                # Public: Sign in form
 │   │   ├── SignupPage.tsx               # Public: Sign up form
 │   │   ├── DashboardPage.tsx            # Protected: Projects grid
 │   │   ├── GeneratePage.tsx             # Protected: Create roadmap
 │   │   └── ProjectDetailPage.tsx        # Protected: Roadmap detail + accordion
 │   │
 │   ├── 📂 components/ (Reusable components)
 │   │   ├── ProtectedRoute.tsx           # Route guard for auth
 │   │   ├── Navbar.tsx                   # Navigation bar
 │   │   └── LoadingSpinner.tsx           # Loading indicator
 │   │
 │   ├── 📂 hooks/ (Custom React hooks)
 │   │   └── useAuth.ts                   # Authentication state hook
 │   │
 │   └── 📂 lib/ (Utilities & services)
 │       ├── api.ts                       # Axios API client + interceptors
 │       └── utils.ts                     # Helper functions
 │
 └── 📁 dist/ (After npm run build)
     ├── index.html
     ├── assets/
     │   ├── index-XXXXX.js               # Minified JS
     │   ├── index-XXXXX.css              # Compiled CSS
     │   └── ... (other assets)
     └── ... (static files)

═══════════════════════════════════════════════════════════════════════════════

QUICK REFERENCE PATHS
═════════════════════════════════════════════════════════════════════════════

Starting the project:
  npm install                             # Install all dependencies
  npm run dev                             # Start dev server (http://localhost:5173)
  npm run build                           # Build for production

Key files to edit for API integration:
  src/lib/api.ts                          # Add/modify API endpoints
  src/pages/LoginPage.tsx                 # Connect login endpoint
  src/pages/SignupPage.tsx                # Connect signup endpoint
  src/pages/DashboardPage.tsx             # Connect projects list
  src/pages/GeneratePage.tsx              # Connect generate roadmap
  src/pages/ProjectDetailPage.tsx         # Connect project details

Configuration files:
  .env.example → .env.local               # Environment variables
  tailwind.config.js                      # Theme colors & spacing
  vite.config.ts                          # Build & dev server config

═══════════════════════════════════════════════════════════════════════════════

COLOR PALETTE (defined in tailwind.config.js)
═════════════════════════════════════════════════════════════════════════════

  Background:     #FAF3E1  (Soft Warm Cream)
  Accent:         #FA8112  (Bright Orange)
  Accent Hover:   #E07010  (Darker Orange)
  Text Primary:   #222222  (Deep Dark Gray)
  Text Light:     #666666  (Medium Gray)
  Card Background:#FFFBF5  (Cream Variant)
  Border Color:   #E8DFD3  (Light Brown)

═══════════════════════════════════════════════════════════════════════════════

ROUTES
═════════════════════════════════════════════════════════════════════════════

  Public Routes:
    /               → HomePage (landing page)
    /login          → LoginPage (sign in form)
    /signup         → SignupPage (sign up form)

  Protected Routes (require login):
    /dashboard      → DashboardPage (projects grid)
    /generate       → GeneratePage (create roadmap form)
    /projects/:id   → ProjectDetailPage (roadmap with accordion)

  Catch-all:
    *               → Redirect to /

═════════════════════════════════════════════════════════════════════════════

PACKAGE DEPENDENCIES
═════════════════════════════════════════════════════════════════════════════

  React Ecosystem:
    - react                         UI library
    - react-dom                     React DOM rendering
    - react-router-dom              Routing (v6)

  HTTP & State:
    - axios                         HTTP client
    - sonner                        Toast notifications

  Styling & UI:
    - tailwindcss                   Utility CSS
    - lucide-react                  Icon library
    - clsx                          Classname utilities
    - class-variance-authority      CSS-in-JS variants

  Build Tools:
    - vite                          Build tool (fast)
    - typescript                    Static typing
    - postcss                       CSS processing
    - autoprefixer                  Browser prefixes

═════════════════════════════════════════════════════════════════════════════

FILE SIZES (approximate)
═════════════════════════════════════════════════════════════════════════════

  Source Code:
    pages/           ~1.2 KB (LoginPage, SignupPage, DashboardPage, etc.)
    components/      ~0.3 KB
    hooks/           ~0.2 KB
    lib/             ~0.4 KB
    styles/          ~0.2 KB
    App.tsx          ~0.1 KB

  Production Build (dist/):
    Main JS bundle   ~50 KB (gzipped ~15 KB)
    CSS bundle       ~30 KB (gzipped ~5 KB)
    Total            ~100 KB (gzipped ~20 KB)

═════════════════════════════════════════════════════════════════════════════

NEXT STEPS
═════════════════════════════════════════════════════════════════════════════

1. ✅ Run: npm install && npm run dev
2. ✅ Test UI with mock data (included by default)
3. ✅ Build backend with endpoints from BACKEND_INTEGRATION.md
4. ✅ Replace TODO comments in page components with real API calls
5. ✅ Update .env.local with backend URL
6. ✅ Deploy to Vercel/Netlify (see README.md for instructions)

═════════════════════════════════════════════════════════════════════════════

DOCUMENTATION LINKS
═════════════════════════════════════════════════════════════════════════════

  README.md                       Full documentation
  QUICKSTART.md                   30-second setup guide
  BACKEND_INTEGRATION.md          How to connect backend API
  PROJECT_STRUCTURE.md            Detailed file breakdown
  react.dev                       React documentation
  reactrouter.com                 React Router docs
  tailwindcss.com                 Tailwind CSS docs
  vitejs.dev                      Vite documentation

═════════════════════════════════════════════════════════════════════════════

EOF

EOF
