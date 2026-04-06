"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { WindowPosition, WindowSize } from "./types";
import { DEFAULT_WINDOW_SIZE } from "./types";
import { desktopReducer, initialDesktopState, type DesktopState } from "./window-reducer";
import { useViewportSize } from "@/lib/use-viewport-size";

interface WindowManagerContextValue {
  state: DesktopState;
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

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(desktopReducer, initialDesktopState);
  const { width: vw, height: vh } = useViewportSize();

  const openWindow = useCallback(
    (id: string, defaultSize?: WindowSize) =>
      dispatch({
        type: "OPEN_WINDOW",
        id,
        defaultSize: defaultSize ?? DEFAULT_WINDOW_SIZE,
        viewport: { width: vw, height: vh },
      }),
    [vw, vh],
  );

  const closeWindow = useCallback(
    (id: string) => dispatch({ type: "CLOSE_WINDOW", id }),
    [],
  );

  const minimizeWindow = useCallback(
    (id: string) => dispatch({ type: "MINIMIZE_WINDOW", id }),
    [],
  );

  const maximizeWindow = useCallback(
    (id: string) => dispatch({ type: "MAXIMIZE_WINDOW", id }),
    [],
  );

  const restoreWindow = useCallback(
    (id: string) => dispatch({ type: "RESTORE_WINDOW", id }),
    [],
  );

  const bringToFront = useCallback(
    (id: string) => dispatch({ type: "BRING_TO_FRONT", id }),
    [],
  );

  const updatePosition = useCallback(
    (id: string, position: WindowPosition) =>
      dispatch({ type: "UPDATE_POSITION", id, position }),
    [],
  );

  const updateSize = useCallback(
    (id: string, size: WindowSize, position?: WindowPosition) =>
      dispatch({ type: "UPDATE_SIZE", id, size, position }),
    [],
  );

  const isWindowOpen = useCallback(
    (id: string) => {
      const win = state.windows.get(id);
      return !!win && !win.isMinimized;
    },
    [state.windows],
  );

  const value = useMemo<WindowManagerContextValue>(
    () => ({
      state,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      bringToFront,
      updatePosition,
      updateSize,
      isWindowOpen,
    }),
    [
      state,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      bringToFront,
      updatePosition,
      updateSize,
      isWindowOpen,
    ],
  );

  return <WindowManagerContext value={value}>{children}</WindowManagerContext>;
}

export function useWindowManager(): WindowManagerContextValue {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) {
    throw new Error("useWindowManager must be used within WindowManagerProvider");
  }
  return ctx;
}
