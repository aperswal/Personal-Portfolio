"use client";

import { useEffect, type ReactNode } from "react";
import type { WindowPosition, WindowSize } from "./types";
import type { DesktopState } from "./window-reducer";
import { useWindowStore, flushWindowStorage } from "./window-store";
import { useViewportSize } from "@/lib/use-viewport-size";

interface WindowManagerApi {
  state: Pick<DesktopState, "windows" | "windowOrder">;
  openWindow: (id: string, defaultSize?: WindowSize) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updatePosition: (id: string, position: WindowPosition) => void;
  updateSize: (id: string, size: WindowSize, position?: WindowPosition) => void;
  isWindowOpen: (id: string) => boolean;
}

/**
 * Store-backed facade preserving the original useWindowManager API so window /
 * dock / desktop-icons consumers are untouched. Each field is selected
 * individually: the Map and array refs change only when windows change, and
 * action refs are stable, so the fresh wrapper object never drives a re-render
 * loop (nothing selects on it).
 */
export function useWindowManager(): WindowManagerApi {
  const windows = useWindowStore((s) => s.windows);
  const windowOrder = useWindowStore((s) => s.windowOrder);
  const openWindow = useWindowStore((s) => s.openWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const bringToFront = useWindowStore((s) => s.bringToFront);
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const updateSize = useWindowStore((s) => s.updateSize);
  const isWindowOpen = useWindowStore((s) => s.isWindowOpen);

  return {
    state: { windows, windowOrder },
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    bringToFront,
    updatePosition,
    updateSize,
    isWindowOpen,
  };
}

/**
 * Hosts the side effects the global store can't run by itself: syncing the live
 * viewport into the store (so actions clamp correctly), reading persisted state
 * back on mount, and flushing the pending write before the tab is hidden so a
 * drag-then-leave never loses the final layout.
 */
export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const { width, height } = useViewportSize();
  const setViewport = useWindowStore((s) => s.setViewport);

  // Read persisted windows back BEFORE the first viewport sync, so the earliest
  // persist write is always the restored layout — never the empty initial state.
  useEffect(() => {
    void useWindowStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    setViewport({ width, height });
  }, [width, height, setViewport]);

  // Force the pending debounced write out before the tab is backgrounded or
  // frozen, so a drag-then-leave never loses the final layout.
  useEffect(() => {
    const flushOnHide = () => {
      if (document.visibilityState === "hidden") flushWindowStorage();
    };
    window.addEventListener("pagehide", flushWindowStorage);
    document.addEventListener("visibilitychange", flushOnHide);
    document.addEventListener("freeze", flushWindowStorage);
    return () => {
      window.removeEventListener("pagehide", flushWindowStorage);
      document.removeEventListener("visibilitychange", flushOnHide);
      document.removeEventListener("freeze", flushWindowStorage);
    };
  }, []);

  return <>{children}</>;
}
