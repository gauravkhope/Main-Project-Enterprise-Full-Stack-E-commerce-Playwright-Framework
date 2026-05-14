import { CartPage } from '../../pages/cart/cartPage.page';
import { type Locator } from '@playwright/test';

export class CartFlow {
  constructor(private pageObj: CartPage) {}

  async openProducts() {
    await this.pageObj.page.goto('/products');
  }

  async openCart() {
    await this.pageObj.cartIcon.click();
  }

  async addProduct(product: Locator) {
    await product.hover();
    await this.pageObj.getAddBtn(product).click();
  }

  async addMultiple(indexes: number[]) {
    for (const i of indexes) {
      const product = this.pageObj.productCards.nth(i);
      await product.hover();
      await this.pageObj.getAddBtn(product).click();
    }
  }
}