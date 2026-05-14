import { Page, Locator } from '@playwright/test';
import { UIActions } from '../../core/wrappers/uiActions';

export class TrendingComponent {
  readonly page: Page;

  readonly section: Locator;
  readonly products: Locator;
  readonly nextBtn: Locator;
  readonly prevBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.section = page.getByTestId('trending-section');
    this.products = this.section.getByTestId('trending-product-card');
    this.nextBtn = page.getByTestId('trending-next');
    this.prevBtn = page.getByTestId('trending-prev');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async clickNext() {
    await UIActions.click(this.nextBtn, 'Trending Next');
  }

  async clickPrev() {
    await UIActions.click(this.prevBtn, 'Trending Prev');
  }

  async clickFirstProduct() {
    await UIActions.click(this.products.first(), 'First Product');
  }

  async getProductTitle(index: number) {
    return await this.products.nth(index).locator('h3').textContent();
  }

  async getPrice(index: number) {
    return await this.products.nth(index).locator('p').textContent();
  }
}