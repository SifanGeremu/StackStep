# StackStep - Frontend

A clean, modern React frontend for StackStep, an authenticated tool that generates phased project roadmaps for learning tech stacks via LLM.

## 🎨 Design

- **Color Palette**: Warm, inviting with high contrast
  - Background: `#FAF3E1` (soft warm cream)
  - Accent/Buttons: `#FA8112` (bright orange)
  - Text/Headers: `#222222` (deep dark gray)
  - Cards: `#FFFBF5` (cream variant)

- **Typography**: Clean, readable, beginner-friendly
- **Layout**: Spacious, minimalistic, mobile-first
- **Components**: shadcn/ui-inspired, built with Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A backend API running at `http://localhost:5000` (configure in `.env`)

### Installation

1. **Clone or extract the project**

   ```bash
   cd stackstep-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env.local` file** (copy from `.env.example`)

   ```bash
   cp .env.example .env.local
   ```

   Update `VITE_API_URL` if your backend runs on a different URL:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   Open http://localhost:5000 in your browser.

5. **Build for production**

   ```bash
   npm run build
   ```

## 📁 Project Structure

```
stackstep-frontend/
├── src/
│   ├── App.tsx                 # Main app with routing
│   ├── main.tsx                # React entry point
│   ├── index.css               # Global styles (Tailwind)
│   │
│   ├── pages/                  # Page components
│   │   ├── HomePage.tsx        # Public landing page
│   │   ├── LoginPage.tsx       # Auth: Sign in
│   │   ├── SignupPage.tsx      # Auth: Sign up
│   │   ├── DashboardPage.tsx   # Protected: User's projects
│   │   ├── GeneratePage.tsx    # Protected: Create roadmap
│   │   └── ProjectDetailPage.tsx # Protected: View roadmap
│   │
│   ├── components/             # Reusable components
│   │   ├── ProtectedRoute.tsx  # Route guard for auth
│   │   ├── Navbar.tsx          # Navigation bar
│   │   └── LoadingSpinner.tsx  # Loading state
│   │
│   ├── hooks/                  # Custom React hooks
│   │   └── useAuth.ts          # Auth state management
│   │
│   └── lib/                    # Utilities & API
│       ├── api.ts              # Axios API client with interceptors
│       └── utils.ts            # Helper functions
│
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies & scripts
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## 🔗 API Integration

All API calls are centralized in `src/lib/api.ts`. The client automatically:
- Adds `Bearer {token}` to all protected requests
- Handles 401 errors by logging out and redirecting to login
- Uses the `VITE_API_URL` environment variable as base URL

### Expected Backend Endpoints

**Authentication:**
- `POST /api/auth/login` - Login with email & password
- `POST /api/auth/signup` - Register new user

**Projects:**
- `GET /api/projects` - List all user projects
- `POST /api/projects/generate` - Generate new roadmap
- `GET /api/projects/:id` - Get project details

See `src/lib/api.ts` for detailed endpoint documentation with TODO comments.

## 🔐 Authentication

- **Token Storage**: localStorage (key: `token`)
- **Email Storage**: localStorage (key: `userEmail`)
- **Protected Routes**: Redirect to `/login` if not authenticated
- **Auto-Logout**: 401 responses trigger automatic logout

To test without a backend:
1. The login/signup forms include mock authentication
2. Mock data is provided in Dashboard and Generate pages
3. Replace mock calls with real API calls when backend is ready

## 🎯 Pages

### 1. **Home Page** (`/`)
- Public landing page
- Shows StackStep pitch and features
- CTA button: "Get Started" → `/login` (not auth) or `/generate` (if auth)

### 2. **Login Page** (`/login`)
- Simple form: email + password
- Error handling with toasts
- Link to signup
- Redirects to `/dashboard` if already logged in

### 3. **Signup Page** (`/signup`)
- Registration form: email + password + confirm
- Validation: passwords match, minimum length
- Error handling with toasts
- Link to login
- Redirects to `/dashboard` if already logged in

### 4. **Dashboard** (`/dashboard`) 🔒
- Protected route
- Navbar with logo, "Generate New" button, email, logout
- Grid of previous projects
- Each card shows: title, tech stack tag, experience level, date, "View" button
- Empty state if no projects
- Link to `/generate`

### 5. **Generate Page** (`/generate`) 🔒
- Protected route
- Centered form with:
  - Text input: Tech stack (e.g., "MERN, Next.js + Tailwind")
  - Select dropdown: Experience level (Beginner, Intermediate, Advanced)
  - Big "Generate Roadmap" button
- Loading spinner on submit
- Redirects to `/projects/:id` after generation

### 6. **Project Detail** (`/projects/:id`) 🔒
- Protected route
- Shows: title (big), description, tech stack tag, experience level
- **Accordion for each phase**:
  - Phase number badge + title + description
  - Expandable content with ordered list of tasks
  - Each task shows: number, title, description, "Expected Outcome" box
- Footer CTA: "Start Learning" button

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the palette:

```js
colors: {
  background: '#FAF3E1',     // Page background
  accent: '#FA8112',         // Buttons & highlights
  'accent-hover': '#E07010', // Hover state
  text: '#222222',           // Main text
  'text-light': '#666666',   // Secondary text
  'card-bg': '#FFFBF5',      // Card backgrounds
  'border-color': '#E8DFD3', // Borders
}
```

### Typography
Fonts are loaded from Google Fonts in `src/index.css`. Change the `font-sans` in `tailwind.config.js` to use different fonts.

### Components
All major UI elements use Tailwind utility classes. Customize by editing `src/index.css` component layer or inline Tailwind classes.

## 📝 Adding TODO Comments

Throughout the codebase, you'll find `// TODO:` comments marking where to connect real API calls:

- `src/lib/api.ts` - API endpoint definitions
- `src/pages/LoginPage.tsx` - Replace mock login
- `src/pages/SignupPage.tsx` - Replace mock signup
- `src/pages/DashboardPage.tsx` - Replace mock project list
- `src/pages/GeneratePage.tsx` - Replace mock generation
- `src/pages/ProjectDetailPage.tsx` - Replace mock project details

Search for `TODO:` in your editor to find all integration points.

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variable:
   ```
   VITE_API_URL=https://your-api-url.com
   ```
4. Deploy!

### Other Platforms (Netlify, etc.)

1. Run `npm run build`
2. Deploy the `dist/` folder
3. Ensure CORS is enabled on your backend
4. Update `VITE_API_URL` in environment variables

## 🛠 Development Tips

- **State Management**: Uses React Context (auth) + local state. For complex apps, consider Redux/Zustand.
- **Data Fetching**: Uses axios + Sonner for notifications. Add React Query/SWR for better caching.
- **Styling**: Pure Tailwind CSS. No CSS modules or styled-components.
- **Icons**: Lucide React icons used throughout.
- **Forms**: Vanilla HTML forms with React state. Add React Hook Form for complex forms.

## 📦 Dependencies

- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Routing
- **axios** - HTTP client
- **sonner** - Toast notifications
- **lucide-react** - Icons
- **tailwindcss** - Utility CSS framework
- **clsx** / **class-variance-authority** - Classname utilities

## 🤝 Support

For issues or questions:
1. Check the TODO comments in the code
2. Review the API integration guide in `src/lib/api.ts`
3. Test with mock data first before connecting backend
4. Check browser console for errors

## 📄 License

MIT

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
