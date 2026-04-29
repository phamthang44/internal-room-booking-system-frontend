# Smart Classroom Booking Frontend

Production-ready React + Vite frontend for the Smart Classroom Booking System ("Scholarly Sanctuary").

## 🎯 Project Overview

This is a feature-based, scalable frontend application designed to manage classroom bookings with:
- User authentication and authorization
- Real-time room availability
- Booking management
- Analytics dashboard
- Responsive design (mobile-first)

## 🏗 Architecture

### Feature-Based Structure

```
src/
├── features/              # Feature modules (isolated, independently deployable)
│   ├── auth/             # Authentication module
│   │   ├── api/          # API layer (auth.api.ts)
│   │   ├── hooks/        # Custom hooks (useLogin, useAuthStore)
│   │   ├── components/   # UI components (LoginForm, LanguageSwitcher)
│   │   ├── pages/        # Page components (LoginPage)
│   │   ├── types/        # TypeScript types and interfaces
│   │   └── index.ts      # Public API barrel export
│   └── [other features]/  # To be implemented
│
├── shared/                # Shared utilities available to all features
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Shared custom hooks
│   ├── utils/           # Utility functions
│   └── constants/       # App-wide constants
│
├── core/                  # Core setup & infrastructure
│   ├── api/             # API client setup with interceptors
│   ├── routing/         # React Router configuration
│   ├── config/          # Environment & global configuration
│   └── store/           # Global state (if needed)
│
├── App.tsx              # Root component
└── main.tsx             # Entry point

public/                   # Static assets
documents/                # Design files and documentation
prompts/                  # AI system prompts & workflow docs
```

## 🧱 Tech Stack

| Purpose | Technology | Version |
|---------|-----------|---------|
| **Framework** | React | ^18.2.0 |
| **Build Tool** | Vite | ^5.0.8 |
| **Language** | TypeScript | ^5.3.3 |
| **Styling** | TailwindCSS | ^3.4.1 |
| **HTTP** | Axios | ^1.6.5 |
| **Server State** | TanStack Query | ^5.28.0 |
| **Client State** | Zustand | ^4.4.7 |
| **Forms** | React Hook Form + Zod | ^7.48.0 + ^3.22.4 |
| **Routing** | React Router | ^6.22.0 |

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 or yarn >= 3.0.0

### Installation

1. **Clone and navigate to project:**
   ```bash
   cd room-booking-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your API endpoint:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

### Build for Production

```bash
npm run build        # Build optimized bundle
npm run preview      # Preview production build locally
npm run type-check   # Check TypeScript errors
```

## 📋 Project Setup Decisions

### 1. Feature-Based Architecture
- **Why**: Scales with team size, enables independent feature development
- **Benefit**: Each feature is self-contained with its own API, types, components, hooks
- **Structure**: `src/features/{featureName}/{api, hooks, components, pages, types}`

### 2. Zustand for Auth State
- **Why**: Lightweight, perfect for auth/client state, strongly typed
- **Alternative considered**: Redux Toolkit (overkill for this use case)
- **Persistence**: Built-in middleware to persist token and user across sessions

### 3. React Query (TanStack Query) for Server State
- **Why**: Eliminates manual caching logic, built-in error/loading states, automatic refetching
- **Pattern**: Each feature module has its own API layer that uses `useQuery` / `useMutation`

### 4. React Hook Form + Zod
- **Why**: Minimal re-renders, declarative validation, excellent TypeScript support
- **Validation**: Client-side with Zod schema, server-side validation on backend

### 5. Axios with Interceptors
- **Features**:
  - Request interceptor: Auto-attach JWT token from localStorage
  - Response interceptor: Handle 401 (redirect to login)
  - Global error handling ready for implementation

### 6. TailwindCSS with Material 3 Design System
- **Why**: Consistent with provided design, extreme flexibility, small bundle
- **Custom Colors**: Using Material You design tokens from provided design files
- **Responsive**: Mobile-first approach with breakpoints

## 🔐 Authentication Flow

### Login Process
```
1. User enters email/password → LoginForm
2. Form validates with Zod schema
3. useLogin hook calls authApi.login()
4. API client sends to backend
5. Backend returns JWT + user data
6. Token stored in localStorage + Zustand store
7. User redirected to /dashboard
8. Protected routes check useAuthStore().isAuthenticated
```

### Token Management
- **Storage**: localStorage + Zustand (in-memory for performance)
- **Attachment**: Request interceptor adds `Authorization: Bearer {token}`
- **Refresh**: Ready for implementation (intercept 401, refresh token flow)
- **Logout**: Clear localStorage and Zustand state

## 🧪 Key Features Implemented

### ✅ Login Module (`src/features/auth/`)
- **LoginForm**: Email/password input with validation
- **GoogleOAuthButton**: Placeholder for OAuth integration
- **LanguageSwitcher**: EN/VI language toggle
- **AuthLayout**: Responsive layout matching design (split desktop, full-width mobile)
- **useLogin Hook**: Handles login logic, error states, loading
- **useAuthStore**: Persistent auth state (Zustand)
- **Routing**: Protected `/dashboard` route

### ✅ Design System Compliance
- Desktop login page: Split layout with image + form
- Mobile login page: Full-width responsive
- Colors: Material 3 design tokens from provided design
- Typography: Manrope (headlines) + Inter (body)
- Icons: Material Symbols integration ready

## 📦 API Layer Pattern

Each feature module defines its own API layer:

```typescript
// features/auth/api/auth.api.ts
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },
  // ... other endpoints
}
```

**Benefits**:
- Clear separation of concerns
- Easy to mock for testing
- Feature-level API documentation
- Type-safe with TypeScript

## 🎯 Code Quality & Performance

### TypeScript Strict Mode
- No `any` types
- Full type coverage for:
  - API responses (LoginResponse DTO)
  - Form data (LoginFormData)
  - Component props
  - Store state

### Performance Optimizations
- **Code splitting**: Lazy load feature routes
- **Memoization**: Components use React.memo where needed
- **Query caching**: TanStack Query dedupes requests
- **Debouncing**: Form inputs will use debounce for search queries
- **Tree-shaking**: Vite automatically removes dead code

### Testing Ready
- Separation of logic from components
- Hooks are testable with @testing-library/react-hooks
- API layer is mockable
- Zustand store is easy to test

## 🌐 Environment Configuration

Create `.env.local`:
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_BOOKING_HISTORY=true
```

Access in code:
```typescript
import { ENV } from '@core/config/env'

console.log(ENV.API_URL)        // http://localhost:3000/api
console.log(ENV.isDevelopment)  // true|false
console.log(ENV.isProduction)   // true|false
```

## 🔄 Development Workflow

### `/daily` Command Cheat Sheet

Use these as your default Graphify-powered routine.

#### Morning Start (or start of a new task)

```bash
# pick one scope
graphify src/core
# or
graphify src/features/<feature-name>

# map the flow before editing
graphify query "How does <feature flow> work?"
graphify path "<entry point>" "<target module>"
```

#### Mid-Task Safety Check (after each edit batch)

```bash
graphify --update src/features/<feature-name>
npm run type-check
```

For infra-heavy work:

```bash
graphify --update src/core
npm run type-check
```

#### End-of-Day / Pre-Commit Closeout

```bash
graphify --update src/features/<feature-name>  # or src/core
npm run type-check
npm run build  # optional but recommended for risky changes
```

Then quickly review `graphify-out/GRAPH_REPORT.md`:
- God Nodes changed intentionally
- Surprising Connections are expected
- Suggested Questions align with your feature intent

#### Voice-Friendly Prompts

- "Start feature kickoff for `<feature>`"
- "Run safe refactor workflow for `<symbol/module>`"
- "Do daily closeout check for `<scope>`"

### Adding a New Feature

1. **Create feature folder**:
   ```bash
   mkdir -p src/features/booking/{api,hooks,components,pages,types}
   ```

2. **Define types**:
   ```typescript
   // src/features/booking/types/booking.types.ts
   export interface Booking {
     id: string
     roomId: string
     startTime: Date
     // ...
   }
   ```

3. **Create API layer**:
   ```typescript
   // src/features/booking/api/booking.api.ts
   export const bookingApi = {
     getBookings: async () => { /* ... */ },
     createBooking: async (data: CreateBookingRequest) => { /* ... */ },
   }
   ```

4. **Build components**:
   - Use shared components from `src/shared/components`
   - Use hooks from `src/shared/hooks`
   - Create feature-specific hooks in `src/features/booking/hooks`

5. **Add routing**:
   ```typescript
   // src/core/routing/router.tsx
   <Route path="/bookings" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
   ```

6. **Export from feature**:
   ```typescript
   // src/features/booking/index.ts
   export { BookingPage } from './pages/BookingPage'
   export { useBooking } from './hooks/useBooking'
   // ...
   ```

## 🐛 Debugging & Troubleshooting

### DevTools
- **React DevTools**: Inspect component tree
- **Redux DevTools**: Zustand store via devtools middleware
- **Network Tab**: Monitor API calls and interceptors
- **LocalStorage**: Check token persistence

### Common Issues

| Issue | Solution |
|-------|----------|
| **401 errors after login** | Verify token is stored in localStorage and attached in auth interceptor |
| **CORS errors** | Ensure backend allows requests from `http://localhost:5173` |
| **Form not validating** | Check Zod schema and console for validation errors |
| **Route redirect loops** | Verify `isAuthenticated` state is set correctly after login |

## 📚 Resources

- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [React Hook Form Documentation](https://react-hook-form.com)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 📝 Next Steps

- [ ] Implement classroom/room booking feature
- [ ] Add analytics dashboard
- [ ] Implement approval workflow for bookings
- [ ] Add user profile management
- [ ] Implement real-time updates (WebSocket)
- [ ] Add end-to-end testing (Cypress)
- [ ] Setup CI/CD pipeline
- [ ] Add i18n for EN/VI language switching

## 📄 License

© 2026 University Academic Atelier. All rights reserved.
