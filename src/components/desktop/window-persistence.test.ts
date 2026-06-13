import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  sanitizePersisted,
  serializeWindows,
  createWindowStorage,
  type PersistedWindows,
} from "./window-persistence";
import type { StorageValue } from "zustand/middleware";
import type { WindowState } from "./types";

function mkWin(id: string, overrides: Partial<WindowState> = {}): WindowState {
  return {
    id,
    isMinimized: false,
    isMaximized: false,
    position: { x: 100, y: 120 },
    size: { width: 600, height: 400 },
    preMaximize: null,
    ...overrides,
  };
}

describe("serialize / sanitize round-trip", () => {
  it("round-trips a windows Map (2+ entries, null and non-null preMaximize)", () => {
    const a = mkWin("a");
    const b = mkWin("b", {
      isMaximized: true,
      preMaximize: { position: { x: 5, y: 6 }, size: { width: 700, height: 500 } },
    });
    const map = new Map([
      ["a", a],
      ["b", b],
    ]);

    const arr = serializeWindows(map);
    const json = JSON.parse(JSON.stringify({ windows: arr, windowOrder: ["a", "b"] }));
    const restored = sanitizePersisted(json);

    expect(restored).not.toBeNull();
    expect(restored!.windows).toBeInstanceOf(Map);
    expect(restored!.windowOrder).toEqual(["a", "b"]);
    expect(restored!.windows.get("a")).toEqual(a);
    expect(restored!.windows.get("b")).toEqual(b);
    expect(restored!.windows.get("b")?.preMaximize).toEqual({
      position: { x: 5, y: 6 },
      size: { width: 700, height: 500 },
    });
  });
});

describe("sanitizePersisted — fail closed on invalid input", () => {
  const order = ["a"];

  it("returns null when windows is not an array", () => {
    expect(
      sanitizePersisted({ windows: { a: mkWin("a") }, windowOrder: order }),
    ).toBeNull();
  });

  it("returns null for a zero / negative window size", () => {
    expect(
      sanitizePersisted({
        windows: [mkWin("a", { size: { width: 0, height: 400 } })],
        windowOrder: order,
      }),
    ).toBeNull();
    expect(
      sanitizePersisted({
        windows: [mkWin("a", { size: { width: -5, height: 400 } })],
        windowOrder: order,
      }),
    ).toBeNull();
  });

  it("returns null for an oversized window size", () => {
    expect(
      sanitizePersisted({
        windows: [mkWin("a", { size: { width: 1e9, height: 400 } })],
        windowOrder: order,
      }),
    ).toBeNull();
  });

  it("returns null for a non-finite position", () => {
    expect(
      sanitizePersisted({
        windows: [mkWin("a", { position: { x: Number.NaN, y: 0 } })],
        windowOrder: order,
      }),
    ).toBeNull();
  });

  it("returns null for a malformed / missing field", () => {
    expect(sanitizePersisted({ windows: [{ id: "a" }], windowOrder: order })).toBeNull();
    expect(sanitizePersisted(null)).toBeNull();
    expect(sanitizePersisted("garbage")).toBeNull();
    expect(sanitizePersisted({})).toBeNull();
  });

  it("rejects an over-long windows array (DoS guard)", () => {
    const windows = Array.from({ length: 65 }, (_, i) => mkWin(`w${i}`));
    const windowOrder = windows.map((w) => w.id);
    expect(sanitizePersisted({ windows, windowOrder })).toBeNull();
  });
});

describe("sanitizePersisted — normalizes windows <-> order consistency", () => {
  it("drops an order id that has no matching window", () => {
    const restored = sanitizePersisted({
      windows: [mkWin("a")],
      windowOrder: ["a", "ghost"],
    });
    expect(restored!.windowOrder).toEqual(["a"]);
    expect([...restored!.windows.keys()]).toEqual(["a"]);
  });

  it("drops a window that is missing from the order (invisible window)", () => {
    const restored = sanitizePersisted({
      windows: [mkWin("a"), mkWin("b")],
      windowOrder: ["a"],
    });
    expect([...restored!.windows.keys()]).toEqual(["a"]);
    expect(restored!.windowOrder).toEqual(["a"]);
  });

  it("dedupes a repeated order id", () => {
    const restored = sanitizePersisted({
      windows: [mkWin("a")],
      windowOrder: ["a", "a"],
    });
    expect(restored!.windowOrder).toEqual(["a"]);
  });
});

describe("createWindowStorage — debounced, flushable, crash-proof", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const envelope = (windowOrder: string[]): StorageValue<PersistedWindows> => ({
    state: { windows: [], windowOrder },
    version: 1,
  });

  it("debounces writes — nothing lands until the timer fires", () => {
    const s = createWindowStorage(200);
    s.setItem("k", envelope(["a"]));
    expect(window.localStorage.getItem("k")).toBeNull();
    vi.advanceTimersByTime(200);
    expect(window.localStorage.getItem("k")).not.toBeNull();
  });

  it("coalesces rapid writes into the latest value", () => {
    const s = createWindowStorage(200);
    s.setItem("k", envelope(["a"]));
    s.setItem("k", envelope(["b"]));
    s.setItem("k", envelope(["c"]));
    vi.advanceTimersByTime(200);
    expect(JSON.parse(window.localStorage.getItem("k")!).state.windowOrder).toEqual([
      "c",
    ]);
  });

  it("flush() writes the pending value synchronously WITHOUT advancing timers", () => {
    const s = createWindowStorage(200);
    s.setItem("k", envelope(["final"]));
    s.flush();
    // no timer advance — proves the unload-safety path
    expect(JSON.parse(window.localStorage.getItem("k")!).state.windowOrder).toEqual([
      "final",
    ]);
  });

  it("skips an identical consecutive write (dedupe)", () => {
    const s = createWindowStorage(200);
    const spy = vi.spyOn(window.localStorage, "setItem");
    s.setItem("k", envelope(["a"]));
    s.flush();
    s.setItem("k", envelope(["a"])); // byte-identical payload (e.g. a viewport-only change)
    s.flush();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("getItem round-trips the {state, version} envelope", () => {
    const s = createWindowStorage(200);
    s.setItem("k", envelope(["a", "b"]));
    s.flush();
    const got = s.getItem("k") as StorageValue<PersistedWindows> | null;
    expect(got?.version).toBe(1);
    expect(got?.state.windowOrder).toEqual(["a", "b"]);
  });

  it("getItem returns null (not throw) for corrupt JSON in storage", () => {
    window.localStorage.setItem("k", "}{ not json");
    const s = createWindowStorage(200);
    expect(() => s.getItem("k")).not.toThrow();
    expect(s.getItem("k")).toBeNull();
  });

  it("getItem returns null (never throws) when storage access throws", () => {
    const s = createWindowStorage(200);
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("SecurityError: storage disabled");
    });
    expect(() => s.getItem("k")).not.toThrow();
    expect(s.getItem("k")).toBeNull();
  });

  it("setItem/flush swallow a throwing storage (quota / private mode)", () => {
    const s = createWindowStorage(200);
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    s.setItem("k", envelope(["a"]));
    expect(() => s.flush()).not.toThrow();
  });
});
