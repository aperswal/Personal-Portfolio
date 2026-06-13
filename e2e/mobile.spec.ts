import { test, expect, type Page } from "@playwright/test";

// Portrait phone emulation. The device gate requires (max-width:1023px) and
// (pointer:coarse) — orientation-agnostic — so a touch-capable mobile viewport
// satisfies it and RootShell switches to the iOS shell after mount.
test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  deviceScaleFactor: 3,
});

async function freshMobileLoad(page: Page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('[aria-label="Open Projects"]');
}

test.describe("Mobile iOS shell", () => {
  test("renders the home grid and status bar, with no desktop window", async ({
    page,
  }) => {
    await freshMobileLoad(page);

    await expect(page.locator('[aria-label="Status bar"]')).toBeVisible();
    await expect(page.locator('[aria-label="Open Projects"]')).toBeVisible();
    // The desktop window chrome must never appear on the phone shell.
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  });

  test("tapping an app icon opens it full-screen and writes ?app= to the URL", async ({
    page,
  }) => {
    await freshMobileLoad(page);

    await page.click('[aria-label="Open Projects"]');

    await expect(page).toHaveURL(/\?app=projects/);
    await expect(page.locator('[aria-label="Back to home"]')).toBeVisible();
    // The grid is gone once an app is open.
    await expect(page.locator('[aria-label="Open Projects"]')).toHaveCount(0);
  });

  test("the back affordance returns to the grid and clears ?app=", async ({ page }) => {
    await freshMobileLoad(page);

    await page.click('[aria-label="Open Projects"]');
    await expect(page).toHaveURL(/\?app=projects/);

    await page.click('[aria-label="Back to home"]');

    await expect(page).not.toHaveURL(/\?app=/);
    await expect(page.locator('[aria-label="Open Projects"]')).toBeVisible();
  });

  test("moves focus into the app on open and back to the icon on close", async ({
    page,
  }) => {
    await freshMobileLoad(page);

    await page.click('[aria-label="Open Projects"]');
    await expect(page.locator('[aria-label="Back to home"]')).toBeFocused();

    await page.click('[aria-label="Back to home"]');
    await expect(page.locator('[aria-label="Open Projects"]')).toBeFocused();
  });

  test("deep-linking /?app=projects opens Projects full-screen directly", async ({
    page,
  }) => {
    await page.goto("/?app=projects");

    await expect(page.locator('[aria-label="Back to home"]')).toBeVisible();
    await expect(page.locator('[aria-label="Open Projects"]')).toHaveCount(0);
  });

  test("reloading while an app is open keeps that app open", async ({ page }) => {
    await freshMobileLoad(page);

    await page.click('[aria-label="Open Projects"]');
    await expect(page).toHaveURL(/\?app=projects/);

    await page.reload();

    await expect(page).toHaveURL(/\?app=projects/);
    await expect(page.locator('[aria-label="Back to home"]')).toBeVisible();
  });

  test("the browser Back button after opening an app returns to the grid", async ({
    page,
  }) => {
    await freshMobileLoad(page);

    await page.click('[aria-label="Open Projects"]');
    await expect(page.locator('[aria-label="Back to home"]')).toBeVisible();

    await page.goBack();

    await expect(page.locator('[aria-label="Open Projects"]')).toBeVisible();
    await expect(page).not.toHaveURL(/\?app=/);
  });

  test("loads the mobile shell with no hydration or console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await page.waitForSelector('[aria-label="Open Projects"]');

    const hydrationErrors = errors.filter((e) =>
      /hydrat|did not match|server.*client|text content does not match/i.test(e),
    );
    expect(hydrationErrors).toEqual([]);
    expect(errors).toEqual([]);
  });
});

// A phone held in LANDSCAPE must still get the iOS shell, not the desktop. The
// device gate is orientation-agnostic, so a small touch viewport in landscape
// (wide-but-short) resolves to the mobile shell.
test.describe("Mobile iOS shell (landscape phone)", () => {
  test.use({
    viewport: { width: 844, height: 390 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 3,
  });

  test("a phone in landscape still gets the mobile shell, not the desktop", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('[aria-label="Open Projects"]');

    await expect(page.locator('[aria-label="Status bar"]')).toBeVisible();
    // The desktop window chrome must never appear on the phone shell.
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  });
});
