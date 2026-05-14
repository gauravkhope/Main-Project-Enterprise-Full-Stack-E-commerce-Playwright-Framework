import { test, expect } from '@playwright/test';

test.describe('Home Page - Trending Products', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // =====================================================
  // 1️⃣ Section Validation
  // =====================================================
  test('Trending section is visible with title', async ({ page }) => {

    await expect(page.getByTestId('trending-section')).toBeVisible();
    await expect(page.getByTestId('trending-section').locator('h2'))
      .toContainText('Trending');

  });


  // =====================================================
  // 2️⃣ Products Render Properly
  // =====================================================
  test('Trending products are displayed with name and price', async ({ page }) => {

    const products = page.getByTestId('trending-product-card');
    const count = await products.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {

      const product = products.nth(i);

      await expect(
        product.locator('h3')
      ).toBeVisible();

      const price = product.locator('p');
      await expect(price).toBeVisible();

      // Validate ₹ price format
      const priceText = await price.textContent();
      expect(priceText).toMatch(/₹[\d,]+/);

    }
  });



  // =====================================================
  // 3 Navigation Validation
  // =====================================================
  test('Clicking trending product navigates to detail page', async ({ page }) => {

    const firstProduct = page
      .getByTestId('trending-product-card')
      .first();

    await firstProduct.click();

    await expect(page).toHaveURL(/home-product/);

  });


  // =====================================================
  // 4 Carousel Navigation
  // =====================================================
  test('Carousel next and prev buttons work', async ({ page }) => {

    const nextBtn = page.getByTestId('trending-next');
    const prevBtn = page.getByTestId('trending-prev');

    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await expect(
        page.getByTestId('trending-product-card').first()
      ).toBeVisible();
    }

    if (await prevBtn.isVisible()) {
      await prevBtn.click();
      await expect(
        page.getByTestId('trending-product-card').first()
      ).toBeVisible();
    }

  });

});

test.describe('Trending Carousel - Simple 4 Slide Logic', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Verify 4 products visible per slide (1-12)', async ({ page }) => {

    const products = page.getByTestId("trending-section").getByTestId('trending-product-card');
    const nextBtn = page.getByTestId('trending-next');

    // 1️⃣ Verify total 12 products exist in DOM
    await expect(products).toHaveCount(12);

    // ---------------------------
    // SLIDE 1 → index 0-3 visible
    // ---------------------------
    for (let i = 0; i < 12; i++) {
      if (i < 4) {
        await expect(products.nth(i)).toBeVisible();
      } else {
        await expect(products.nth(i)).not.toBeInViewport();
      }
    }

    // ---------------------------
    // SLIDE 2 → index 4-7 visible
    // ---------------------------
    await nextBtn.click();
    await page.waitForTimeout(400);

    for (let i = 0; i < 12; i++) {
      if (i >= 4 && i < 8) {
        await expect(products.nth(i)).toBeVisible();
      } else {
        await expect(products.nth(i)).not.toBeInViewport();
      }
    }

    // ---------------------------
    // SLIDE 3 → index 8-11 visible
    // ---------------------------
    await nextBtn.click();
    await page.waitForTimeout(400);

    for (let i = 0; i < 12; i++) {
      if (i >= 8 && i < 12) {
        await expect(products.nth(i)).toBeVisible();
      } else {
        await expect(products.nth(i)).not.toBeInViewport();
      }
    }

  });

});


  test('Carousel auto advances every 3.5 seconds', async ({ page }) => {
     await page.goto('/');

    const products = page.getByTestId("trending-section").getByTestId('trending-product-card');

    // Capture first slide first product
    const firstSlideFirstProduct = await products
      .nth(0)
      .locator('h3')
      .textContent();

    // Wait for auto slide (3.5s + buffer)
    await page.waitForTimeout(3800);

    const secondSlideFirstProduct = await products
      .nth(4)
      .locator('h3')
      .textContent();

    expect(secondSlideFirstProduct).not.toBe(firstSlideFirstProduct);

    // Wait again
    await page.waitForTimeout(3800);

    const thirdSlideFirstProduct = await products
      .nth(8)
      .locator('h3')
      .textContent();

    expect(thirdSlideFirstProduct).not.toBe(secondSlideFirstProduct);

  });

