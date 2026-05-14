import { expect, Locator } from '@playwright/test';

export class FiltersAssertions {

  static async expectVisible(locator: Locator) {
    await expect(locator).toBeVisible({ timeout: 10000 });
  }

  static async expectProductsVisible(products: Locator) {
    await expect(products.first()).toBeVisible();
  }

  static async expectBrand(products: Locator, brand: string) {
    const count = await products.count();
    for (let i = 0; i < count; i++) {
      await expect(products.nth(i).getByTestId('product-brand'))
        .toHaveText(brand);
    }
  }

  static async expectMultiBrand(products: Locator, brands: string[]) {
    const count = await products.count();
    for (let i = 0; i < count; i++) {
      const text = (await products.nth(i)
        .getByTestId('product-brand')
        .innerText()).trim();

      expect(brands).toContain(text);
    }
  }

  static async expectPriceRange(products: Locator, min: number, max: number) {
    const count = await products.count();

    for (let i = 0; i < count; i++) {
      const priceText = (await products.nth(i)
        .getByTestId('product-price')
        .innerText()).trim();

      const value = parseInt(priceText.replace(/[₹,]/g, ''));

      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThanOrEqual(max);
    }
  }

  static async expectPriceMax(products: Locator, max: number) {
    const count = await products.count();

    for (let i = 0; i < count; i++) {
      const priceText = (await products.nth(i)
        .getByTestId('product-price')
        .innerText()).trim();

      const value = parseInt(priceText.replace(/[₹,]/g, ''));

      expect(value).toBeLessThanOrEqual(max);
    }
  }
}