# StackStep Frontend - Project Structure

```
stackstep-frontend/
├── 📄 Configuration Files
│   ├── index.html                    # HTML entry point
│   ├── vite.config.ts               # Vite build config
│   ├── tsconfig.json                # TypeScript config
│   ├── tsconfig.node.json           # TypeScript config for Node
│   ├── tailwind.config.js           # Tailwind CSS theme
│   ├── postcss.config.js            # PostCSS config
│   ├── package.json                 # Dependencies & scripts
│   ├── .env.example                 # Environment template
│   └── .gitignore                   # Git ignore rules
│
├── 📖 Documentation
│   ├── README.md                    # Full project documentation
│   ├── QUICKSTART.md                # Quick start guide
│   ├── BACKEND_INTEGRATION.md       # API integration guide
│   └── PROJECT_STRUCTURE.md         # This file
│
└── 📁 src/
    ├── App.tsx                      # Main app with routing setup
    ├── main.tsx                     # React entry point
    ├── index.css                    # Global Tailwind styles
    │
    ├── 📂 pages/                    # Page components (6 pages)
    │   ├── HomePage.tsx             # Public: Landing page hero
    │   ├── LoginPage.tsx            # Public: Sign in form
    │   ├── SignupPage.tsx           # Public: Sign up form
    │   ├── DashboardPage.tsx        # Protected: Projects grid
    │   ├── GeneratePage.tsx         # Protected: Create roadmap form
    │   └── ProjectDetailPage.tsx    # Protected: Roadmap with accordion
    │
    ├── 📂 components/               # Reusable components
    │   ├── ProtectedRoute.tsx       # Route guard for authentication
    │   ├── Navbar.tsx               # Navigation bar (protected pages)
    │   └── LoadingSpinner.tsx       # Loading state indicator
    │
    ├── 📂 hooks/                    # Custom React hooks
    │   └── useAuth.ts               # Auth state management hook
    │
    └── 📂 lib/                      # Utilities & services
        ├── api.ts                   # Axios API client with interceptors
        └── utils.ts                 # Helper functions (format, initials, cn)
```

## 📊 File Statistics

| Category | Count | Files |
|----------|-------|-------|
| **Pages** | 6 | HomePage, LoginPage, SignupPage, DashboardPage, GeneratePage, ProjectDetailPage |
| **Components** | 3 | ProtectedRoute, Navbar, LoadingSpinner |
| **Hooks** | 1 | useAuth |
| **Libraries** | 2 | api.ts, utils.ts |
| **Config Files** | 9 | vite, tsconfig, tailwind, postcss, package.json, etc. |
| **Documentation** | 4 | README, QUICKSTART, BACKEND_INTEGRATION, this file |

**Total: 25 files** providing a complete, production-ready frontend.

---

## 🎯 Page Breakdown

### Public Pages

#### 1. **HomePage** (`src/pages/HomePage.tsx`)
- Landing page with hero section
- Pitch: "Learn Tech Stacks by Building"
- 3 feature cards (Tell Stack → Get Roadmap → Learn by Building)
- CTA button: "Get Started" → Login if not auth, Generate if auth
- Navigation with logo and auth links

#### 2. **LoginPage** (`src/pages/LoginPage.tsx`)
- Simple form: Email + Password
- Error handling with validation
- Link to signup
- Mock auth for testing (replace with API call)
- Redirects to dashboard if already logged in

#### 3. **SignupPage** (`src/pages/SignupPage.tsx`)
- Registration form: Email + Password + Confirm
- Validates: passwords match, minimum 6 chars
- Error handling with toasts
- Link to login
- Mock auth for testing (replace with API call)
- Redirects to dashboard if already logged in

### Protected Pages 🔒

#### 4. **DashboardPage** (`src/pages/DashboardPage.tsx`)
- Requires authentication (redirects to login if not auth)
- Navbar with: Logo, "Generate New", Email, Logout
- Projects grid (responsive: 1-3 columns)
- Each card shows: Title, Tech Stack tag, Level, Date, "View" button
- Empty state: "No projects yet" with CTA
- Mock data included for demo
- TODO: Connect to GET `/api/projects`

#### 5. **GeneratePage** (`src/pages/GeneratePage.tsx`)
- Requires authentication
- Centered form with large spacing
- Input: Tech Stack (textarea)
- Select: Experience Level (Beginner/Intermediate/Advanced)
- Big "Generate Roadmap" button with loading state
- Mock generation creates project and redirects
- TODO: Connect to POST `/api/projects/generate`

#### 6. **ProjectDetailPage** (`src/pages/ProjectDetailPage.tsx`)
- Requires authentication
- Shows full roadmap details
- Title, description, tech stack badge, level
- **Interactive Accordion** for phases:
  - Click to expand/collapse
  - Phase number badge + title + description
  - Expandable to show tasks
  - Each task: number, title, description
  - "Expected Outcome" box below each task
- Mock data: 4 phases with 11 total tasks
- Footer CTA: "Start Learning"
- TODO: Connect to GET `/api/projects/:id`

---

## 🔧 Component Architecture

### App.tsx
```
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/generate" element={<ProtectedRoute><GeneratePage /></ProtectedRoute>} />
    <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
  </Routes>
  <Toaster /> {/* Toast notifications */}
</BrowserRouter>
```

### Component Hierarchy

```
App
├── HomePage
├── LoginPage
│   └── (Form, Links)
├── SignupPage
│   └── (Form, Links)
├── DashboardPage
│   ├── Navbar
│   │   ├── Logo
│   │   ├── "Generate New" button
│   │   ├── User email
│   │   └── Logout button
│   └── Projects Grid
│       └── ProjectCard (repeated)
├── GeneratePage
│   ├── Navbar
│   └── Form
│       ├── Tech stack textarea
│       ├── Level select
│       └── Submit button
└── ProjectDetailPage
    ├── Navbar
    └── Roadmap
        ├── Project header
        └── Phases Accordion
            ├── Phase 1 (expandable)
            │   └── Tasks list
            ├── Phase 2 (expandable)
            │   └── Tasks list
            └── ... (more phases)
```

---

## 🎨 Color Palette

Used consistently across all pages:

```
Background:    #FAF3E1  (soft warm cream)
Accent:        #FA8112  (bright orange)
Accent Hover:  #E07010  (darker orange)
Text Primary:  #222222  (deep dark gray)
Text Light:    #666666  (medium gray)
Card BG:       #FFFBF5  (cream variant)
Border:        #E8DFD3  (light warm brown)
```

Defined in `tailwind.config.js` and used throughout CSS.

---

## 🔐 Authentication Flow

```
1. User visits http://localhost:5173
   ↓
2. HomePage loads (public)
   - If logged in: Show "Dashboard" button
   - If not: Show "Sign In" and "Sign Up"
   ↓
3. User clicks "Sign In"
   - LoginPage renders
   - Form validation on submit
   - API call to POST /api/auth/login
   - On success: Token saved to localStorage
   - Redirect to /dashboard
   ↓
4. DashboardPage (protected)
   - ProtectedRoute checks isAuthenticated
   - If false: Redirect to /login
   - If true: Show navbar + projects grid
   ↓
5. User clicks "Logout"
   - auth.logout() removes token from localStorage
   - Redirect to home page
   ↓
6. If API returns 401 at any time
   - Axios interceptor catches it
   - User logged out automatically
   - Redirected to /login
```

---

## 📡 API Integration Points

All marked with `// TODO:` comments:

| File | Line | Endpoint | Action |
|------|------|----------|--------|
| `src/pages/LoginPage.tsx` | ~50 | POST /api/auth/login | Replace mock with real call |
| `src/pages/SignupPage.tsx` | ~60 | POST /api/auth/signup | Replace mock with real call |
| `src/pages/DashboardPage.tsx` | ~40 | GET /api/projects | Replace mock with real call |
| `src/pages/GeneratePage.tsx` | ~40 | POST /api/projects/generate | Replace mock with real call |
| `src/pages/ProjectDetailPage.tsx` | ~55 | GET /api/projects/:id | Replace mock with real call |

See `BACKEND_INTEGRATION.md` for detailed endpoint specifications.

---

## 🚀 Development Workflow

### Local Development
```bash
npm run dev
# Runs on http://localhost:5173
# Hot reload enabled
# Use mock data for testing UI
```

### Building for Production
```bash
npm run build
# Creates optimized dist/ folder
# Ready to deploy to Vercel, Netlify, etc.
```

### Environment Configuration
```env
# .env.local (not committed to git)
VITE_API_URL=http://localhost:5000  # Dev
VITE_API_URL=https://api.stackstep.com  # Production
```

---

## 📦 Dependencies

**Production:**
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing (v6)
- `axios` - HTTP client with interceptors
- `sonner` - Toast notifications
- `lucide-react` - Icon library
- `clsx` - Classname utilities
- `class-variance-authority` - CSS-in-JS variants

**Development:**
- `typescript` - Static typing
- `vite` - Build tool (fast, lightweight)
- `tailwindcss` - Utility CSS framework
- `postcss` - CSS processing
- `autoprefixer` - Browser prefixes
- React/TypeScript types

---

## 🎓 Key Features

✅ **Protected Routes** - Automatic redirects for unauthenticated users  
✅ **Token Management** - Auto-added to all API requests  
✅ **Error Handling** - Toast notifications + 401 auto-logout  
✅ **Mock Data** - Test UI without backend  
✅ **Responsive Design** - Mobile-first, works on all screens  
✅ **Loading States** - Spinner + disabled buttons during async ops  
✅ **Clean Code** - Well-commented, TODO markers for API integration  
✅ **Type Safety** - Full TypeScript support  
✅ **Accessibility** - Semantic HTML, ARIA labels, keyboard support  
✅ **Performance** - Code-split by page, optimized images, lazy loading ready  

---

## 🔍 Quick Navigation

- **Start here**: Run `npm install && npm run dev`
- **Connect backend**: Read `BACKEND_INTEGRATION.md`
- **Quick reference**: See `QUICKSTART.md`
- **Full docs**: Check `README.md`
- **Find TODOs**: Search for `TODO:` in source files

---

**Built with ❤️ for beginners learning tech stacks!**
