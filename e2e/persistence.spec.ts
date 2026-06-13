import { test, expect, type Page } from "@playwright/test";

/** Debounce is 200ms; wait past it so the write lands before we reload. */
const PERSIST_WAIT = 350;

async function freshLoad(page: Page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('[aria-label="A Letter"]');
}

function zIndexOf(page: Page, label: string) {
  return page
    .locator(`[aria-label="${label}"]`)
    .evaluate((el) => parseInt(getComputedStyle(el).zIndex) || 0);
}

test.describe("Window persistence across reload", () => {
  test.beforeEach(async ({ page }) => {
    await freshLoad(page);
  });

  test("restores the same windows, stack order, and position after reload", async ({
    page,
  }) => {
    // Open Projects as a second window (now topmost).
    await page.click('[aria-label="Open Projects"]');
    const projects = page.locator('[aria-label="Projects"]');
    await expect(projects).toBeVisible();

    // Drag it by the title bar to a known offset.
    const header = projects.locator("header");
    const hb = (await header.boundingBox())!;
    await page.mouse.move(hb.x + 50, hb.y + 5);
    await page.mouse.down();
    await page.mouse.move(hb.x + 50 + 90, hb.y + 5 + 70, { steps: 6 });
    await page.mouse.up();

    const before = (await projects.boundingBox())!;

    await page.waitForTimeout(PERSIST_WAIT);
    await page.reload();
    await page.waitForSelector('[aria-label="Projects"]');

    // Both windows came back.
    await expect(page.locator('[aria-label="A Letter"]')).toBeVisible();
    await expect(page.locator('[aria-label="Projects"]')).toBeVisible();

    // Position preserved.
    const after = (await page.locator('[aria-label="Projects"]').boundingBox())!;
    expect(Math.abs(after.x - before.x)).toBeLessThan(4);
    expect(Math.abs(after.y - before.y)).toBeLessThan(4);

    // Stack order preserved: Projects opened last, so it stays on top.
    expect(await zIndexOf(page, "Projects")).toBeGreaterThan(
      await zIndexOf(page, "A Letter"),
    );
  });

  test("closing every window reopens the cover letter after reload", async ({ page }) => {
    await page.click('[aria-label="Close A Letter"]');
    await expect(page.locator('[aria-label="A Letter"]')).toHaveCount(0);

    await page.waitForTimeout(PERSIST_WAIT);
    await page.reload();

    // Product decision: an empty desktop re-welcomes with the cover letter.
    await expect(page.locator('[aria-label="A Letter"]')).toBeVisible();
  });

  test("a minimized window returns to the dock tray, not as a dialog", async ({
    page,
  }) => {
    await page.click('[aria-label="Minimize A Letter"]');
    await expect(page.locator('[aria-label="A Letter"]')).toHaveCount(0);

    await page.waitForTimeout(PERSIST_WAIT);
    await page.reload();

    // Minimized flag survived: dialog hidden, restore button present, no re-welcome.
    await expect(page.locator('[aria-label="Restore A Letter"]')).toBeVisible();
    await expect(page.locator('[aria-label="A Letter"]')).toHaveCount(0);
  });

  test("a maximized window restores as a normal window with the dock visible", async ({
    page,
  }) => {
    await page.click('[aria-label="Maximize A Letter"]');
    await expect(page.locator('[aria-label="Application dock"]')).toHaveCount(0);

    await page.waitForTimeout(PERSIST_WAIT);
    await page.reload();
    await page.waitForSelector('[aria-label="A Letter"]');

    // Restored un-maximized: dock visible, window no longer fills the viewport.
    await expect(page.locator('[aria-label="Application dock"]')).toBeVisible();
    const box = (await page.locator('[aria-label="A Letter"]').boundingBox())!;
    const vp = page.viewportSize()!;
    expect(box.width).toBeLessThan(vp.width);
  });

  test("pristine visit opens the cover letter with no hydration error", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('[aria-label="A Letter"]');

    await expect(page.locator('[aria-label="A Letter"]')).toBeVisible();
    const hydrationErrors = errors.filter((e) =>
      /hydrat|did not match|server.*client|text content does not match/i.test(e),
    );
    expect(hydrationErrors).toEqual([]);
  });

  test("hide flush persists the final drag even when reloaded before the debounce", async ({
    page,
  }) => {
    await page.click('[aria-label="Open Projects"]');
    const projects = page.locator('[aria-label="Projects"]');
    const header = projects.locator("header");
    const hb = (await header.boundingBox())!;
    await page.mouse.move(hb.x + 50, hb.y + 5);
    await page.mouse.down();
    await page.mouse.move(hb.x + 50 + 70, hb.y + 5 + 55, { steps: 5 });
    await page.mouse.up();

    const before = (await projects.boundingBox())!;

    // Do NOT wait past the 200ms debounce. Fire the tab-hidden path, which must
    // flush the pending write synchronously, then reload immediately.
    await page.evaluate(() => {
      window.dispatchEvent(new Event("pagehide"));
    });
    await page.reload();
    await page.waitForSelector('[aria-label="Projects"]');

    const after = (await page.locator('[aria-label="Projects"]').boundingBox())!;
    expect(Math.abs(after.x - before.x)).toBeLessThan(4);
    expect(Math.abs(after.y - before.y)).toBeLessThan(4);
  });
});
