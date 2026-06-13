import { describe, it, expect, vi, afterEach } from "vitest";
import { MOBILE_DEVICE_QUERY, createMobileDeviceStore } from "./use-is-mobile-device";

interface MatchMediaMock {
  matches: boolean;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
}

function mockMatchMedia(matches: boolean): MatchMediaMock {
  const mql: MatchMediaMock = {
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => mql),
  );
  return mql;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createMobileDeviceStore", () => {
  it("getServerSnapshot() always returns false", () => {
    mockMatchMedia(true);
    expect(createMobileDeviceStore().getServerSnapshot()).toBe(false);
  });

  it("getSnapshot() returns true when the media query matches", () => {
    mockMatchMedia(true);
    expect(createMobileDeviceStore().getSnapshot()).toBe(true);
  });

  it("getSnapshot() returns false when the media query does not match", () => {
    mockMatchMedia(false);
    expect(createMobileDeviceStore().getSnapshot()).toBe(false);
  });

  it("subscribe registers a change listener", () => {
    const mql = mockMatchMedia(false);
    createMobileDeviceStore().subscribe(() => {});
    expect(mql.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("the returned unsubscribe removes the listener", () => {
    const mql = mockMatchMedia(false);
    const unsubscribe = createMobileDeviceStore().subscribe(() => {});
    expect(mql.removeEventListener).not.toHaveBeenCalled();
    unsubscribe();
    expect(mql.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("subscribe registers and unsubscribe removes the SAME listener reference", () => {
    const mql = mockMatchMedia(false);
    const unsubscribe = createMobileDeviceStore().subscribe(() => {});
    unsubscribe();
    const registered = mql.addEventListener.mock.calls[0]?.[1];
    const removed = mql.removeEventListener.mock.calls[0]?.[1];
    expect(removed).toBe(registered);
  });
});

describe("MOBILE_DEVICE_QUERY", () => {
  it("targets a small viewport and a coarse pointer", () => {
    expect(MOBILE_DEVICE_QUERY).toContain("max-width");
    expect(MOBILE_DEVICE_QUERY).toContain("pointer: coarse");
  });

  it("does NOT constrain orientation, so a phone in landscape still matches", () => {
    expect(MOBILE_DEVICE_QUERY).not.toContain("orientation");
  });

  it("uses no user-agent token (feature queries only)", () => {
    expect(MOBILE_DEVICE_QUERY.toLowerCase()).not.toContain("user-agent");
  });
});
