import { describe, it, expect, beforeEach } from "vitest";
import { createWindowStore, useWindowStore, flushWindowStorage } from "./window-store";
import { PERSIST_NAME, PERSIST_VERSION } from "./window-persistence";
import type { WindowState } from "./types";

let counter = 0;
/** Each test gets an isolated persistence key so they never cross-contaminate. */
function freshStore() {
  counter += 1;
  return createWindowStore({ name: `test:windows:${counter}` });
}

function mkWin(id: string, overrides: Partial<WindowState> = {}): WindowState {
  return {
    id,
    isMinimized: false,
    isMaximized: false,
    position: { x: 10, y: 10 },
    size: { width: 300, height: 200 },
    preMaximize: null,
    ...overrides,
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("window-store — actions delegate to the reducer", () => {
  it("openWindow adds a window and tracks order", () => {
    const { store } = freshStore();
    store.getState().openWindow("a", { width: 300, height: 200 });
    expect(store.getState().windowOrder).toEqual(["a"]);
    expect(store.getState().windows.has("a")).toBe(true);
  });

  it("openWindow reads the viewport from the store (unclamped at 0x0, clamped once set)", () => {
    const { store } = freshStore();
    // viewport unknown -> size is the requested default, unclamped
    store.getState().openWindow("a", { width: 640, height: 480 });
    expect(store.getState().windows.get("a")?.size.width).toBe(640);

    store.getState().setViewport({ width: 400, height: 300 });
    store.getState().openWindow("b", { width: 640, height: 480 });
    expect(store.getState().windows.get("b")!.size.width).toBeLessThanOrEqual(400 - 20);
  });

  it("closeWindow removes a window", () => {
    const { store } = freshStore();
    store.getState().openWindow("a");
    store.getState().closeWindow("a");
    expect(store.getState().windows.size).toBe(0);
    expect(store.getState().windowOrder).toEqual([]);
  });

  it("isWindowOpen reflects open / minimized state", () => {
    const { store } = freshStore();
    store.getState().openWindow("a");
    expect(store.getState().isWindowOpen("a")).toBe(true);
    store.getState().minimizeWindow("a");
    expect(store.getState().isWindowOpen("a")).toBe(false);
    expect(store.getState().isWindowOpen("missing")).toBe(false);
  });

  it("action references are identity-stable across state updates", () => {
    const { store } = freshStore();
    const before = store.getState().openWindow;
    store.getState().openWindow("a");
    store.getState().bringToFront("a");
    expect(store.getState().openWindow).toBe(before);
  });

  it("reconcile prunes unknown ids and clamps using the store viewport", () => {
    const { store } = freshStore();
    store.getState().setViewport({ width: 800, height: 600 });
    store.getState().openWindow("a", { width: 300, height: 200 });
    store.getState().openWindow("ghost", { width: 300, height: 200 });
    store.getState().updatePosition("a", { x: 5000, y: 5000 });

    store.getState().reconcile(["a"]);

    expect([...store.getState().windows.keys()]).toEqual(["a"]);
    expect(store.getState().windows.get("a")!.position.x).toBe(800 - 100);
  });
});

describe("window-store — welcomeIfNeeded", () => {
  it("opens the welcome app only when no windows are open", () => {
    const { store } = freshStore();
    store.getState().welcomeIfNeeded("cover-letter", { width: 300, height: 200 });
    expect(store.getState().windowOrder).toEqual(["cover-letter"]);
  });

  it("is a no-op (and never duplicates) when something is already open", () => {
    const { store } = freshStore();
    store.getState().openWindow("projects");
    store.getState().welcomeIfNeeded("cover-letter");
    expect(store.getState().windowOrder).toEqual(["projects"]);
  });

  it("opens the welcome app exactly once across repeated calls (StrictMode safety)", () => {
    const { store } = freshStore();
    store.getState().welcomeIfNeeded("cover-letter");
    store.getState().welcomeIfNeeded("cover-letter");
    expect(store.getState().windowOrder).toEqual(["cover-letter"]);
  });
});

describe("window-store — restoreSession (one-shot post-hydration restore)", () => {
  it("prunes unknown ids, clamps survivors, then opens nothing when windows remain", () => {
    const { store } = freshStore();
    store.getState().setViewport({ width: 800, height: 600 });
    store.getState().openWindow("projects", { width: 300, height: 200 });
    store.getState().openWindow("ghost", { width: 300, height: 200 });
    store.getState().updatePosition("projects", { x: 5000, y: 5000 });

    store
      .getState()
      .restoreSession(["projects"], "cover-letter", { width: 300, height: 200 });

    expect([...store.getState().windows.keys()]).toEqual(["projects"]);
    expect(store.getState().windows.get("projects")!.position.x).toBe(800 - 100);
    expect(store.getState().restored).toBe(true);
  });

  it("opens the welcome app when the restored desktop is empty", () => {
    const { store } = freshStore();
    store.getState().setViewport({ width: 1440, height: 900 });
    store.getState().restoreSession([], "cover-letter", { width: 300, height: 200 });
    expect(store.getState().windowOrder).toEqual(["cover-letter"]);
  });

  it("is idempotent — a second call is a no-op (StrictMode double-mount)", () => {
    const { store } = freshStore();
    store.getState().setViewport({ width: 1440, height: 900 });
    store.getState().restoreSession([], "cover-letter");
    store.getState().restoreSession([], "cover-letter");
    expect(store.getState().windowOrder).toEqual(["cover-letter"]);
  });
});

describe("window-store — facade surface", () => {
  // The useWindowManager facade (and its consumers) rely on these by name; tsc
  // enforces the wiring, this guards the store side from silently dropping one.
  const FACADE_ACTIONS = [
    "openWindow",
    "closeWindow",
    "minimizeWindow",
    "maximizeWindow",
    "restoreWindow",
    "bringToFront",
    "updatePosition",
    "updateSize",
    "isWindowOpen",
  ] as const;

  it("exposes every action the facade maps", () => {
    const { store } = freshStore();
    const state = store.getState();
    for (const key of FACADE_ACTIONS) {
      expect(typeof state[key]).toBe("function");
    }
  });
});

describe("window-store — rehydrate edge cases", () => {
  it("repairs a structurally-valid but desynced blob via merge (window missing from order)", async () => {
    const name = `test:windows:desync:${(counter += 1)}`;
    window.localStorage.setItem(
      name,
      JSON.stringify({
        state: { windows: [mkWin("a"), mkWin("b")], windowOrder: ["a"] },
        version: PERSIST_VERSION,
      }),
    );
    const { store } = createWindowStore({ name });
    await store.persist.rehydrate();

    expect(store.getState().windowOrder).toEqual(["a"]);
    expect(store.getState().windows.size).toBe(1);
    expect(store.getState().windows.has("a")).toBe(true);
  });

  it("preserves a non-initial stack order through reload, and reconcile keeps it", async () => {
    const name = `test:windows:order:${(counter += 1)}`;
    const a = createWindowStore({ name });
    a.store.getState().setViewport({ width: 1440, height: 900 });
    a.store.getState().openWindow("cover-letter");
    a.store.getState().openWindow("projects");
    a.store.getState().openWindow("experience");
    a.store.getState().bringToFront("cover-letter"); // -> [projects, experience, cover-letter]
    a.storage.flush();

    const b = createWindowStore({ name });
    await b.store.persist.rehydrate();
    expect(b.store.getState().windowOrder).toEqual([
      "projects",
      "experience",
      "cover-letter",
    ]);

    // validIds in DECLARATION order must not resort the survivors.
    b.store.getState().reconcile(["cover-letter", "projects", "experience"]);
    expect(b.store.getState().windowOrder).toEqual([
      "projects",
      "experience",
      "cover-letter",
    ]);
  });
});

describe("window-store — flushWindowStorage (singleton unload path)", () => {
  it("forces the singleton's pending debounced write out synchronously", () => {
    window.localStorage.removeItem(PERSIST_NAME);
    useWindowStore.setState({
      windows: new Map(),
      windowOrder: [],
      viewport: { width: 1440, height: 900 },
    });

    useWindowStore.getState().openWindow("flush-probe", { width: 300, height: 200 });
    // The persist write is debounced; without a flush nothing is on disk yet.
    flushWindowStorage();

    const raw = window.localStorage.getItem(PERSIST_NAME);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).state.windowOrder).toContain("flush-probe");

    // Clean up the singleton so later suites start fresh.
    useWindowStore.getState().closeWindow("flush-probe");
    flushWindowStorage();
  });
});

describe("window-store — persistence boundary", () => {
  it("persists exactly { windows, windowOrder } (no viewport / hasHydrated)", () => {
    const { store, storage } = freshStore();
    store.getState().setViewport({ width: 1440, height: 900 });
    store.getState().openWindow("a", { width: 300, height: 200 });
    storage.flush();

    const key = Object.keys(localStorage).find((k) => k.startsWith("test:windows:"))!;
    const raw = JSON.parse(window.localStorage.getItem(key)!);
    expect(Object.keys(raw.state).sort()).toEqual(["windowOrder", "windows"]);
    expect(raw.version).toBe(PERSIST_VERSION);
    expect(Array.isArray(raw.state.windows)).toBe(true);
  });

  it("skips hydration until rehydrate() is called", () => {
    const { store } = freshStore();
    // Fresh store with skipHydration starts empty even if storage has data
    expect(store.getState().windowOrder).toEqual([]);
    expect(store.getState().hasHydrated).toBe(false);
  });

  it("rehydrate() restores windows, order, and position; sets hasHydrated", async () => {
    const name = `test:windows:rh:${(counter += 1)}`;
    const a = createWindowStore({ name });
    a.store.getState().setViewport({ width: 1440, height: 900 });
    a.store.getState().openWindow("projects", { width: 300, height: 200 });
    a.store.getState().updatePosition("projects", { x: 250, y: 175 });
    a.storage.flush();

    const b = createWindowStore({ name });
    expect(b.store.getState().windowOrder).toEqual([]);
    await b.store.persist.rehydrate();

    expect(b.store.getState().windowOrder).toEqual(["projects"]);
    expect(b.store.getState().windows.get("projects")?.position).toEqual({
      x: 250,
      y: 175,
    });
    expect(b.store.getState().hasHydrated).toBe(true);
  });

  it("rehydrate() with a corrupt blob falls back to empty AND still sets hasHydrated", async () => {
    const name = `test:windows:corrupt:${(counter += 1)}`;
    window.localStorage.setItem(name, "}{ not valid json");
    const { store } = createWindowStore({ name });
    await store.persist.rehydrate();
    expect(store.getState().windowOrder).toEqual([]);
    expect(store.getState().hasHydrated).toBe(true);
  });

  it("rehydrate() with a stale schema version discards the blob (cover letter can reopen)", async () => {
    const name = `test:windows:ver:${(counter += 1)}`;
    window.localStorage.setItem(
      name,
      JSON.stringify({ state: { windows: [], windowOrder: ["projects"] }, version: 0 }),
    );
    const { store } = createWindowStore({ name });
    await store.persist.rehydrate();
    expect(store.getState().windowOrder).toEqual([]);
    expect(store.getState().hasHydrated).toBe(true);
  });
});
