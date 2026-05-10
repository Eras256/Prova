import { test, expect } from '@playwright/test';

test.describe('Quick Start page', () => {
  test('loads quick start page', async ({ page }) => {
    await page.goto('/developers/quick-start');
    await expect(page).toHaveTitle(/Quick Start/i);
    await expect(page.getByRole('heading', { name: 'Quick Start' })).toBeVisible();
  });

  test('shows all four steps', async ({ page }) => {
    await page.goto('/developers/quick-start');
    for (const step of ['Install the SDK', 'Initialize the client', 'Issue your first attestation', 'Verify from anywhere']) {
      await expect(page.getByText(step)).toBeVisible();
    }
  });

  test('shows npm install command', async ({ page }) => {
    await page.goto('/developers/quick-start');
    await expect(page.getByText('npm install prova-agent-sdk')).toBeVisible();
  });
});
