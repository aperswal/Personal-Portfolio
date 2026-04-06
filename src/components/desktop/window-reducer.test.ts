import { describe, it, expect } from "vitest";
import { desktopReducer, initialDesktopState, type DesktopState } from "./window-reducer";
import { DEFAULT_WINDOW_SIZE } from "./types";

const defaultSize = DEFAULT_WINDOW_SIZE;
const defaultViewport = { width: 1440, height: 900 };

function openWindow(
  state: DesktopState,
  id: string,
  viewport = defaultViewport,
): DesktopState {
  return desktopReducer(state, { type: "OPEN_WINDOW", id, defaultSize, viewport });
}

describe("desktopReducer", () => {
  it("opens a window", () => {
    const state = openWindow(initialDesktopState, "a");

    expect(state.windows.size).toBe(1);
    expect(state.windowOrder).toEqual(["a"]);
    expect(state.windows.get("a")?.isMinimized).toBe(false);
    expect(state.windows.get("a")?.isMaximized).toBe(false);
  });

  it("does not open a duplicate — same window count after double open", () => {
    let state = openWindow(initialDesktopState, "a");
    state = openWindow(state, "a");

    expect(state.windows.size).toBe(1);
  });

  it("brings existing window to front when opened again", () => {
    let state = openWindow(initialDesktopState, "a");
    state = openWindow(state, "b");
    expect(state.windowOrder).toEqual(["a", "b"]);

    state = openWindow(state, "a");
    expect(state.windows.size).toBe(2);
    // a is now last (topmost) in z-order
    expect(state.windowOrder[state.windowOrder.length - 1]).toBe("a");
  });

  it("closes a window", () => {
    let state = openWindow(initialDesktopState, "a");
    state = desktopReducer(state, { type: "CLOSE_WINDOW", id: "a" });

    expect(state.windows.size).toBe(0);
    expect(state.windowOrder).toEqual([]);
  });

  it("minimizes a window", () => {
    let state = openWindow(initialDesktopState, "a");
    state = desktopReducer(state, { type: "MINIMIZE_WINDOW", id: "a" });

    expect(state.windows.get("a")?.isMinimized).toBe(true);
    // Window still exists
    expect(state.windows.size).toBe(1);
  });

  it("restores a minimized window and brings it to front", () => {
    let state = openWindow(initialDesktopState, "a");
    state = openWindow(state, "b");
    state = desktopReducer(state, { type: "MINIMIZE_WINDOW", id: "a" });
    expect(state.windows.get("a")?.isMinimized).toBe(true);

    state = desktopReducer(state, { type: "RESTORE_WINDOW", id: "a" });
    expect(state.windows.get("a")?.isMinimized).toBe(false);
    // Restored window is on top
    expect(state.windowOrder[state.windowOrder.length - 1]).toBe("a");
  });

  it("maximizes a window", () => {
    let state = openWindow(initialDesktopState, "a");
    state = desktopReducer(state, { type: "MAXIMIZE_WINDOW", id: "a" });

    const win = state.windows.get("a");
    expect(win?.isMaximized).toBe(true);
    // Pre-maximize state is saved
    expect(win?.preMaximize).not.toBeNull();
    expect(win?.preMaximize?.size).toEqual(defaultSize);
  });

  it("toggles maximize back to normal", () => {
    let state = openWindow(initialDesktopState, "a");
    const originalPosition = state.windows.get("a")!.position;

    state = desktopReducer(state, { type: "MAXIMIZE_WINDOW", id: "a" });
    expect(state.windows.get("a")?.isMaximized).toBe(true);

    // Maximize again → restore
    state = desktopReducer(state, { type: "MAXIMIZE_WINDOW", id: "a" });
    const restored = state.windows.get("a");
    expect(restored?.isMaximized).toBe(false);
    expect(restored?.size).toEqual(defaultSize);
    expect(restored?.position).toEqual(originalPosition);
    expect(restored?.preMaximize).toBeNull();
  });

  it("brings a window to the front of z-order", () => {
    let state = openWindow(initialDesktopState, "a");
    state = openWindow(state, "b");
    state = openWindow(state, "c");
    expect(state.windowOrder).toEqual(["a", "b", "c"]);

    state = desktopReducer(state, { type: "BRING_TO_FRONT", id: "a" });
    expect(state.windowOrder).toEqual(["b", "c", "a"]);
  });

  it("bringToFront is a no-op if window is already on top", () => {
    let state = openWindow(initialDesktopState, "a");
    state = openWindow(state, "b");

    const before = state;
    const after = desktopReducer(state, { type: "BRING_TO_FRONT", id: "b" });
    // Returns same reference (no unnecessary re-render)
    expect(after).toBe(before);
  });

  it("opening a minimized window un-minimizes it", () => {
    let state = openWindow(initialDesktopState, "a");
    state = desktopReducer(state, { type: "MINIMIZE_WINDOW", id: "a" });
    expect(state.windows.get("a")?.isMinimized).toBe(true);

    state = openWindow(state, "a");
    expect(state.windows.get("a")?.isMinimized).toBe(false);
    expect(state.windows.size).toBe(1);
  });

  it("minimizes a maximized window directly", () => {
    let state = openWindow(initialDesktopState, "a");
    state = desktopReducer(state, { type: "MAXIMIZE_WINDOW", id: "a" });
    expect(state.windows.get("a")?.isMaximized).toBe(true);

    state = desktopReducer(state, { type: "MINIMIZE_WINDOW", id: "a" });
    const win = state.windows.get("a");
    expect(win?.isMinimized).toBe(true);
    // Maximized state preserved so restoring goes back to full screen
    expect(win?.isMaximized).toBe(true);
  });

  it("updates window position", () => {
    let state = openWindow(initialDesktopState, "a");
    state = desktopReducer(state, {
      type: "UPDATE_POSITION",
      id: "a",
      position: { x: 200, y: 300 },
    });

    expect(state.windows.get("a")?.position).toEqual({ x: 200, y: 300 });
  });

  it("clamps window size to small viewport", () => {
    const smallViewport = { width: 400, height: 300 };
    const state = openWindow(initialDesktopState, "a", smallViewport);
    const win = state.windows.get("a")!;

    // Default size is 640x480, should be clamped to 380x240
    expect(win.size.width).toBeLessThanOrEqual(smallViewport.width - 20);
    expect(win.size.height).toBeLessThanOrEqual(smallViewport.height - 60);
  });

  it("stagger positions stay within viewport bounds", () => {
    const smallViewport = { width: 500, height: 350 };
    let state = initialDesktopState;
    for (let i = 0; i < 6; i++) {
      state = openWindow(state, `win-${i}`, smallViewport);
    }

    for (const [, win] of state.windows) {
      expect(win.position.x).toBeLessThanOrEqual(smallViewport.width - 100);
      expect(win.position.y).toBeLessThanOrEqual(smallViewport.height - 100);
      expect(win.position.x).toBeGreaterThanOrEqual(0);
      expect(win.position.y).toBeGreaterThanOrEqual(0);
    }
  });
});
