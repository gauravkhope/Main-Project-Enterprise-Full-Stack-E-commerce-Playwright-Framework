import { CartPage } from '../../pages/cart/cart.page';
import type { Locator } from '@playwright/test';

export class CartFlow {
  constructor(private pageObj: CartPage) {}

  async openProducts() {
    await this.pageObj.page.goto('/products');
  }

  async hoverProduct(product: Locator): Promise<void> {
    await product.hover();
  }

  async clickAdd(product: Locator): Promise<void> {
    const btn = this.pageObj.getAddButton(product);
    await btn.click();
  }

  async clickCartButton(product: Locator): Promise<void> {
    const btn = this.pageObj.getCartButton(product);
    await btn.click();
  }
}