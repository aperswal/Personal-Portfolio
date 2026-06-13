"use client";

import { useSyncExternalStore } from "react";

/**
 * Matches a small-screen, touch-primary device (a phone in EITHER orientation,
 * or a small touch tablet) — the devices that should get the iOS-style mobile
 * shell instead of the desktop. Orientation is intentionally NOT constrained so
 * a phone held in landscape still gets the mobile shell. `pointer: coarse`
 * excludes laptops/desktops (whose primary pointer is fine, even touchscreens).
 */
export const MOBILE_DEVICE_QUERY = "(max-width: 1023px) and (pointer: coarse)";

interface MobileDeviceStore {
  subscribe(onChange: () => void): () => void;
  getSnapshot(): boolean;
  getServerSnapshot(): boolean;
}

/**
 * A useSyncExternalStore-compatible store backed by window.matchMedia.
 *
 * getServerSnapshot always returns false so the server and the first client
 * paint always render the Desktop shell, avoiding hydration mismatches; the
 * real device decision arrives on the post-mount client snapshot.
 */
export function createMobileDeviceStore(): MobileDeviceStore {
  function getMediaQueryList(): MediaQueryList | null {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return null;
    }
    return window.matchMedia(MOBILE_DEVICE_QUERY);
  }

  return {
    subscribe(onChange: () => void): () => void {
      const mql = getMediaQueryList();
      if (!mql) return () => {};
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    getSnapshot(): boolean {
      return getMediaQueryList()?.matches ?? false;
    },
    getServerSnapshot(): boolean {
      return false;
    },
  };
}

const store = createMobileDeviceStore();

export function useIsMobileDevice(): boolean {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}
