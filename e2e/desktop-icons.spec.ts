import { test, expect, type Page } from "@playwright/test";

/** Desktop icon (button) for an app, matched by its bare title aria-label. */
function icon(page: Page, title: string) {
  return page.locator(`button[aria-label="${title}"]`);
}

/** Open window (dialog) for an app, scoped so the desktop icon never matches. */
function dialog(page: Page, title: string) {
  return page.locator(`[role="dialog"][aria-label="${title}"]`);
}

async function clickEmptyBackground(page: Page) {
  // Top-left corner is bare wallpaper: no icons (they live on the right), no
  // window there once Projects is closed, and clear of the centered dock.
  await page.mouse.click(8, 8);
}

test.describe("Desktop icon selection and open", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    // The cover-letter window opens on load; close it so the bare desktop is
    // the starting point for every selection test.
    await page.waitForSelector('[role="dialog"][aria-label="A Letter"]');
    await page.click('[aria-label="Close A Letter"]');
    await expect(dialog(page, "A Letter")).toHaveCount(0);
  });

  test("single click selects an icon and opens no window", async ({ page }) => {
    await icon(page, "Projects").click();

    await expect(icon(page, "Projects")).toHaveAttribute("aria-pressed", "true");
    await expect(dialog(page, "Projects")).toHaveCount(0);
  });

  test("double click opens the app and clears the selection", async ({ page }) => {
    await icon(page, "Projects").dblclick();

    await expect(dialog(page, "Projects")).toBeVisible();
    await expect(icon(page, "Projects")).toHaveAttribute("aria-pressed", "false");
  });

  test("clicking the empty desktop background deselects", async ({ page }) => {
    await icon(page, "Projects").click();
    await expect(icon(page, "Projects")).toHaveAttribute("aria-pressed", "true");

    await clickEmptyBackground(page);
    await expect(icon(page, "Projects")).toHaveAttribute("aria-pressed", "false");
  });

  test("clicking a second icon moves the single highlight", async ({ page }) => {
    await icon(page, "Projects").click();
    await expect(icon(page, "Projects")).toHaveAttribute("aria-pressed", "true");

    await icon(page, "Experience").click();

    await expect(icon(page, "Experience")).toHaveAttribute("aria-pressed", "true");
    await expect(icon(page, "Projects")).toHaveAttribute("aria-pressed", "false");
    // Exactly one icon is highlighted at a time.
    await expect(page.locator('button[aria-pressed="true"]')).toHaveCount(1);
  });

  test("keyboard: Enter opens the selected icon, Escape deselects", async ({ page }) => {
    const projects = icon(page, "Projects");
    await projects.click();
    await expect(projects).toHaveAttribute("aria-pressed", "true");

    await projects.focus();
    await projects.press("Enter");
    await expect(dialog(page, "Projects")).toBeVisible();
    await expect(projects).toHaveAttribute("aria-pressed", "false");

    // Re-select, then Escape clears it.
    await projects.click();
    await expect(projects).toHaveAttribute("aria-pressed", "true");
    await projects.press("Escape");
    await expect(projects).toHaveAttribute("aria-pressed", "false");
  });

  test("keyboard: Space opens the focused icon (native button contract)", async ({
    page,
  }) => {
    const projects = icon(page, "Projects");
    await projects.focus();
    await projects.press("Space");
    await expect(dialog(page, "Projects")).toBeVisible();
  });

  test("dragging an icon neither selects nor opens it", async ({ page }) => {
    const projects = icon(page, "Projects");
    const box = (await projects.boundingBox())!;
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    // Move well past the 4px drag threshold.
    await page.mouse.move(startX - 60, startY + 40, { steps: 6 });
    await page.mouse.up();

    await expect(projects).toHaveAttribute("aria-pressed", "false");
    await expect(dialog(page, "Projects")).toHaveCount(0);
  });
});
