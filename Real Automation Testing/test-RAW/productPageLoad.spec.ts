import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  // 1️⃣ Page loads
  test('Page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/products/);
  });

  // 2️⃣ Product grid visible
  test('Product grid is visible', async ({ page }) => {
    const grid = page.getByTestId('product-grid');
    await expect(grid).toBeVisible();
  });

  // 3️⃣  product card exists
  test('All product cards is displayed', async ({ page }) => {
    const products = page.getByTestId('product-card');
    await expect(products.first()).toBeVisible();
    const pnum =(Math.floor(Math.random() * 19));
    await expect(products.nth(pnum)).toBeVisible();
    await expect(products.count()).resolves.toBe(20);
    //  console.log("total product cards:", await products.count());
  });
});




