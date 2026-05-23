import { Page, Locator } from '@playwright/test';

export class WishlistPage {
  readonly page: Page;

  readonly productCards: Locator;
  readonly productHomeCards: Locator;
  readonly navbarWishlist: Locator;
  readonly wishlistCount: Locator;
  readonly wishlistItems: Locator;
  readonly toast: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productCards = page.getByTestId('product-card');
    this.productHomeCards = page.getByTestId("trending-product-card");
    this.navbarWishlist = page.getByTestId('navbar-wishlist');
    this.wishlistCount = this.navbarWishlist.locator('span');
    this.wishlistItems = page.getByTestId('wishlistcard');
    this.toast = page.getByRole('status');
  }

  getProductCardByName(name: string) {
    return this.productCards.filter({
      has: this.page.getByTestId('product-title').filter({ hasText: name }),
    });
  }
  getHomeProductCardByName(name: string) {
    return this.productHomeCards.filter({
      has: this.page.getByRole("heading", { name: name , exact: true}),
    });
  }

  getHeartIcon(product: Locator) {
    return product.locator('button svg').first();
  }

  getWishlistButtons(item: Locator) {
    return item.locator('button');
  }

  clearWishlistButton() {
    return this.page.getByTestId('clearwishlistbutton');
  }

  emptyMessage() {
    return this.page.getByText('Your Wishlist is Empty');
  }
}