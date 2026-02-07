# StackStep Frontend - Quick Start Guide

## 🎯 What's Included

✅ Full React + Vite + TypeScript + Tailwind CSS project  
✅ Complete UI with 6 pages (landing, auth, dashboard, generate, project detail)  
✅ Protected routes with authentication  
✅ API client with axios + interceptors  
✅ Mock data for demo & testing  
✅ Toast notifications (sonner)  
✅ Mobile-responsive design  
✅ Custom warm color palette (#FAF3E1, #FA8112, #222222)  

## ⚡ 30-Second Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

Done! You now have a fully functional StackStep frontend.

## 🧪 Testing Without Backend

The app includes **mock data** by default:

- **Login/Signup**: Click login → use any email/password to see mock auth
- **Dashboard**: Shows 2 mock projects
- **Generate**: Creates a mock project and redirects to detail view
- **Project Detail**: Shows full roadmap with 4 phases and 11 tasks

## 🔌 Connecting Your Backend

When your backend API is ready:

1. **Update environment variable** in `.env.local`:
   ```
   VITE_API_URL=http://localhost:5000
   ```

2. **Find and replace TODO comments** in these files:
   - `src/lib/api.ts` - API endpoint definitions
   - `src/pages/LoginPage.tsx`
   - `src/pages/SignupPage.tsx`
   - `src/pages/DashboardPage.tsx`
   - `src/pages/GeneratePage.tsx`
   - `src/pages/ProjectDetailPage.tsx`

3. **Expected backend endpoints**:
   ```
   POST   /api/auth/login       → { token, user }
   POST   /api/auth/signup      → { token, user }
   GET    /api/projects         → Array of projects
   POST   /api/projects/generate → { id, title, ... }
   GET    /api/projects/:id     → Project with phases & tasks
   ```

## 📱 Key Features

### Authentication
- Email + password login/signup
- Token stored in localStorage
- Auto-logout on 401 errors
- Protected routes redirect to login

### Dashboard
- Grid view of user's projects
- Tech stack tags, experience level, creation date
- Quick links to view each project

### Generate Roadmap
- Tech stack input (textarea)
- Experience level selector
- Loading state with spinner
- Success toast notification

### Project Detail
- Title, description, tech stack badge
- **Interactive accordion for phases**:
  - Click to expand/collapse
  - Shows ordered list of tasks
  - Each task: number, title, description
  - "Expected Outcome" box for each task

### Navigation
- Sticky navbar on protected pages
- Logo, "Generate New" button, user email, logout
- Mobile-responsive menu

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  background: '#FAF3E1',  // Change this
  accent: '#FA8112',      // Or this
  text: '#222222',        // Or this
}
```

### Add New Pages
1. Create `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`
3. Use `Navbar` component for consistency

### Modify API Client
Edit `src/lib/api.ts` to add new endpoints:
```ts
myNewEndpoint: async (param: string) => {
  return api.get(`/api/endpoint/${param}`)
}
```

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready to deploy.

## 🐛 Troubleshooting

**"CORS error from API"**
- Ensure your backend has CORS enabled
- Check `VITE_API_URL` is correct
- Use `http://localhost:5000` for local dev

**"Token not being sent to API"**
- Token is auto-added by axios interceptor in `src/lib/api.ts`
- Check localStorage for `token` key
- Verify backend expects `Authorization: Bearer {token}`

**"404 page not found"**
- All unknown routes redirect to home (`/`)
- Check route paths in `src/App.tsx`

**"Styles not loading"**
- Make sure you ran `npm install`
- Tailwind classes in JSX must match `tailwind.config.js` content paths
- Clear browser cache

## 🚀 Next Steps

1. ✅ **Setup backend** with endpoints listed above
2. ✅ **Replace mock data** by following TODO comments
3. ✅ **Test auth flow** (login → dashboard → generate → detail)
4. ✅ **Deploy frontend** to Vercel/Netlify
5. ✅ **Update VITE_API_URL** to production backend URL

## 📚 File Guide

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app & routing setup |
| `src/lib/api.ts` | API client & endpoints |
| `src/hooks/useAuth.ts` | Auth state management |
| `src/pages/*.tsx` | Page components |
| `src/components/*.tsx` | Reusable components |
| `tailwind.config.js` | Theme colors & spacing |
| `vite.config.ts` | Vite build config |

## 💡 Pro Tips

- Use React DevTools extension for debugging
- Check Network tab in DevTools when API calls fail
- Use `console.log()` statements liberally during development
- Ctrl+J in browser to see console errors
- Mock data is great for UI development—use it!

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)
- [TypeScript](https://typescriptlang.org)

---

**Happy building! 🚀**
