import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads and shows hero heading', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Prova/);
    await expect(page.getByRole('heading', { name: /Cryptographic Receipts/i })).toBeVisible();
  });

  test('shows stats bar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('10K+')).toBeVisible();
  });

  test('Start Building CTA navigates to quick start', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Start Building' }).first().click();
    await expect(page).toHaveURL('/developers/quick-start');
  });

  test('Explore Attestations navigates to explorer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Explore Attestations' }).click();
    await expect(page).toHaveURL('/explorer');
  });

  test('navbar renders all main links', async ({ page }) => {
    await page.goto('/');
    for (const label of ['Product', 'Explorer', 'Developers', 'Pricing']) {
      await expect(page.getByRole('link', { name: label }).first()).toBeVisible();
    }
  });

  test('footer shows legal disclaimer', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/NOT affiliated/i)).toBeVisible();
  });
});
