import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  readonly productCards: Locator;
  readonly navbarCart: Locator;
  readonly cartCount: Locator;
  readonly toast: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productCards = page.getByTestId('product-card');
    this.navbarCart = page.getByTestId('navbar-cart');
    this.cartCount = this.navbarCart.locator('span');
    this.toast = page.getByRole('status');
  }

  getProductCardByName(name: string) {
    return this.productCards.filter({
      has: this.page.getByTestId('product-title').filter({ hasText: name }),
    });
  }

  getAddButton(product: Locator) {
    return product.getByRole('button', { name: /add to cart/i });
  }

  getCartButton(product: Locator) {
    return product.getByRole('button').last();
  }
}