import { Page, Locator } from '@playwright/test';

export class CategoryPage {
  readonly page: Page;

  readonly section: Locator;
  readonly categoryBlocks: Locator;
  readonly products: Locator;

  constructor(page: Page) {
    this.page = page;

    this.section = page.locator('#categories-section');
    this.categoryBlocks = page.getByTestId('category-section-block');
    this.products = page.getByTestId('trending-product-card');
  }

  getCategoryByName(name: string) {
    return this.categoryBlocks.filter({
      has: this.page.locator('h2', { hasText: name }),
    });
  }

  getProducts(category: Locator) {
    return category.getByTestId('trending-product-card');
  }

  getSeeAll(category: Locator) {
    return category.getByRole('link', { name: /see all/i });
  }

  getLoadMoreButton() {
    return this.page.getByRole('button', { name: /Load More/i });
  }

  getNoMoreText() {
    return this.page
      .getByTestId('category-products-page')
      .getByText('No more products.');
  }
}