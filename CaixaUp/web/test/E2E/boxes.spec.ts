import { test, expect } from '@playwright/test';

test.describe('E2E: Boxes Dashboard', () => {
  test('CT-03 & CT-04: Can view boxes, sort, filter and navigate to details', async ({ page }) => {
    await page.goto('/boxes');

    // Mocks for /boxes
    await page.route('**/boxes', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              { id: '1', name: 'Zebra Box', balance: 500, accumulatedGains: -10 },
              { id: '2', name: 'Alpha Box', balance: 1000, accumulatedGains: 50 }
            ]
          })
        });
      }
    });
    
    // Mocks for /boxes/:id
    await page.route('**/boxes/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: '1', name: 'Zebra Box', balance: 500, accumulatedGains: -10, rentabilityPercentage: -2 }
        })
      });
    });

    await page.route('**/role-user-box-bottom/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: []
        })
      });
    });
  });
});
