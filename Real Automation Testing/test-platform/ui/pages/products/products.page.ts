import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;

  readonly grid: Locator;
  readonly products: Locator;

  constructor(page: Page) {
    this.page = page;

    this.grid = page.getByTestId('product-grid');
    this.products = page.getByTestId('product-card');
  }

  async navigate() {
    await this.page.goto('/products');
  }

  async waitForProductsToLoad() {
  await this.products.first().waitFor({ state: 'visible' });
}

  async getProductCount() {
    return await this.products.count();
  }

  getProduct(index: number) {
    return this.products.nth(index);
  }
}