import { test, expect } from '@playwright/test';

test.describe('Forensic Explorer', () => {
  test('loads explorer page', async ({ page }) => {
    await page.goto('/explorer');
    await expect(page).toHaveTitle(/Explorer/i);
    await expect(page.getByRole('heading', { name: 'Forensic Explorer' })).toBeVisible();
  });

  test('search input is present', async ({ page }) => {
    await page.goto('/explorer');
    await expect(page.getByPlaceholder(/Search by agent/i)).toBeVisible();
  });

  test('attestation table renders with mock data', async ({ page }) => {
    await page.goto('/explorer');
    await expect(page.getByText('Recent Attestations')).toBeVisible();
    await expect(page.getByText('Transaction').first()).toBeVisible();
  });
});
