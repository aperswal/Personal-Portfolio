import type { ReactNode } from "react";

/** Position of a window on the desktop surface */
export interface WindowPosition {
  x: number;
  y: number;
}

/** Size of a window */
export interface WindowSize {
  width: number;
  height: number;
}

/** Runtime state for an open window */
export interface WindowState {
  id: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: WindowPosition;
  size: WindowSize;
  /** Pre-maximize position/size so we can restore */
  preMaximize: { position: WindowPosition; size: WindowSize } | null;
}

/** Fallback size when no app-specific default is provided */
export const DEFAULT_WINDOW_SIZE: WindowSize = { width: 640, height: 480 };

/** Static definition of a desktop app */
export interface AppDefinition {
  id: string;
  title: string;
  icon: ReactNode;
  defaultSize: WindowSize;
  content: ReactNode;
  /** If true, the app is openable but won't appear on the desktop or dock */
  hidden?: boolean;
}
