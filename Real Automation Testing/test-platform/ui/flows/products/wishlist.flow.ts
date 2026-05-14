import { WishlistPage } from '../../pages/products/wishlist.page';
import type { Locator } from '@playwright/test';

export class WishlistFlow {
  constructor(private pageObj: WishlistPage) {}

  async openProducts() {
    await this.pageObj.page.goto('/products');
  }

  async addToWishlist(productName: string) {
    const product = this.pageObj.getProductCardByName(productName);
    const heart = this.pageObj.getHeartIcon(product);
    await heart.click();
  }

  async openWishlist() {
    await this.pageObj.navbarWishlist.click();
  }

  async removeFromWishlist(item: Locator): Promise<void> {
    await this.pageObj
      .getWishlistButtons(item)
      .filter({ hasText: 'Remove' })
      .click();
  }

  async clearWishlist() {
    await this.pageObj.clearWishlistButton().click();
  }
}