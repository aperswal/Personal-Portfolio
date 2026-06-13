import type { WindowState, WindowPosition, WindowSize } from "./types";
import { DEFAULT_WINDOW_SIZE } from "./types";

/** Immutable state for the window manager */
export interface DesktopState {
  windows: Map<string, WindowState>;
  windowOrder: string[];
}

/** All possible actions against the window manager */
export type DesktopAction =
  | {
      type: "OPEN_WINDOW";
      id: string;
      defaultSize: WindowSize;
      viewport: { width: number; height: number };
    }
  | { type: "CLOSE_WINDOW"; id: string }
  | { type: "MINIMIZE_WINDOW"; id: string }
  | { type: "MAXIMIZE_WINDOW"; id: string }
  | { type: "RESTORE_WINDOW"; id: string }
  | { type: "BRING_TO_FRONT"; id: string }
  | { type: "UPDATE_POSITION"; id: string; position: WindowPosition }
  | { type: "UPDATE_SIZE"; id: string; size: WindowSize; position?: WindowPosition }
  | {
      type: "RECONCILE";
      validIds: string[];
      viewport: { width: number; height: number };
    };

/** Horizontal px of a window that must remain reachable on-screen */
const ON_SCREEN_MARGIN = 100;
/** Vertical px keeping the title bar reachable from the top */
const TITLE_BAR_MARGIN = 40;
/** Side gap kept clear when fitting a window's width to the viewport */
const VIEWPORT_WIDTH_MARGIN = 20;
/** Top+bottom gap kept clear when fitting a window's height to the viewport */
const VIEWPORT_HEIGHT_MARGIN = 60;

function finite(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function clampRange(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(value, hi));
}

/**
 * Pull a window's position into the current viewport so its title bar stays
 * reachable. Mirrors the live drag invariant in window.tsx exactly, and is a
 * no-op when the viewport is not yet measured (0x0).
 */
export function clampPositionToViewport(
  position: WindowPosition,
  size: WindowSize,
  viewport: { width: number; height: number },
): WindowPosition {
  if (viewport.width <= 0 || viewport.height <= 0) return position;
  return {
    x: clampRange(
      finite(position.x),
      -(size.width - ON_SCREEN_MARGIN),
      viewport.width - ON_SCREEN_MARGIN,
    ),
    y: clampRange(finite(position.y), 0, viewport.height - TITLE_BAR_MARGIN),
  };
}

/**
 * Shrink a window's size to fit the viewport (never enlarges it). Floored at 1px
 * so a freak sub-margin viewport can never yield a non-positive dimension —
 * which would otherwise render as invalid CSS and fail the persistence schema's
 * `size > 0` check on the next load, wiping all saved windows.
 */
function clampSizeToViewport(
  size: WindowSize,
  viewport: { width: number; height: number },
): WindowSize {
  if (viewport.width <= 0 || viewport.height <= 0) return size;
  return {
    width: Math.max(1, Math.min(size.width, viewport.width - VIEWPORT_WIDTH_MARGIN)),
    height: Math.max(1, Math.min(size.height, viewport.height - VIEWPORT_HEIGHT_MARGIN)),
  };
}

/**
 * Normalize a single restored window for the current viewport: drop any
 * maximized state (restore as a normal window), then fit size + position
 * on-screen. Prune-only when the viewport is unknown.
 */
function reconcileWindow(
  win: WindowState,
  viewport: { width: number; height: number },
): WindowState {
  if (viewport.width <= 0 || viewport.height <= 0) return win;
  const normalized: WindowState = win.isMaximized
    ? { ...win, isMaximized: false, preMaximize: null }
    : win;
  const size = clampSizeToViewport(normalized.size, viewport);
  const position = clampPositionToViewport(normalized.position, size, viewport);
  return { ...normalized, size, position };
}

const STAGGER_BASE_X = 80;
const STAGGER_BASE_Y = 60;
const STAGGER_OFFSET = 30;
const MAX_STAGGER_SLOTS = 6;

function getStaggeredPosition(
  index: number,
  viewport?: { width: number; height: number },
): WindowPosition {
  const scale = viewport && viewport.width < 800 ? 0.5 : 1;
  const x = STAGGER_BASE_X * scale + (index % MAX_STAGGER_SLOTS) * STAGGER_OFFSET * scale;
  const y = STAGGER_BASE_Y * scale + (index % MAX_STAGGER_SLOTS) * STAGGER_OFFSET * scale;

  if (!viewport || (viewport.width === 0 && viewport.height === 0)) {
    return { x, y };
  }

  return {
    x: Math.min(x, Math.max(0, viewport.width - 100)),
    y: Math.min(y, Math.max(0, viewport.height - 100)),
  };
}

export const initialDesktopState: DesktopState = {
  windows: new Map(),
  windowOrder: [],
};

export function desktopReducer(state: DesktopState, action: DesktopAction): DesktopState {
  switch (action.type) {
    case "OPEN_WINDOW": {
      const existing = state.windows.get(action.id);

      if (existing) {
        // Already open and already focused — nothing to change (preserve refs so
        // the store skips a redundant re-render + persist write).
        const isTopmost = state.windowOrder[state.windowOrder.length - 1] === action.id;
        if (!existing.isMinimized && isTopmost) return state;

        // Otherwise un-minimize if needed and bring to front.
        const windows = new Map(state.windows);
        if (existing.isMinimized) {
          windows.set(action.id, { ...existing, isMinimized: false });
        }
        const order = [...state.windowOrder.filter((id) => id !== action.id), action.id];
        return { windows, windowOrder: order };
      }

      const vp = action.viewport;
      const clampedSize = clampSizeToViewport(action.defaultSize, vp);

      const windows = new Map(state.windows);
      windows.set(action.id, {
        id: action.id,
        isMinimized: false,
        isMaximized: false,
        position: getStaggeredPosition(state.windows.size, vp),
        size: clampedSize,
        preMaximize: null,
      });

      return {
        windows,
        windowOrder: [...state.windowOrder, action.id],
      };
    }

    case "CLOSE_WINDOW": {
      if (!state.windows.has(action.id)) return state;
      const windows = new Map(state.windows);
      windows.delete(action.id);
      return {
        windows,
        windowOrder: state.windowOrder.filter((id) => id !== action.id),
      };
    }

    case "MINIMIZE_WINDOW": {
      const win = state.windows.get(action.id);
      if (!win || win.isMinimized) return state;
      const windows = new Map(state.windows);
      windows.set(action.id, { ...win, isMinimized: true });
      return { ...state, windows };
    }

    case "MAXIMIZE_WINDOW": {
      const win = state.windows.get(action.id);
      if (!win) return state;
      const windows = new Map(state.windows);

      if (win.isMaximized) {
        // Toggle back to normal
        const restored = win.preMaximize ?? {
          position: getStaggeredPosition(0),
          size: DEFAULT_WINDOW_SIZE,
        };
        windows.set(action.id, {
          ...win,
          isMaximized: false,
          position: restored.position,
          size: restored.size,
          preMaximize: null,
        });
      } else {
        windows.set(action.id, {
          ...win,
          isMaximized: true,
          preMaximize: { position: win.position, size: win.size },
        });
      }
      return { ...state, windows };
    }

    case "RESTORE_WINDOW": {
      const win = state.windows.get(action.id);
      if (!win) return state;
      // Already visible and on top — no change.
      const isTopmost = state.windowOrder[state.windowOrder.length - 1] === action.id;
      if (!win.isMinimized && isTopmost) return state;
      const windows = new Map(state.windows);
      windows.set(action.id, { ...win, isMinimized: false });
      const order = [...state.windowOrder.filter((id) => id !== action.id), action.id];
      return { windows, windowOrder: order };
    }

    case "BRING_TO_FRONT": {
      if (state.windowOrder[state.windowOrder.length - 1] === action.id) {
        return state;
      }
      return {
        ...state,
        windowOrder: [...state.windowOrder.filter((id) => id !== action.id), action.id],
      };
    }

    case "UPDATE_POSITION": {
      const win = state.windows.get(action.id);
      if (!win) return state;
      const windows = new Map(state.windows);
      windows.set(action.id, { ...win, position: action.position });
      return { ...state, windows };
    }

    case "UPDATE_SIZE": {
      const win = state.windows.get(action.id);
      if (!win) return state;
      const windows = new Map(state.windows);
      windows.set(action.id, {
        ...win,
        size: action.size,
        ...(action.position && { position: action.position }),
      });
      return { ...state, windows };
    }

    case "RECONCILE": {
      const valid = new Set(action.validIds);

      // Keep only ids that are registered AND present in both collections,
      // filtering windowOrder (never rebuilding) so survivor stack order holds.
      const windowOrder = state.windowOrder.filter(
        (id) => valid.has(id) && state.windows.has(id),
      );

      const windows = new Map<string, WindowState>();
      for (const id of windowOrder) {
        windows.set(id, reconcileWindow(state.windows.get(id)!, action.viewport));
      }

      return { windows, windowOrder };
    }

    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}
