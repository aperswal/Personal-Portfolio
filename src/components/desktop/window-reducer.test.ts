import { describe, it, expect } from "vitest";
import {
  desktopReducer,
  initialDesktopState,
  clampPositionToViewport,
  type DesktopState,
} from "./window-reducer";
import { DEFAULT_WINDOW_SIZE, type WindowState } from "./types";

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

const VP = { width: 1440, height: 900 };

function mkWin(id: string, overrides: Partial<WindowState> = {}): WindowState {
  return {
    id,
    isMinimized: false,
    isMaximized: false,
    position: { x: 100, y: 100 },
    size: { width: 600, height: 400 },
    preMaximize: null,
    ...overrides,
  };
}

function mkState(wins: WindowState[], order?: string[]): DesktopState {
  return {
    windows: new Map(wins.map((w) => [w.id, w])),
    windowOrder: order ?? wins.map((w) => w.id),
  };
}

describe("clampPositionToViewport", () => {
  const size = { width: 600, height: 400 };

  it("leaves an in-bounds position unchanged", () => {
    expect(clampPositionToViewport({ x: 100, y: 100 }, size, VP)).toEqual({
      x: 100,
      y: 100,
    });
  });

  it("clamps the left edge to a size-dependent lower bound -(width-100)", () => {
    // Same invariant the drag handler enforces in window.tsx
    expect(clampPositionToViewport({ x: -1000, y: 100 }, size, VP).x).toBe(-(600 - 100));
  });

  it("clamps the right edge so at least 100px stays on-screen (vw-100)", () => {
    expect(clampPositionToViewport({ x: 2000, y: 100 }, size, VP).x).toBe(1440 - 100);
  });

  it("clamps y to [0, vh-40]", () => {
    expect(clampPositionToViewport({ x: 100, y: -50 }, size, VP).y).toBe(0);
    expect(clampPositionToViewport({ x: 100, y: 2000 }, size, VP).y).toBe(900 - 40);
  });

  it("is a no-op when the viewport is unknown (0x0)", () => {
    const pos = { x: 100, y: 100 };
    expect(clampPositionToViewport(pos, size, { width: 0, height: 0 })).toEqual(pos);
  });

  it("never emits NaN/Infinity even for non-finite input", () => {
    const out = clampPositionToViewport(
      { x: Number.NaN, y: Number.POSITIVE_INFINITY },
      size,
      VP,
    );
    expect(Number.isFinite(out.x)).toBe(true);
    expect(Number.isFinite(out.y)).toBe(true);
  });

  it("matches the window.tsx drag clamp on a shared fixture", () => {
    // Locks the invariant drag + reconcile must share.
    const drag = (x: number, y: number) => ({
      x: Math.max(-(size.width - 100), Math.min(x, VP.width - 100)),
      y: Math.max(0, Math.min(y, VP.height - 40)),
    });
    for (const [x, y] of [
      [100, 100],
      [-1000, 100],
      [2000, 5000],
      [-50, -50],
    ]) {
      expect(clampPositionToViewport({ x, y }, size, VP)).toEqual(drag(x, y));
    }
  });
});

describe("desktopReducer RECONCILE", () => {
  const reconcile = (state: DesktopState, validIds: string[], viewport = VP) =>
    desktopReducer(state, { type: "RECONCILE", validIds, viewport });

  it("prunes windows whose id is not in validIds, from both windows and order", () => {
    const state = mkState([mkWin("a"), mkWin("ghost"), mkWin("b")]);
    const next = reconcile(state, ["a", "b"]);

    expect([...next.windows.keys()].sort()).toEqual(["a", "b"]);
    expect(next.windowOrder).toEqual(["a", "b"]);
  });

  it("preserves the relative stack order of survivors when a middle window is pruned", () => {
    const state = mkState([mkWin("a"), mkWin("b"), mkWin("c")]);
    const next = reconcile(state, ["a", "c"]);
    // c must still be topmost (last), order filtered not rebuilt
    expect(next.windowOrder).toEqual(["a", "c"]);
  });

  it("keeps a hidden-but-registered app and prunes only truly-unknown ids", () => {
    const state = mkState([mkWin("movies"), mkWin("deleted-app"), mkWin("projects")]);
    const next = reconcile(state, ["movies", "projects", "contact"]);
    expect([...next.windows.keys()].sort()).toEqual(["movies", "projects"]);
  });

  it("empty validIds clears windows and order", () => {
    const state = mkState([mkWin("a"), mkWin("b")]);
    const next = reconcile(state, []);
    expect(next.windows.size).toBe(0);
    expect(next.windowOrder).toEqual([]);
  });

  it("drops an order id that has no matching window entry (orphan order)", () => {
    const state: DesktopState = {
      windows: new Map([["a", mkWin("a")]]),
      windowOrder: ["a", "orphan"],
    };
    const next = reconcile(state, ["a", "orphan"]);
    expect(next.windowOrder).toEqual(["a"]);
  });

  it("drops a window entry that is missing from windowOrder (invisible window)", () => {
    const state: DesktopState = {
      windows: new Map([
        ["a", mkWin("a")],
        ["b", mkWin("b")],
      ]),
      windowOrder: ["a"],
    };
    const next = reconcile(state, ["a", "b"]);
    expect([...next.windows.keys()]).toEqual(["a"]);
    expect(next.windowOrder).toEqual(["a"]);
  });

  it("clamps an off-screen survivor back in-bounds (algebraic from its size)", () => {
    const win = mkWin("a", {
      position: { x: 5000, y: 5000 },
      size: { width: 600, height: 400 },
    });
    const next = reconcile(mkState([win]), ["a"]);
    const out = next.windows.get("a")!;
    expect(out.position.x).toBe(VP.width - 100);
    expect(out.position.y).toBe(VP.height - 40);
  });

  it("leaves an in-bounds, non-maximized survivor's geometry byte-identical", () => {
    const win = mkWin("a", {
      position: { x: 120, y: 80 },
      size: { width: 500, height: 350 },
    });
    const next = reconcile(mkState([win]), ["a"]);
    const out = next.windows.get("a")!;
    expect(out.position).toEqual({ x: 120, y: 80 });
    expect(out.size).toEqual({ width: 500, height: 350 });
  });

  it("shrinks an oversized survivor to fit the current viewport", () => {
    const phone = { width: 390, height: 780 };
    const win = mkWin("a", {
      size: { width: 800, height: 560 },
      position: { x: 0, y: 0 },
    });
    const next = reconcile(mkState([win]), ["a"], phone);
    const out = next.windows.get("a")!;
    expect(out.size.width).toBeLessThanOrEqual(phone.width - 20);
    expect(out.size.height).toBeLessThanOrEqual(phone.height - 60);
  });

  it("preserves the minimized flag through reconcile", () => {
    const win = mkWin("a", { isMinimized: true });
    const next = reconcile(mkState([win]), ["a"]);
    expect(next.windows.get("a")?.isMinimized).toBe(true);
  });

  it("un-maximizes a maximized survivor (restores as a normal window)", () => {
    const win = mkWin("a", {
      isMaximized: true,
      position: { x: 200, y: 150 },
      size: { width: 700, height: 500 },
      preMaximize: { position: { x: 200, y: 150 }, size: { width: 700, height: 500 } },
    });
    const next = reconcile(mkState([win]), ["a"]);
    const out = next.windows.get("a")!;
    expect(out.isMaximized).toBe(false);
    expect(out.preMaximize).toBeNull();
    // geometry stays a real, on-screen window
    expect(Number.isFinite(out.position.x)).toBe(true);
    expect(out.size.width).toBeGreaterThan(0);
  });

  it("with an unknown viewport (0x0) prunes only and leaves geometry untouched", () => {
    const win = mkWin("a", {
      position: { x: 5000, y: 5000 },
      size: { width: 800, height: 560 },
    });
    const state = mkState([win, mkWin("ghost")]);
    const next = reconcile(state, ["a"], { width: 0, height: 0 });
    expect([...next.windows.keys()]).toEqual(["a"]);
    const out = next.windows.get("a")!;
    expect(out.position).toEqual({ x: 5000, y: 5000 });
    expect(out.size).toEqual({ width: 800, height: 560 });
  });

  it("never yields a non-positive size at a freak sub-margin viewport", () => {
    // width < 20 / height < 60 would make a naive `vp - margin` go negative,
    // which renders as invalid CSS and fails the persistence schema's size>0.
    const tiny = { width: 15, height: 50 };
    const next = reconcile(
      mkState([mkWin("a", { size: { width: 600, height: 400 } })]),
      ["a"],
      tiny,
    );
    const out = next.windows.get("a")!;
    expect(out.size.width).toBeGreaterThan(0);
    expect(out.size.height).toBeGreaterThan(0);
  });

  it("preserves a non-initial stack order (filters windowOrder, never rebuilds from validIds)", () => {
    // windowOrder diverges from validIds declaration order (e.g. after bringToFront).
    const state = mkState([mkWin("a"), mkWin("b"), mkWin("c")], ["b", "c", "a"]);
    const next = reconcile(state, ["a", "b", "c"]);
    expect(next.windowOrder).toEqual(["b", "c", "a"]);
  });
});

describe("desktopReducer no-op ref stability", () => {
  // These guard the store's apply() short-circuit: a logical no-op must return
  // the SAME state ref so it triggers no re-render and no redundant persist write.
  it("OPEN_WINDOW on an already-topmost, non-minimized window is a no-op", () => {
    const state = mkState([mkWin("a"), mkWin("b")]); // b is topmost
    const next = desktopReducer(state, {
      type: "OPEN_WINDOW",
      id: "b",
      defaultSize: DEFAULT_WINDOW_SIZE,
      viewport: VP,
    });
    expect(next).toBe(state);
  });

  it("OPEN_WINDOW on a non-topmost open window still brings it to front", () => {
    const state = mkState([mkWin("a"), mkWin("b")]);
    const next = desktopReducer(state, {
      type: "OPEN_WINDOW",
      id: "a",
      defaultSize: DEFAULT_WINDOW_SIZE,
      viewport: VP,
    });
    expect(next.windowOrder).toEqual(["b", "a"]);
  });

  it("MINIMIZE_WINDOW on an already-minimized window is a no-op", () => {
    const state = mkState([mkWin("a", { isMinimized: true })]);
    expect(desktopReducer(state, { type: "MINIMIZE_WINDOW", id: "a" })).toBe(state);
  });

  it("CLOSE_WINDOW on a missing window is a no-op", () => {
    const state = mkState([mkWin("a")]);
    expect(desktopReducer(state, { type: "CLOSE_WINDOW", id: "missing" })).toBe(state);
  });

  it("RESTORE_WINDOW on an already-topmost, non-minimized window is a no-op", () => {
    const state = mkState([mkWin("a"), mkWin("b")]);
    expect(desktopReducer(state, { type: "RESTORE_WINDOW", id: "b" })).toBe(state);
  });
});
