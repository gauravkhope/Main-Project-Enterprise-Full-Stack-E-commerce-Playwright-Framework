import { expect, Locator } from '@playwright/test';

export class FiltersComboAssertions {

  static async expectFiltersVisible(activeFilters: Locator) {
    await expect(activeFilters).toBeVisible();
  }

  static async expectChip(chips: Locator, text: string) {
    await expect(chips.filter({ hasText: text })).toBeVisible();
  }

  static async expectProductsValid(products: Locator, brands: string[], min: number, max: number) {
    const count = await products.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {

      const product = products.nth(i);

      const brand = await product.getByTestId('product-brand').innerText();
      expect(brands).toContain(brand);

      const priceText = await product.getByTestId('product-price').innerText();
      const price = parseInt(priceText.replace(/[₹,]/g, ''));

      expect(price).toBeGreaterThanOrEqual(min);
      expect(price).toBeLessThanOrEqual(max);
    }
  }

  static async expectGridVisible(grid: Locator) {
    await expect(grid).toBeVisible();
  }
}