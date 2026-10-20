import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { matchPath, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@shared/utils/cn";
import { useSidebarStore } from "@shared/hooks/useSidebarStore";
import { useAuthStore, useProfileStore } from "@features/auth";
import { NotificationsPopover } from "@features/notifications";
import { PenaltyBanner } from "@features/penalties";
import { useI18n } from "@shared/i18n/useI18n";
import authApi from "@features/auth/api/auth.api";

interface AppLayoutProps {
  children: ReactNode;
}

function useRouteHeader(pathname: string) {
  if (matchPath({ path: "/admin/rooms", end: true }, pathname)) {
    return {
      titleKey: "nav.admin.rooms" as const,
      showBack: false,
      backTo: null,
    };
  }
  if (matchPath({ path: "/admin/rooms/new", end: true }, pathname)) {
    return {
      titleKey: "nav.admin.roomsNew" as const,
      showBack: true,
      backTo: "/admin/rooms",
    };
  }
  if (matchPath({ path: "/admin/rooms/:id/edit", end: true }, pathname)) {
    return {
      titleKey: "nav.admin.roomsEdit" as const,
      showBack: true,
      backTo: "/admin/rooms",
    };
  }
  if (matchPath({ path: "/admin/rooms/:id/audit", end: true }, pathname)) {
    return {
      titleKey: "nav.admin.roomsAudit" as const,
      showBack: true,
      backTo: "/admin/rooms",
    };
  }
  if (matchPath({ path: "/admin/equipment", end: true }, pathname)) {
    return {
      titleKey: "nav.admin.equipment" as const,
      showBack: false,
      backTo: null,
    };
  }
  if (matchPath({ path: "/admin/dashboard", end: true }, pathname)) {
    return {
      titleKey: "nav.admin.dashboard" as const,
      showBack: false,
      backTo: null,
    };
  }
  if (matchPath({ path: "/admin/users", end: true }, pathname)) {
    return {
      titleKey: "nav.admin.users" as const,
      showBack: false,
      backTo: null,
    };
  }
  if (matchPath({ path: "/admin/users/:userId/penalties", end: true }, pathname)) {
    return {
      titleKey: "nav.admin.userPenalties" as const,
      showBack: true,
      backTo: "/admin/users",
    };
  }
  if (matchPath({ path: "/admin/bookings/:bookingId", end: true }, pathname)) {
    return {
      titleKey: "nav.approvals" as const,
      showBack: true,
      backTo: "/admin/approvals",
    };
  }
  if (matchPath({ path: "/booking/success", end: true }, pathname)) {
    return {
      titleKey: "nav.header.bookingSuccess" as const,
      showBack: true,
      backTo: "/rooms",
    };
  }
  if (matchPath({ path: "/bookings/:bookingId/checkin", end: true }, pathname)) {
    return {
      titleKey: "nav.header.bookingCheckIn" as const,
      showBack: true,
      backTo: "/bookings",
    };
  }
  if (matchPath({ path: "/bookings/:bookingId", end: true }, pathname)) {
    return {
      titleKey: "nav.header.bookingDetail" as const,
      showBack: true,
      backTo: "/bookings",
    };
  }
  if (matchPath({ path: "/bookings", end: true }, pathname)) {
    return {
      titleKey: "nav.myBookings" as const,
      showBack: false,
      backTo: null,
    };
  }
  if (matchPath({ path: "/penalties", end: true }, pathname)) {
    return {
      titleKey: "nav.penalties" as const,
      showBack: false,
      backTo: null,
    };
  }
  if (matchPath({ path: "/rooms/:roomId", end: true }, pathname)) {
    return {
      titleKey: "nav.header.roomDetail" as const,
      showBack: true,
      backTo: "/rooms",
    };
  }
  if (matchPath({ path: "/rooms", end: true }, pathname)) {
    return {
      titleKey: "nav.header.rooms" as const,
      showBack: false,
      backTo: null,
    };
  }
  if (matchPath({ path: "/dashboard", end: true }, pathname)) {
    return {
      titleKey: "nav.dashboard" as const,
      showBack: false,
      backTo: null,
    };
  }
  if (matchPath({ path: "/settings", end: true }, pathname)) {
    return {
      titleKey: "nav.settings" as const,
      showBack: false,
      backTo: null,
    };
  }
  if (matchPath({ path: "/admin/approvals", end: true }, pathname)) {
    return {
      titleKey: "nav.approvals" as const,
      showBack: false,
      backTo: null,
    };
  }
  return {
    titleKey: "nav.header.fallback" as const,
    showBack: false,
    backTo: null,
  };
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { isOpen, toggle, close } = useSidebarStore();
  const sidebarRef = useRef<HTMLElement>(null);
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { profile, fetchProfile, clearProfile } = useProfileStore();
  const { pathname } = useLocation();
  const routeHeader = useRouteHeader(pathname);
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const roleName = profile?.roleName ?? user?.roleName;
  const canSeeAdminSection = roleName === "ADMIN" || roleName === "FACILITY_STAFF";
  const isAdmin = roleName === "ADMIN";

  // Close drawer on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) close();
  }, [pathname, close]);

  useEffect(() => {
    if (isAuthenticated && !profile) {
      fetchProfile();
    }
  }, [isAuthenticated, profile, fetchProfile]);

  useLayoutEffect(() => {
    if (!isOpen || window.innerWidth >= 1024) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () => Array.from(sidebarRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    // Let the browser release the closed drawer's inert subtree before focusing it.
    const focusTimer = window.setTimeout(() => focusables()[0]?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); }
      if (event.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, close]);

  const handleLanguageChange = (lang: "en" | "vi") => {
    if (language === lang) return;
    setLanguage(lang);
    // Invalidate all queries to refetch data in the new language
    // The Axios interceptor automatically sends Accept-Language header from localStorage
    queryClient.invalidateQueries();
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      clearAuth();
      clearProfile();
      queryClient.clear();
      navigate("/login");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Logout failed:", error);
      }
      // Still clear auth and redirect even if API call fails
      clearAuth();
      clearProfile();
      queryClient.clear();
      navigate("/login");
    }
  };

  const NAV_ITEMS = [
    { icon: "dashboard", label: t("nav.dashboard"), to: "/dashboard" },
    { icon: "meeting_room", label: t("nav.browseRooms"), to: "/rooms" },
    { icon: "event_note", label: t("nav.myBookings"), to: "/bookings" },
    { icon: "policy", label: t("nav.penalties"), to: "/penalties" },
    { icon: "settings", label: t("nav.settings"), to: "/settings" },
  ];

  const ADMIN_NAV_ITEMS = [
    {
      icon: "dashboard",
      label: t("nav.admin.dashboard"),
      to: "/admin/dashboard",
    },
    { icon: "verified_user", label: t("nav.approvals"), to: "/admin/approvals" },
    ...(isAdmin
      ? ([
          { icon: "group", label: t("nav.admin.users"), to: "/admin/users" },
          { icon: "meeting_room", label: t("nav.admin.rooms"), to: "/admin/rooms" },
          {
            icon: "inventory_2",
            label: t("nav.admin.equipment"),
            to: "/admin/equipment",
          },
        ] as const)
      : []),
  ];

  return (
    <div className="app-shell font-body">
      <a className="app-skip-link" href="#main-content">{t("nav.skipToContent")}</a>
      {/* ── Overlay (mobile only) ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[55] bg-on-surface/25 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Drawer ── */}
      <aside
        ref={sidebarRef}
        id="app-sidebar"
        aria-label={t("nav.portal")}
        aria-hidden={!isOpen}
        {...(!isOpen ? { inert: "" } : {})}
        className={cn("app-sidebar", isOpen && "is-open")}
      >
        {/* Brand */}
        <div className="app-brand">
          <svg className="app-brand-mark" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="28" height="28" rx="9" stroke="currentColor" strokeWidth="1.4" />
            <path d="M12 27V10h12v17M16 10v17M20 19h1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <div>
            <p className="font-headline text-sm font-bold leading-tight text-on-surface">
              {t("nav.brand")}
            </p>
            <p className="text-xs text-on-surface-variant">{t("nav.portal")}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="app-nav">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "app-nav-link",
                      isActive
                        ? "is-active"
                        : "",
                    )
                  }
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {canSeeAdminSection ? (
            <>
              <div className="mx-3 mt-5 h-px bg-outline-variant/20" />
              <p className="app-nav-label">
                {t("nav.admin.section")}
              </p>
              <ul className="space-y-1">
                {ADMIN_NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "app-nav-link",
                          isActive
                            ? "is-active"
                            : "",
                        )
                      }
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {item.icon}
                      </span>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </nav>

        {/* User profile footer */}
        <div className="border-t border-outline-variant/20 p-4 select-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-fixed text-sm font-semibold text-on-primary-fixed">
              {(profile?.fullName || user?.fullName)?.charAt(0) ?? "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-on-surface">
                {profile?.fullName || user?.fullName || "Student"}
              </p>
              <p className="truncate text-xs text-on-surface-variant">
                {profile?.email || user?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-error"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            {t("nav.logout")}
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div
        className={cn(
          "app-body flex min-h-[100dvh] flex-col",
          isOpen && "has-sidebar",
        )}
      >
        {/* Top bar */}
        <header className="app-topbar">
          <button
            id="sidebar-toggle"
            aria-controls="app-sidebar"
            aria-expanded={isOpen}
            onClick={toggle}
            aria-label={t("nav.toggleSidebar")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isOpen ? "menu_open" : "menu"}
            </span>
          </button>

          {routeHeader.showBack && routeHeader.backTo ? (
            <button
              type="button"
              onClick={() => navigate(routeHeader.backTo!)}
              aria-label={t("nav.header.back")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          ) : null}

          <p className="min-w-0 flex-1 truncate font-headline text-sm font-semibold leading-tight text-on-surface">
            {t(routeHeader.titleKey)}
          </p>

          {/* Language switcher — abbreviated on mobile, full on sm+ */}
          <div className="flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-xs font-medium">
            <button
              onClick={() => handleLanguageChange("en")}
              className={cn(
                "transition-colors",
                language === "en"
                  ? "font-semibold text-on-surface"
                  : "text-on-surface-variant/50 hover:text-on-surface-variant",
              )}
            >
              {t("nav.langEn")}
            </button>
            <span className="text-on-surface-variant/40">/</span>
            <button
              onClick={() => handleLanguageChange("vi")}
              className={cn(
                "transition-colors",
                language === "vi"
                  ? "font-semibold text-on-surface"
                  : "text-on-surface-variant/50 hover:text-on-surface-variant",
              )}
            >
              {t("nav.langVi")}
            </button>
          </div>

          {/* Notifications */}
          <NotificationsPopover />

          {/* Divider — hidden on mobile */}
          <div className="hidden sm:block mx-2 h-8 w-[1px] bg-outline-variant/30" />

          {/* User Profile Info — text hidden on mobile, avatar always visible */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-semibold text-on-surface leading-tight">{profile?.fullName || user?.fullName || "Student"}</span>
              <span className="text-xs text-on-surface-variant">ID: {profile?.studentCode || "N/A"}</span>
            </div>
            {profile?.avatar || user?.avatar ? (
              <img src={profile?.avatar || user?.avatar} alt="User avatar" className="h-9 w-9 rounded-full object-cover shadow-sm" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-fixed text-sm font-semibold text-on-primary-fixed shadow-sm">
                {(profile?.fullName || user?.fullName)?.charAt(0) ?? "U"}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" tabIndex={-1} className="app-page flex-1">
          <PenaltyBanner className="mb-4" />
          {children}
        </main>
      </div>
    </div>
  );
};
