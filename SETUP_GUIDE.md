# 🚀 Smart Classroom Booking Frontend - Setup Guide

This guide provides all the CLI commands needed to run and develop the project, plus a complete overview of the bootstrap and implementation.

---

## ✅ Project Status

**Completed:**

- ✓ Full project bootstrap (Vite + React + TypeScript)
- ✓ Core configuration (API client, routing, environment)
- ✓ Design system integration (Tailwind + Material 3 colors)
- ✓ Auth module with Login feature (fully functional)
- ✓ Form validation (Zod + React Hook Form)
- ✓ State management (Zustand + React Query)
- ✓ Production build optimization

**Next Steps:**

- Classroom/Room booking feature
- Analytics dashboard
- Booking approval workflow
- User profile management
- Real-time updates (WebSocket)
- Testing setup (Vitest + React Testing Library)

---

## 📋 Quick Start

### Prerequisites

```bash
# Check Node.js version (should be >= 18.0.0)
node --version
npm --version
```

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server (opens http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check
npm run type-check
```

---

## 🎯 CLI Commands Reference

### Development

```bash
# Start dev server with hot reload (auto-opens browser)
npm run dev

# TypeScript type checking (no emit)
npm run type-check

# Build and type-check for production
npm run build

# Preview production build locally
npm run preview
```

### Package Management

```bash
# Install all dependencies
npm install

# Add new package
npm install package-name

# Add dev dependency
npm install --save-dev package-name

# Update packages
npm update

# Check security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 🏗 Project Architecture Overview

### Folder Structure

```
smart-classroom-booking/
├── src/
│   ├── features/              # ← Feature modules (isolated)
│   │   └── auth/             # Login/Authentication
│   │       ├── api/          # auth.api.ts
│   │       ├── hooks/        # useLogin, useAuthStore
│   │       ├── components/   # LoginForm, LanguageSwitcher, etc.
│   │       ├── pages/        # LoginPage
│   │       ├── types/        # TypeScript interfaces
│   │       └── index.ts      # Public exports
│   │
│   ├── shared/               # ← Reusable utilities
│   │   ├── components/      # (to be populated)
│   │   ├── hooks/           # (to be populated)
│   │   ├── utils/           # Utility functions
│   │   └── constants/       # App-wide constants
│   │
│   ├── core/                # ← Core infrastructure
│   │   ├── api/             # Axios client with interceptors
│   │   ├── routing/         # React Router configuration
│   │   ├── config/          # Environment setup
│   │   └── store/           # Global state setup
│   │
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── style.css            # Global styles (Tailwind)
│
├── public/                   # Static assets
├── documents/                # Design files (designs/)
├── prompts/                  # AI system prompts & docs
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind configuration
├── postcss.config.js        # PostCSS with Autoprefixer
├── package.json             # Dependencies & scripts
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
└── index.html               # HTML entry point
```

---

## 🧠 Architecture Decisions Explained

### 1. Feature-Based Architecture

Each feature is **self-contained** and **independently deployable**.

```typescript
// Example: How Auth module is organized
features/auth/
  ├── api/auth.api.ts         // Calls backend
  ├── hooks/useLogin.ts       // Business logic
  ├── components/LoginForm.tsx// UI rendering
  ├── pages/LoginPage.tsx     // Page composition
  ├── types/auth.types.ts     // Type definitions
  └── index.ts                // Public API
```

**Benefits:**

- Clear separation of concerns
- Easy to test and maintain
- Can be developed in parallel with other features
- Easy to remove or refactor

### 2. Zustand for Auth State

```typescript
// Zustand provides:
// - Lightweight state management
// - Persistence middleware (localStorage)
// - DevTools integration
// - Type-safe mutations

const { user, token, isAuthenticated } = useAuthStore();
```

**Why not Redux?**

- Overkill for this use case
- Zustand is simpler and has less boilerplate

### 3. React Query (TanStack Query) for Server State

```typescript
// Server state (data from backend):
// - Bookings, classrooms, users, etc.

// Client state (UI state):
// - Auth token, user info, language preference

// Separation keeps code simple and cacheable
const { data, isLoading } = useQuery({
  queryKey: ["bookings"],
  queryFn: () => bookingApi.getBookings(),
});
```

### 4. Axios with Interceptors

```typescript
// Request interceptor: Auto-attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401 (redirect to login)
apiClient.interceptors.response.use(null, (error) => {
  if (error.response?.status === 401) {
    // Clear auth and redirect
  }
});
```

### 5. TailwindCSS with Material 3 Design System

```typescript
// Custom colors from provided design
primary: '#002045'
primary-container: '#1a365d'
tertiary: '#002712'
tertiary-fixed: '#88f9b0'
// ... 40+ more design tokens

// Usage in components:
<button className="bg-primary text-white">Sign In</button>
```

---

## 🔐 Authentication Workflow

### Login Flow

```
User Input
   ↓
LoginForm validates with Zod
   ↓
useLogin hook calls authApi.login()
   ↓
API client sends POST /auth/login
   ↓
Backend returns JWT + user data
   ↓
Token stored in localStorage
   ↓
Zustand store updated
   ↓
Router redirects to /dashboard
```

### Protected Routes

```typescript
// In src/core/routing/router.tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>

// ProtectedRoute checks isAuthenticated
// If false, redirects to /login
```

### Token Attachment

```typescript
// Request interceptor automatically adds:
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 📦 Dependencies Installed

### Core Framework

- `react@^18.2.0` - UI library
- `react-dom@^18.2.0` - DOM rendering
- `vite@^5.0.8` - Build tool
- `typescript@^5.3.3` - Type safety

### Routing & Navigation

- `react-router-dom@^6.22.0` - Routing

### State Management

- `@tanstack/react-query@^5.28.0` - Server state
- `zustand@^4.4.7` - Client state

### Forms & Validation

- `react-hook-form@^7.48.0` - Form state
- `zod@^3.22.4` - Schema validation
- `@hookform/resolvers@^3.3.4` - Zod integration

### HTTP & API

- `axios@^1.6.5` - HTTP client

### Styling

- `tailwindcss@^3.4.1` - CSS framework
- `@tailwindcss/forms@^0.5.7` - Form styling
- `autoprefixer@^10.4.16` - CSS prefixing
- `postcss@^8.4.31` - CSS processing

### Utilities

- `clsx@^2.0.0` - Conditional classnames

### Dev Tools

- `@vitejs/plugin-react@^4.2.1` - Vite + React
- `@types/react@^18.2.43` - React types
- `@types/react-dom@^18.2.17` - React DOM types
- `@types/node@^20.0.0` - Node.js types

---

## 🧪 Testing Setup (Not Yet Implemented)

```bash
# Install test dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## 🌐 Environment Configuration

### Set Up Environment Variables

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local
VITE_API_URL=http://localhost:3000/api
```

### Using Environment Variables in Code

```typescript
import { ENV } from "@core/config/env";

console.log(ENV.API_URL); // http://localhost:3000/api
console.log(ENV.isDevelopment); // true (in dev)
console.log(ENV.isProduction); // false (in dev)
```

---

## 🐛 Common Issues & Solutions

| Issue                           | Solution                                                |
| ------------------------------- | ------------------------------------------------------- |
| **"Cannot find module" errors** | Run `npm install` again                                 |
| **Port 5173 already in use**    | Change in vite.config.ts or kill process using the port |
| **CORS errors**                 | Ensure backend allows `http://localhost:5173`           |
| **Token not persisting**        | Check localStorage in DevTools (F12 → Application)      |
| **404 on /dashboard**           | Make sure you're logged in first                        |
| **Build fails with CSS error**  | Delete `node_modules/.vite` and rebuild                 |

---

## 📝 Development Workflow

### Adding a New Feature

```bash
# 1. Create feature folder
mkdir -p src/features/booking/{api,hooks,components,pages,types}

# 2. Create types
echo "// types here" > src/features/booking/types/booking.types.ts

# 3. Create API layer
echo "// API layer" > src/features/booking/api/booking.api.ts

# 4. Create hooks
echo "// Hooks" > src/features/booking/hooks/useBooking.ts

# 5. Create components
echo "// Components" > src/features/booking/components/BookingForm.tsx

# 6. Create page
echo "// Page" > src/features/booking/pages/BookingPage.tsx

# 7. Create index for public API
echo "export { BookingPage } from './pages/BookingPage'" > src/features/booking/index.ts

# 8. Add route in src/core/routing/router.tsx
```

### Code Style

```typescript
// ✅ DO - Use TypeScript strictly
import type { ReactNode } from 'react'
interface Props {
  children: ReactNode
}

// ❌ DON'T - Use any
const Component = (props: any) => null

// ✅ DO - Separate logic from UI
const Component = () => {
  const { data, isLoading } = useQuery()
  return <div>{isLoading ? 'Loading...' : data.name}</div>
}

// ❌ DON'T - Mix business logic in JSX
const Component = () => {
  return <div>{localStorage.getItem('user').name}</div>
}
```

---

## 📊 Performance Tips

### 1. Use React.memo for Components

```typescript
export const ExpensiveComponent = React.memo(({ data }) => (
  <div>{data}</div>
))
```

### 2. Use useCallback for Event Handlers

```typescript
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

### 3. Use useMemo for Expensive Computations

```typescript
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);
```

### 4. Lazy Load Routes

```typescript
const BookingPage = lazy(() => import('@features/booking'))

<Route path="/booking" element={<Suspense><BookingPage /></Suspense>} />
```

---

## 🚀 Deployment Checklist

- [ ] Run `npm run type-check` (no errors)
- [ ] Run `npm run build` (succeeds)
- [ ] Test build locally: `npm run preview`
- [ ] Set production environment variables
- [ ] Configure backend API URL for production
- [ ] Test login flow end-to-end
- [ ] Check responsive design on mobile
- [ ] Enable HTTPS in production
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Setup analytics
- [ ] Verify security headers

---

## 📚 Useful Resources

- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev
- **React Router**: https://reactrouter.com
- **TanStack Query**: https://tanstack.com/query
- **Zustand**: https://github.com/pmndrs/zustand
- **React Hook Form**: https://react-hook-form.com
- **Tailwind CSS**: https://tailwindcss.com
- **Zod**: https://zod.dev
- **Material 3 Design**: https://m3.material.io

---

## 🤝 Contributing

When adding new code:

1. Follow feature-based structure
2. Use TypeScript strictly (no `any`)
3. Add proper type exports
4. Keep components under 200 lines
5. Separate business logic from UI
6. Use barrel exports (index.ts)
7. Document complex logic with comments
8. Run type-check before committing

---

## 📞 Support

For questions or issues:

1. Check the troubleshooting section above
2. Read the README.md in the project root
3. Review code comments and JSDoc
4. Check browser console (F12)
5. Check network requests (DevTools Network tab)

---

## 📄 License

© 2026 University Academic Atelier. All rights reserved.
