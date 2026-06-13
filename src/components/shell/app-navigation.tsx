"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useWindowManager,
  type WindowManagerApi,
} from "@/components/desktop/window-manager";
import { DEFAULT_WINDOW_SIZE } from "@/components/desktop/types";
import { appMeta } from "@/data/apps";

/**
 * The single navigation seam every presentation (desktop, mobile) implements.
 * Consumers (e.g. the media folder) depend on this contract, never on the
 * window store, so the same UI drives different backends.
 */
export interface AppNavigation {
  openApp(id: string): void;
  closeApp(id?: string): void;
  focusApp(id: string): void;
  isAppOpen(id: string): boolean;
}

const AppNavigationContext = createContext<AppNavigation | null>(null);

/**
 * Reads the active navigation backend. Throws outside a provider so a missing
 * presentation wrapper fails loudly at the call site instead of silently
 * no-op'ing navigation.
 */
export function useAppNavigation(): AppNavigation {
  const nav = useContext(AppNavigationContext);
  if (!nav) {
    throw new Error("useAppNavigation must be used within an AppNavigationProvider");
  }
  return nav;
}

/** Generic provider — each presentation supplies its own backend `value`. */
export function AppNavigationProvider({
  value,
  children,
}: {
  value: AppNavigation;
  children: ReactNode;
}) {
  return (
    <AppNavigationContext.Provider value={value}>
      {children}
    </AppNavigationContext.Provider>
  );
}

/**
 * Desktop backend: maps the navigation contract onto the window-store facade.
 * Pure so it can be tested against a fake WindowManagerApi without rendering.
 */
export function createDesktopAppNavigation(api: WindowManagerApi): AppNavigation {
  return {
    openApp: (id) => api.openWindow(id, appMeta[id]?.defaultSize ?? DEFAULT_WINDOW_SIZE),
    closeApp: (id) => {
      if (id) api.closeWindow(id);
    },
    focusApp: (id) => api.bringToFront(id),
    isAppOpen: (id) => api.isWindowOpen(id),
  };
}

/** Wires the desktop backend; must sit inside WindowManagerProvider. */
export function DesktopAppNavigationProvider({ children }: { children: ReactNode }) {
  const api = useWindowManager();
  // The facade's action refs are identity-stable, so `api` only changes when
  // the windows Map/order do — re-deriving then is cheap and correct.
  const value = useMemo(() => createDesktopAppNavigation(api), [api]);
  return <AppNavigationProvider value={value}>{children}</AppNavigationProvider>;
}

/** Side effects the mobile backend depends on, injected so it stays testable. */
export interface MobileNavigationDeps {
  /** The currently open app, read from `?app=`, or null at the home grid. */
  activeAppId: string | null;
  /** Navigate to a given app (drives the URL's `?app=`). */
  pushApp: (id: string) => void;
  /** Return to the home grid (drops `?app=`). */
  clear: () => void;
}

/**
 * Mobile backend: navigation is URL-driven, so "open" and "focus" both push the
 * app onto the URL and "close" returns to the grid. Pure so it can be tested
 * against a fake deps object without rendering.
 */
export function createMobileAppNavigation(deps: MobileNavigationDeps): AppNavigation {
  return {
    openApp: (id) => deps.pushApp(id),
    focusApp: (id) => deps.pushApp(id),
    closeApp: () => deps.clear(),
    isAppOpen: (id) => deps.activeAppId === id,
  };
}

/** Wires the mobile backend; reads/writes `?app=` via the Next.js router. */
export function MobileAppNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeAppId = searchParams.get("app");

  const value = useMemo(
    () =>
      createMobileAppNavigation({
        activeAppId,
        pushApp: (id) => router.push(`${pathname}?app=${id}`),
        clear: () => router.push(pathname),
      }),
    [activeAppId, router, pathname],
  );

  return <AppNavigationProvider value={value}>{children}</AppNavigationProvider>;
}
