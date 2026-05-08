import { test, expect } from '@playwright/test';

test.describe('Pricing page', () => {
  test('loads and shows title', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page).toHaveTitle(/Pricing/i);
    await expect(page.getByRole('heading', { name: /transparent pricing/i })).toBeVisible();
  });

  test('shows all four pricing tiers', async ({ page }) => {
    await page.goto('/pricing');
    for (const tier of ['Free', 'Builder', 'Growth', 'Enterprise']) {
      await expect(page.getByText(tier).first()).toBeVisible();
    }
  });

  test('shows x402 micropayments section', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText(/x402 micropayments/i)).toBeVisible();
  });
});
