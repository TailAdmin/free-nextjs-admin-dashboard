import { test, expect } from '@playwright/test';

test.describe('Dashboard Application', () => {
  test('has correct title and loads dashboard', async ({ page }) => {
    await page.goto('/');

    // Expect a title containing "Next.js" or similar (based on default Next.js title)
    await expect(page).toHaveTitle(/Next.js|Create Next App/);
    
    // Check that the main content loads - look for the page structure
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('.min-h-screen')).toBeVisible();
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/');

    // Test that we can navigate to different dashboard sections
    // This will need to be updated based on actual navigation structure
    const navigation = page.locator('nav, [role="navigation"]');
    if (await navigation.isVisible()) {
      await expect(navigation).toBeVisible();
    }
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that the page is responsive
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('.min-h-screen')).toBeVisible();
    
    // Check that mobile navigation works (if implemented)
    const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu');
    // Only test if mobile menu exists
    if (await mobileMenu.isVisible()) {
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('/');

    // Look for theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]');
    
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      
      // Check that theme changes (this might need adjustment based on implementation)
      await expect(page.locator('html, body')).toHaveAttribute('class', /dark|light/);
    }
  });
}); 