import { expect, Page } from '@playwright/test';
import { ProductsPage } from '../../../ui/pages/products/products.page';

export class ProductsAssertions {

  static async expectPageLoaded(page:Page) {
    await expect(page).toHaveURL(/products/);
  }

  static async expectGridVisible(productsPage: ProductsPage) {
    await expect(productsPage.grid).toBeVisible();
  }

  static async expectProductsDisplayed(productsPage: ProductsPage) {
    const count = await productsPage.getProductCount();

    expect(count).toBe(20);

    // first product
    await expect(productsPage.getProduct(0)).toBeVisible();

    // random product
    const randomIndex = Math.floor(Math.random() * count);
    await expect(productsPage.getProduct(randomIndex)).toBeVisible();
  }
}