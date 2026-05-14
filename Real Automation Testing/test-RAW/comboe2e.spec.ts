import { test, expect, Page } from '@playwright/test';

test.describe('Products - Brand + Price + Pagination', () => {

  test('Apple + Samsung with price range across all pages', async ({ page }) => {

    await page.goto('/products');

    // ================================
    // 🔹 Open Filters
    // ================================

    await page.getByTestId('filters-toggle').click();

    const brandSection = page.getByTestId('filter-brands');
    const priceSection = page.getByTestId('filter-price');

    const minInput = priceSection.getByPlaceholder('Min');
    const maxInput = priceSection.getByPlaceholder('Max');

    // ================================
    // 🔹 Apply Brand Filters
    // ================================

    const brandOne = 'Apple';
    const brandTwo = 'Samsung';

    await brandSection.getByLabel(brandOne).check();
    await brandSection.getByLabel(brandTwo).check();

    // ================================
    // 🔹 Apply Price Range
    // ================================

    const minValue = 50000;
    const maxValue = 200000;

    await minInput.fill('');
    await minInput.fill(String(minValue));

    await maxInput.fill('');
    await maxInput.fill(String(maxValue));
    await maxInput.blur();

    // ================================
    // 🔹 Validate Active Filters
    // ================================

    const chips = page.getByTestId('active-filter-chip');

    await expect(page.getByTestId('active-filters')).toBeVisible();
    await expect(chips.filter({ hasText: brandOne })).toBeVisible();
    await expect(chips.filter({ hasText: brandTwo })).toBeVisible();

    // ================================
    // 🔹 Validate Products Across Pagination
    // ================================

    const selectedBrands = [brandOne, brandTwo];

    while (true) {

      // Validate products on current page
      await validateProducts(page, selectedBrands, minValue, maxValue);

      // Check if Next button exists and is enabled
      const nextButton = page.getByTestId("pagination-controls").getByRole('button', { name: 'Next' });

      if (await nextButton.isDisabled()) {
        break;
      }

      await nextButton.click();
      await page.waitForLoadState('networkidle');
    }

  });

});


// ==========================================
// 🔹 Reusable Validation Function
// ==========================================

async function validateProducts(
  page: Page,
  allowedBrands: string[],
  minValue: number,
  maxValue: number
) {

  const products = page.getByTestId('product-card');
  const count = await products.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {

    const product = products.nth(i);

    // 🔹 Validate Brand
    const brandText = await product
      .getByTestId('product-brand')
      .innerText();

    expect(allowedBrands).toContain(brandText);

    // 🔹 Validate Price
    const priceText = await product
      .getByTestId('product-price')
      .innerText();

    const numericPrice = parseInt(
      priceText.replace(/[₹,]/g, '')
    );

    expect(numericPrice).toBeGreaterThanOrEqual(minValue);
    expect(numericPrice).toBeLessThanOrEqual(maxValue);
  }
}


test('Stress: Rapid brand toggle', async ({ page }) => {

  await page.goto('/products');
  await page.getByTestId('filters-toggle').click();

  const brandsSection = page.getByTestId('filter-brands');
  const checkboxes = brandsSection.locator('input[type="checkbox"]');

  const total = await checkboxes.count();

  for (let i = 0; i < 20; i++) {

    const randomIndex = Math.floor(Math.random() * total);

    await checkboxes.nth(randomIndex).click();
  }

  await expect(page.getByTestId('product-grid')).toBeVisible();
});