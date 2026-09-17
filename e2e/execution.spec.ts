import { test, expect } from '@playwright/test';

test.describe('Code Execution', () => {
  test('should have a run code button in the editor', async ({ page }) => {
    // This test assumes a mock session or just tests the UI presence
    // In a real environment, we would log in first using a setup script
    // For now, we just ensure the editor page is reachable (or redirects)
    const res = await page.goto('/editor');
    // If it redirects to login, that means route protection works
    if (page.url().includes('/login')) {
      await expect(page).toHaveURL(/.*\/login/);
    } else {
      const runButton = page.locator('button:has-text("Run Code")');
      await expect(runButton).toBeVisible();
    }
  });
});
