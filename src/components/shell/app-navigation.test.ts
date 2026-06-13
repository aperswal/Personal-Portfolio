import { describe, it, expect, vi } from "vitest";
import {
  createDesktopAppNavigation,
  createMobileAppNavigation,
  type MobileNavigationDeps,
} from "./app-navigation";
import { appMeta, APP_IDS } from "@/data/apps";
import type { WindowManagerApi } from "@/components/desktop/window-manager";

/**
 * Builds a fake WindowManagerApi whose every action is a vi.fn(), so we can
 * assert the desktop backend forwards each AppNavigation call to the right
 * window-store action with the right arguments — without rendering anything.
 */
function fakeWindowManager(): WindowManagerApi {
  return {
    state: { windows: new Map(), windowOrder: [] },
    openWindow: vi.fn(),
    closeWindow: vi.fn(),
    minimizeWindow: vi.fn(),
    maximizeWindow: vi.fn(),
    restoreWindow: vi.fn(),
    bringToFront: vi.fn(),
    updatePosition: vi.fn(),
    updateSize: vi.fn(),
    isWindowOpen: vi.fn(() => false),
  };
}

describe("createDesktopAppNavigation — maps onto the window-manager facade", () => {
  it("openApp opens a window using the registry defaultSize for a visible app", () => {
    const api = fakeWindowManager();
    const nav = createDesktopAppNavigation(api);

    nav.openApp(APP_IDS.PROJECTS);

    expect(api.openWindow).toHaveBeenCalledWith(
      APP_IDS.PROJECTS,
      appMeta[APP_IDS.PROJECTS].defaultSize,
    );
    // Guard the literal so a registry drift is caught here, not in prod.
    expect(appMeta[APP_IDS.PROJECTS].defaultSize).toEqual({
      width: 800,
      height: 560,
    });
  });

  it("openApp resolves a defaultSize for a hidden app too", () => {
    const api = fakeWindowManager();
    const nav = createDesktopAppNavigation(api);

    nav.openApp(APP_IDS.MOVIES);

    expect(api.openWindow).toHaveBeenCalledWith(
      APP_IDS.MOVIES,
      appMeta[APP_IDS.MOVIES].defaultSize,
    );
    expect(appMeta[APP_IDS.MOVIES].defaultSize).toEqual({
      width: 800,
      height: 560,
    });
  });

  it("closeApp(id) closes that window", () => {
    const api = fakeWindowManager();
    const nav = createDesktopAppNavigation(api);

    nav.closeApp(APP_IDS.PROJECTS);

    expect(api.closeWindow).toHaveBeenCalledWith(APP_IDS.PROJECTS);
  });

  it("closeApp() with no id is a no-op", () => {
    const api = fakeWindowManager();
    const nav = createDesktopAppNavigation(api);

    nav.closeApp();

    expect(api.closeWindow).not.toHaveBeenCalled();
  });

  it("focusApp brings the window to the front", () => {
    const api = fakeWindowManager();
    const nav = createDesktopAppNavigation(api);

    nav.focusApp(APP_IDS.PROJECTS);

    expect(api.bringToFront).toHaveBeenCalledWith(APP_IDS.PROJECTS);
  });

  it("isAppOpen passes through to isWindowOpen", () => {
    const api = fakeWindowManager();
    vi.mocked(api.isWindowOpen).mockReturnValue(true);
    const nav = createDesktopAppNavigation(api);

    expect(nav.isAppOpen(APP_IDS.PROJECTS)).toBe(true);
    expect(api.isWindowOpen).toHaveBeenCalledWith(APP_IDS.PROJECTS);
  });
});

/**
 * Builds fake mobile deps so we can assert the URL-driven backend forwards each
 * AppNavigation call to pushApp/clear and reads activeAppId — without rendering.
 */
function fakeMobileDeps(
  overrides: Partial<MobileNavigationDeps> = {},
): MobileNavigationDeps {
  return {
    activeAppId: null,
    pushApp: vi.fn(),
    clear: vi.fn(),
    ...overrides,
  };
}

describe("createMobileAppNavigation — URL-driven backend", () => {
  it("openApp pushes the app id", () => {
    const deps = fakeMobileDeps();
    createMobileAppNavigation(deps).openApp(APP_IDS.PROJECTS);
    expect(deps.pushApp).toHaveBeenCalledWith(APP_IDS.PROJECTS);
  });

  it("focusApp also pushes the app id (no separate focus on mobile)", () => {
    const deps = fakeMobileDeps();
    createMobileAppNavigation(deps).focusApp(APP_IDS.MOVIES);
    expect(deps.pushApp).toHaveBeenCalledWith(APP_IDS.MOVIES);
  });

  it("closeApp clears back to the home grid", () => {
    const deps = fakeMobileDeps();
    createMobileAppNavigation(deps).closeApp();
    expect(deps.clear).toHaveBeenCalledTimes(1);
    expect(deps.pushApp).not.toHaveBeenCalled();
  });

  it("isAppOpen reflects the active app id", () => {
    const nav = createMobileAppNavigation(
      fakeMobileDeps({ activeAppId: APP_IDS.PROJECTS }),
    );
    expect(nav.isAppOpen(APP_IDS.PROJECTS)).toBe(true);
    expect(nav.isAppOpen(APP_IDS.CONTACT)).toBe(false);
  });

  it("isAppOpen is false for every app when none is active", () => {
    const nav = createMobileAppNavigation(fakeMobileDeps({ activeAppId: null }));
    expect(nav.isAppOpen(APP_IDS.PROJECTS)).toBe(false);
  });
});
