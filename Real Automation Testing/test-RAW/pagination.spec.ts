import {test , expect} from '@playwright/test';

test('Pagination functionality', async ({ page }) => {
  await page.goto('/products');
 for (let i = 3; i < 100; i ++) {

    await page.getByTestId('pagination-controls').getByRole('button', { name: `${i}` }).click();
    console.log(`Clicked on page ${i}`);
 }
});