import { test, expect } from '@playwright/test';

test('landing page has heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Student Information Centre')).toBeVisible();
});
