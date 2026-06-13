"use client";

import { useSearchParams } from "next/navigation";
import { MobileAppNavigationProvider } from "@/components/shell/app-navigation";
import { parseAppParam } from "@/components/shell/app-param";
import { HomeGrid } from "./home-grid";
import { MobileAppView } from "./mobile-app-view";
import { StatusBar } from "./status-bar";
import type { AppDefinition } from "@/components/desktop/types";

function MobileShellSurface({ apps }: { apps: AppDefinition[] }) {
  const searchParams = useSearchParams();
  const appId = parseAppParam(searchParams.get("app"));
  const activeApp = appId ? apps.find((app) => app.id === appId) : undefined;

  return (
    <>
      {activeApp ? <MobileAppView app={activeApp} /> : <HomeGrid apps={apps} />}
      {/* OS chrome owned by the shell so it shows on both home and app views.
          Tone adapts: white over the dark wallpaper, dark over the light app. */}
      <StatusBar tone={activeApp ? "dark" : "light"} />
      {/* Bottom home indicator — tinted to stay visible on either surface:
          white over the dark wallpaper, dark over the light app view. */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)" }}
        aria-hidden="true"
      >
        <span
          className={`h-1 w-32 rounded-full ${
            activeApp ? "bg-deep-brown/40" : "bg-white/90"
          }`}
        />
      </div>
    </>
  );
}

/**
 * The mobile presentation root. Validates the `?app=` deep link at the boundary
 * (failing closed to the grid) and wraps the surface in the URL-driven
 * navigation backend. Must be rendered inside <Suspense> by the caller because
 * it and its provider read useSearchParams.
 */
export function MobileShell({ apps }: { apps: AppDefinition[] }) {
  return (
    <MobileAppNavigationProvider>
      <MobileShellSurface apps={apps} />
    </MobileAppNavigationProvider>
  );
}
