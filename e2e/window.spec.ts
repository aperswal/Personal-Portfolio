import { test, expect } from "@playwright/test";

test.describe("Window Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Cover letter window opens on load
    await page.waitForSelector('[role="dialog"]');
  });

  test("cover letter window is open on load", async ({ page }) => {
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Dear Hiring Manager");
  });

  test("clicking dock icon opens a window", async ({ page }) => {
    // Click the Projects dock icon
    await page.click('[aria-label="Open Projects"]');
    const windows = page.locator('[role="dialog"]');
    // Should have 2 windows: cover letter + projects
    await expect(windows).toHaveCount(2);
  });

  test("clicking same dock icon twice does not duplicate the window", async ({
    page,
  }) => {
    await page.click('[aria-label="Open Projects"]');
    await page.click('[aria-label="Open Projects"]');
    // Count windows with "Projects" in aria-label
    const projectWindows = page.locator('[aria-label="Projects"]');
    await expect(projectWindows).toHaveCount(1);
  });

  test("clicking an open window brings it to front (higher z-index)", async ({
    page,
  }) => {
    // Open a second window
    await page.click('[aria-label="Open Projects"]');

    const letterWindow = page.locator('[aria-label="A Letter"]');
    const projectsWindow = page.locator('[aria-label="Projects"]');

    // Projects was opened last — should be on top
    const projectsZ = await projectsWindow.evaluate(
      (el) => parseInt(getComputedStyle(el).zIndex) || 0,
    );
    const letterZ = await letterWindow.evaluate(
      (el) => parseInt(getComputedStyle(el).zIndex) || 0,
    );
    expect(projectsZ).toBeGreaterThan(letterZ);

    // Click at the letter window's coordinates to trigger pointerdown → bringToFront
    const letterBox = await letterWindow.boundingBox();
    await page.mouse.click(letterBox!.x + 10, letterBox!.y + 25);

    const newLetterZ = await letterWindow.evaluate(
      (el) => parseInt(getComputedStyle(el).zIndex) || 0,
    );
    const newProjectsZ = await projectsWindow.evaluate(
      (el) => parseInt(getComputedStyle(el).zIndex) || 0,
    );
    expect(newLetterZ).toBeGreaterThan(newProjectsZ);
  });

  test("red button closes the window", async ({ page }) => {
    const dialog = page.locator('[aria-label="A Letter"]');
    await expect(dialog).toBeVisible();

    await page.click('[aria-label="Close A Letter"]');
    await expect(dialog).not.toBeVisible();
  });

  test("yellow button minimizes the window (disappears from view)", async ({ page }) => {
    const dialog = page.locator('[aria-label="A Letter"]');
    await expect(dialog).toBeVisible();

    await page.click('[aria-label="Minimize A Letter"]');
    await expect(dialog).not.toBeVisible();
  });

  test("minimized window appears in dock tray and can be restored", async ({ page }) => {
    await page.click('[aria-label="Minimize A Letter"]');
    const dialog = page.locator('[aria-label="A Letter"]');
    await expect(dialog).not.toBeVisible();

    // Minimized window should show in the dock tray
    const restoreButton = page.locator('[aria-label="Restore A Letter"]');
    await expect(restoreButton).toBeVisible();

    // Click to restore
    await restoreButton.click();
    await expect(dialog).toBeVisible();
  });

  test("green button maximizes the window to cover the full viewport", async ({
    page,
  }) => {
    await page.click('[aria-label="Maximize A Letter"]');
    const dialog = page.locator('[aria-label="A Letter"]');

    // Window should cover the full viewport
    const box = await dialog.boundingBox();
    const viewport = page.viewportSize()!;
    expect(box!.x).toBe(0);
    expect(box!.y).toBe(0);
    expect(box!.width).toBe(viewport.width);
    expect(box!.height).toBe(viewport.height);
  });

  test("maximized window hides the dock", async ({ page }) => {
    const dock = page.locator('[aria-label="Application dock"]');
    await expect(dock).toBeVisible();

    await page.click('[aria-label="Maximize A Letter"]');
    await expect(dock).not.toBeVisible();
  });

  test("clicking green on maximized window restores to original size", async ({
    page,
  }) => {
    const dialog = page.locator('[aria-label="A Letter"]');
    const boxBefore = await dialog.boundingBox();

    await page.click('[aria-label="Maximize A Letter"]');
    // Now it's maximized — click green again to restore
    await page.click('[aria-label="Restore A Letter"]');

    const boxAfter = await dialog.boundingBox();
    // Should be back to original size, not full viewport
    expect(boxAfter!.width).toBe(boxBefore!.width);
    expect(boxAfter!.height).toBe(boxBefore!.height);
  });

  test("minimize works directly from maximized state", async ({ page }) => {
    await page.click('[aria-label="Maximize A Letter"]');
    const dialog = page.locator('[aria-label="A Letter"]');
    await expect(dialog).toBeVisible();

    await page.click('[aria-label="Minimize A Letter"]');
    await expect(dialog).not.toBeVisible();

    // Dock should reappear since no maximized window is visible
    const dock = page.locator('[aria-label="Application dock"]');
    await expect(dock).toBeVisible();
  });

  test("window can be resized by dragging the south-east corner", async ({ page }) => {
    const dialog = page.locator('[aria-label="A Letter"]');
    const boxBefore = await dialog.boundingBox();

    // Drag the bottom-right corner 100px right and 50px down
    const startX = boxBefore!.x + boxBefore!.width - 2;
    const startY = boxBefore!.y + boxBefore!.height - 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 50, { steps: 5 });
    await page.mouse.up();

    const boxAfter = await dialog.boundingBox();
    expect(boxAfter!.width).toBeGreaterThan(boxBefore!.width + 50);
    expect(boxAfter!.height).toBeGreaterThan(boxBefore!.height + 20);
  });

  test("window cannot be resized below minimum size", async ({ page }) => {
    const dialog = page.locator('[aria-label="A Letter"]');
    const boxBefore = await dialog.boundingBox();

    // Try to shrink from bottom-right corner by a lot
    const startX = boxBefore!.x + boxBefore!.width - 2;
    const startY = boxBefore!.y + boxBefore!.height - 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - 1000, startY - 1000, { steps: 5 });
    await page.mouse.up();

    const boxAfter = await dialog.boundingBox();
    // Should not go below 320x200 minimum
    expect(boxAfter!.width).toBeGreaterThanOrEqual(320);
    expect(boxAfter!.height).toBeGreaterThanOrEqual(200);
  });
});
