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
  | { type: "UPDATE_SIZE"; id: string; size: WindowSize; position?: WindowPosition };

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
        // Already open — un-minimize if needed and bring to front
        const windows = new Map(state.windows);
        if (existing.isMinimized) {
          windows.set(action.id, { ...existing, isMinimized: false });
        }
        const order = [...state.windowOrder.filter((id) => id !== action.id), action.id];
        return { windows, windowOrder: order };
      }

      const vp = action.viewport;
      const clampedSize: WindowSize = {
        width:
          vp.width > 0
            ? Math.min(action.defaultSize.width, vp.width - 20)
            : action.defaultSize.width,
        height:
          vp.height > 0
            ? Math.min(action.defaultSize.height, vp.height - 60)
            : action.defaultSize.height,
      };

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
      const windows = new Map(state.windows);
      windows.delete(action.id);
      return {
        windows,
        windowOrder: state.windowOrder.filter((id) => id !== action.id),
      };
    }

    case "MINIMIZE_WINDOW": {
      const win = state.windows.get(action.id);
      if (!win) return state;
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

    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}
