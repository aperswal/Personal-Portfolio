"use client";

import { useEffect, useMemo } from "react";
import { WindowManagerProvider } from "./window-manager";
import { useWindowStore } from "./window-store";
import { DesktopWindow } from "./window";
import { DesktopIcons } from "./desktop-icons";
import { Dock } from "./dock";
import { OrientationNotice } from "./orientation-notice";
import type { AppDefinition } from "./types";

interface DesktopProps {
  apps: AppDefinition[];
  /** App id to open on a first visit (or when the desktop restores to empty) */
  initialAppId?: string;
}

function DesktopSurface({ apps, initialAppId }: DesktopProps) {
  // Select windowOrder directly (not via the facade) so this surface does NOT
  // subscribe to the windows Map — it should not re-render on every drag frame.
  const windowOrder = useWindowStore((s) => s.windowOrder);
  const hasHydrated = useWindowStore((s) => s.hasHydrated);
  const restored = useWindowStore((s) => s.restored);
  const viewport = useWindowStore((s) => s.viewport);
  const restoreSession = useWindowStore((s) => s.restoreSession);

  // Boolean selector: re-renders only when the dock's visibility actually flips,
  // and gated on `restored` so the dock stays visible through rehydrate until a
  // restored-maximized window has been un-maximized (no blank no-dock frame).
  const hasMaximized = useWindowStore(
    (s) =>
      s.restored &&
      Array.from(s.windows.values()).some((w) => w.isMaximized && !w.isMinimized),
  );

  const appsById = useMemo(() => new Map(apps.map((a) => [a.id, a])), [apps]);
  const validIds = useMemo(() => apps.map((a) => a.id), [apps]);

  // Run the one-shot restore (prune + clamp + welcome) once persisted state is
  // read back and the viewport is measured. `restored` is store-owned, so the
  // windows layer below stays gated on it: server and first client render both
  // show no windows (no hydration mismatch), and restored windows never flash
  // off-screen because the first painted frame is already clamped.
  useEffect(() => {
    if (!hasHydrated || viewport.width <= 0 || viewport.height <= 0) return;
    const initialApp = initialAppId ? appsById.get(initialAppId) : undefined;
    restoreSession(validIds, initialApp?.id, initialApp?.defaultSize);
  }, [
    hasHydrated,
    viewport.width,
    viewport.height,
    restoreSession,
    validIds,
    initialAppId,
    appsById,
  ]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-parchment bg-[url('/wallpaper.png')] bg-cover bg-center bg-no-repeat">
      {/* Desktop icons grid — right side */}
      <DesktopIcons apps={apps} />

      {/* Windows layer — only once persisted state is restored + clamped */}
      {restored &&
        windowOrder.map((id, i) => {
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
