"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { desktopReducer, type DesktopAction } from "./window-reducer";
import {
  DEFAULT_WINDOW_SIZE,
  type WindowPosition,
  type WindowSize,
  type WindowState,
} from "./types";
import {
  PERSIST_NAME,
  PERSIST_VERSION,
  createWindowStorage,
  sanitizePersisted,
  serializeWindows,
  type FlushableStorage,
  type PersistedWindows,
} from "./window-persistence";

export interface Viewport {
  width: number;
  height: number;
}

export interface WindowStoreState {
  /** Open windows keyed by app id. */
  windows: Map<string, WindowState>;
  /** Z-order of windows; last entry is topmost. */
  windowOrder: string[];
  /** Current viewport, kept in the store so actions can clamp without React. */
  viewport: Viewport;
  /** True once persisted state has been read back (or confirmed absent). */
  hasHydrated: boolean;
  /** True once the one-shot post-hydration restore (reconcile + welcome) ran. */
  restored: boolean;

  openWindow: (id: string, defaultSize?: WindowSize) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updatePosition: (id: string, position: WindowPosition) => void;
  updateSize: (id: string, size: WindowSize, position?: WindowPosition) => void;
  setViewport: (viewport: Viewport) => void;
  /** Drop windows whose id is not registered and clamp survivors on-screen. */
  reconcile: (validIds: string[]) => void;
  /** Open the welcome app only if the desktop restored to nothing. */
  welcomeIfNeeded: (initialAppId: string, defaultSize?: WindowSize) => void;
  /**
   * One-shot post-hydration restore: prune+clamp to the current viewport, then
   * open the welcome app if nothing was restored. Idempotent (StrictMode-safe).
   */
  restoreSession: (
    validIds: string[],
    initialAppId?: string,
    defaultSize?: WindowSize,
  ) => void;
  setHasHydrated: (value: boolean) => void;
  isWindowOpen: (id: string) => boolean;
}

export interface CreateWindowStoreOptions {
  name?: string;
  storage?: FlushableStorage;
}

/**
 * Build a persisted window store. The reducer remains the single source of
 * window-state transitions; this store is a thin adapter that injects the live
 * viewport, tracks hydration, and wires localStorage persistence.
 */
export function createWindowStore(options: CreateWindowStoreOptions = {}) {
  const storage = options.storage ?? createWindowStorage();
  const name = options.name ?? PERSIST_NAME;

  // Captured after create() so onRehydrateStorage can always flip hasHydrated,
  // even when rehydration errors and no state object is handed back.
  let ref: { getState: () => WindowStoreState } | null = null;

  const store = create<WindowStoreState>()(
    persist<WindowStoreState, [], [], PersistedWindows>(
      (set, get) => {
        const apply = (action: DesktopAction): void => {
          const { windows, windowOrder } = get();
          const next = desktopReducer({ windows, windowOrder }, action);
          // Reducer returns the same refs on a no-op — skip the update so we
          // don't re-render consumers or trigger a redundant persist write.
          if (next.windows === windows && next.windowOrder === windowOrder) return;
          set({ windows: next.windows, windowOrder: next.windowOrder });
        };

        return {
          windows: new Map(),
          windowOrder: [],
          viewport: { width: 0, height: 0 },
          hasHydrated: false,
          restored: false,

          openWindow: (id, defaultSize) =>
            apply({
              type: "OPEN_WINDOW",
              id,
              defaultSize: defaultSize ?? DEFAULT_WINDOW_SIZE,
              viewport: get().viewport,
            }),
          closeWindow: (id) => apply({ type: "CLOSE_WINDOW", id }),
          minimizeWindow: (id) => apply({ type: "MINIMIZE_WINDOW", id }),
          maximizeWindow: (id) => apply({ type: "MAXIMIZE_WINDOW", id }),
          restoreWindow: (id) => apply({ type: "RESTORE_WINDOW", id }),
          bringToFront: (id) => apply({ type: "BRING_TO_FRONT", id }),
          updatePosition: (id, position) =>
            apply({ type: "UPDATE_POSITION", id, position }),
          updateSize: (id, size, position) =>
            apply({ type: "UPDATE_SIZE", id, size, position }),
          reconcile: (validIds) =>
            apply({ type: "RECONCILE", validIds, viewport: get().viewport }),
          setViewport: (viewport) => set({ viewport }),
          welcomeIfNeeded: (initialAppId, defaultSize) => {
            if (get().windowOrder.length === 0) {
              get().openWindow(initialAppId, defaultSize);
            }
          },
          restoreSession: (validIds, initialAppId, defaultSize) => {
            if (get().restored) return;
            get().reconcile(validIds);
            if (initialAppId) get().welcomeIfNeeded(initialAppId, defaultSize);
            set({ restored: true });
          },
          setHasHydrated: (value) => set({ hasHydrated: value }),
          isWindowOpen: (id) => {
            const win = get().windows.get(id);
            return !!win && !win.isMinimized;
          },
        };
      },
      {
        // Multi-tab persistence is intentionally last-write-wins: each tab holds
        // its own store and flushes its full snapshot on hide; the last tab to be
        // hidden wins. No cross-tab merge or refocus re-hydration (fine for a
        // single-user portfolio).
        name,
        version: PERSIST_VERSION,
        storage,
        partialize: (state): PersistedWindows => ({
          windows: serializeWindows(state.windows),
          windowOrder: state.windowOrder,
        }),
        merge: (persisted, current) => {
          const clean = sanitizePersisted(persisted);
          if (!clean) return current;
          return { ...current, windows: clean.windows, windowOrder: clean.windowOrder };
        },
        skipHydration: true,
        // Fail open: always mark hydrated so the UI un-gates even on read error.
        onRehydrateStorage: () => () => ref?.getState().setHasHydrated(true),
      },
    ),
  );

  ref = store;
  return { store, storage };
}

const main = createWindowStore();

/** Singleton window store used by the app. */
export const useWindowStore = main.store;

/** Force the pending debounced write out (wire to pagehide / tab-hidden). */
export function flushWindowStorage(): void {
  main.storage.flush();
}
