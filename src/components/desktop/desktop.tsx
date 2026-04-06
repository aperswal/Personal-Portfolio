"use client";

import { useEffect } from "react";
import { WindowManagerProvider, useWindowManager } from "./window-manager";
import { DesktopWindow } from "./window";
import { DesktopIcons } from "./desktop-icons";
import { Dock } from "./dock";
import { OrientationNotice } from "./orientation-notice";
import type { AppDefinition } from "./types";

interface DesktopProps {
  apps: AppDefinition[];
  /** App id to open on first load */
  initialAppId?: string;
}

function DesktopSurface({ apps, initialAppId }: DesktopProps) {
  const { state, openWindow } = useWindowManager();
  const { windowOrder } = state;

  const appsById = new Map(apps.map((a) => [a.id, a]));

  // Check if any window is maximized (hides the dock)
  const hasMaximized = Array.from(state.windows.values()).some(
    (w) => w.isMaximized && !w.isMinimized,
  );

  // Open the initial window on mount
  useEffect(() => {
    if (initialAppId) {
      const app = appsById.get(initialAppId);
      if (app) {
        openWindow(initialAppId, app.defaultSize);
      }
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-parchment bg-[url('/wallpaper.png')] bg-cover bg-center bg-no-repeat">
      {/* Desktop icons grid — right side */}
      <DesktopIcons apps={apps} />

      {/* Windows layer */}
      {windowOrder.map((id, i) => {
        const app = appsById.get(id);
        if (!app) return null;
        return <DesktopWindow key={id} app={app} zIndex={100 + i} />;
      })}

      {/* Dock — hidden when a window is maximized */}
      {!hasMaximized && <Dock apps={apps} />}

      {/* Orientation notice for small portrait screens */}
      <OrientationNotice />
    </div>
  );
}

export function Desktop({ apps, initialAppId }: DesktopProps) {
  return (
    <WindowManagerProvider>
      <DesktopSurface apps={apps} initialAppId={initialAppId} />
    </WindowManagerProvider>
  );
}
