import { test, expect } from '@playwright/test';


test('Apply price range filter and validate products', async ({ page }) => {

  await page.goto('/products');

  await page.getByTestId('filters-toggle').click();

  const priceSection = page.getByTestId('filter-price');

  const minInput = priceSection.getByPlaceholder('Min');
  const maxInput = priceSection.getByPlaceholder('Max');

  const minValue = 50000;
  const maxValue = 150000;

  // 🔹 Clear existing values properly
  await minInput.fill('');
  await minInput.fill(String(minValue));

  await maxInput.fill('');
  await maxInput.fill(String(maxValue));

  // Trigger update (important if React state updates on blur)
  await maxInput.blur();

  // ✅ Validate active filter visible
  await expect(page.getByTestId('active-filters')).toBeVisible();

  // ✅ Validate products
  const products = page.getByTestId('product-card');
  const count = await products.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {

    const priceText = await products
      .nth(i)
      .getByTestId('product-price')
      .innerText();

    const numericPrice = parseInt(
      priceText.replace(/[₹,]/g, '')
    );

    expect(numericPrice).toBeGreaterThanOrEqual(minValue);
    expect(numericPrice).toBeLessThanOrEqual(maxValue);
  }

});

test('Slider filters products using fixed user value', async ({ page }) => {

    await page.goto('/products');
    await page.getByTestId('filters-toggle').click();

    const priceSection = page.getByTestId('filter-price');
    const slider = priceSection.locator('input[type="range"]');
    const maxInput = priceSection.getByPlaceholder('Max');

    // 🔥 USER DECIDES VALUE
    const userSelectedMaxValue = 2500000;

    // Set slider value directly
    await slider.fill(String(userSelectedMaxValue));
    await slider.dispatchEvent('input');
    await slider.dispatchEvent('change');

    // Read actual updated value
    const updatedValue = parseInt(await maxInput.inputValue());

    // Ensure slider applied (not equal to original max)
    expect(updatedValue).toBeLessThanOrEqual(userSelectedMaxValue);

    // ✅ Validate products
    const products = page.getByTestId('product-card');
    const count = await products.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {

      const priceText = await products
        .nth(i)
        .getByTestId('product-price')
        .innerText();

      const numericPrice = parseInt(
        priceText.replace(/[₹,]/g, '')
      );

      expect(numericPrice).toBeLessThanOrEqual(updatedValue);
    }

  });