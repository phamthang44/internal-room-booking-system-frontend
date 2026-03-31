// English translations
export const en = {
  auth: {
    login: {
      title: "Welcome Back",
      subtitle: "Access your scholarly dashboard",
      email: {
        label: "Email or Username",
        placeholder: "e.g. j.smith@university.edu",
        error: {
          required: "Email is required",
          invalid: "Please enter a valid email",
        },
      },
      password: {
        label: "Password",
        placeholder: "••••••••",
        error: {
          required: "Password is required",
          minLength: "Password must be at least 8 characters",
        },
      },
      forgotPassword: "Forgot Password?",
      submit: {
        signIn: "Sign In",
        signing: "Signing in...",
      },
      divider: "Or continue with",
      oauth: {
        google: "Continue with Google",
        loading: "Signing in with Google...",
        dialog: {
          title: "Google Sign-In Failed",
          confirm: "Got it",
        },
        error: {
          userNotFound:
            "Your account is not registered. Please contact the administrator.",
          invalidToken: "Google authentication failed. Please try again.",
          network: "Network error. Please check your connection and try again.",
          unknown: "Google sign in failed. Please try again.",
        },
      },
      footer: "Restricted access for University Staff and Students only.",
      errors: {
        unknown: "An error occurred. Please try again.",
      },
    },
  },
  common: {
    appName: "Scholarly Sanctuary",
    layout: {
      leftPanel: {
        title: "Quiet spaces for deep focus.",
        description:
          "Experience a sophisticated booking environment designed for the modern academic lifestyle.",
      },
    },
    errors: {
      unknown: "An error occurred. Please try again.",
    },
    language: "Language",
    help: "Help",
    security: "Security Policy",
    terms: "Terms of Service",
    support: "IT Support",
    copyright: "© 2026 University Academic Atelier. All rights reserved.",
  },
  nav: {
    brand: "Academic Atelier",
    portal: "Staff Portal",
    toggleSidebar: "Toggle sidebar",
    dashboard: "Dashboard",
    browseRooms: "Browse Rooms",
    myBookings: "My Bookings",
    approvals: "Approvals",
    settings: "Settings",
    langEn: "EN",
    langVi: "VI",
    logout: "Logout",
  },
  dashboard: {
    greeting: "Welcome back, {{name}}.",
    subtitle:
      "Your creative space is waiting. Ready to book your next study session?",
    newBooking: "New Booking",
    stats: {
      totalBookings: "Total Bookings",
      upcomingToday: "Upcoming Today",
      pendingRequests: "Pending Requests",
    },
    recentRooms: {
      title: "Recently Viewed Rooms",
      subtitle: "Based on your browsing history",
      empty: "No recently viewed rooms yet.",
    },
    upcomingBookings: {
      title: "My Upcoming Bookings",
      viewAll: "View all",
      today: "Today",
      empty: "No upcoming bookings",
      browseRooms: "Browse available rooms →",
      loadError: "Failed to load bookings. Please refresh.",
    },
  },
  rooms: {
    pageTitle: "Find Your Space",
    pageSubtitle: "Browse available classrooms and book your session",
    search: {
      placeholder: "Search by room name, code, or building…",
      clearLabel: "Clear search",
    },
    filters: {
      title: "Filter Classrooms",
      clearAll: "Clear all",
      clearAllFilters: "Clear All Filters",
      availability: "Availability",
      pickDate: "Pick Date",
      timeSlot: "Time Slot",
      anyTime: "Any time",
      capacity: "Capacity (Seats)",
      equipment: "Equipment",
      mobileToggle: "Filters",
    },
    sort: {
      newest: "Newest first",
      nameAsc: "Room name (A → Z)",
      nameDesc: "Room name (Z → A)",
      capacityAsc: "Capacity (low → high)",
      capacityDesc: "Capacity (high → low)",
    },
    availability: {
      available: "Available",
      occupied: "Occupied",
      maintenance: "Maintenance",
    },
    equipment: {
      projector: "Projector",
      whiteboard: "Whiteboard",
      video_conference: "Video Conference",
      air_conditioning: "Air Con",
      computer_lab: "Computer Lab",
      smart_board: "Smart Board",
      audio_system: "Audio System",
    },
    card: {
      upTo: "Up to {{count}} people",
      moreEquipment: "+{{count}} more",
      viewDetails: "View Details",
      checkAvailability: "Check Availability",
      seats: "seats",
    },
    grid: {
      noResults: "No results",
      showing: "Showing {{shown}} of {{total}} rooms",
      showingOne: "Showing {{shown}} of {{total}} room",
    },
    empty: {
      title: "No rooms found",
      withFilters: "Try adjusting your filters or search query.",
      noRooms: "No classrooms are available at the moment.",
      clearFilters: "Clear all filters",
    },
    error: {
      loadFailed: "Failed to load rooms. Please try again.",
      retry: "Retry",
    },
    pagination: {
      pageOf: "Page {{page}} of {{total}}",
    },
    status: {
      confirmed: "Confirmed",
      pending: "Pending",
      cancelled: "Cancelled",
      available: "Available",
      occupied: "Occupied",
      maintenance: "Maintenance",
    },
  },
} as const;
