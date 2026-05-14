import type { OrderPage } from '../../pages/orders/orderConfirmation.page';

export class OrderFlow {
  constructor(private orderPage: OrderPage) {}

  async completeOrderWithUPI() {

    await this.orderPage.page.goto('/');

    const product = await this.orderPage.selectRandomProduct();

    await this.orderPage.page.getByRole('button', { name: /Buy Now/i }).click();

    await this.orderPage.fillShipping();

    const shipping = await this.orderPage.extractShipping();

    await this.orderPage.selectUPI();

    await this.orderPage.page
      .getByRole('button', { name: /Proceed to Payment/i })
      .click();

    await this.orderPage.payWithRandomUPI();

    return {
      productName: product.name,
      productPrice: product.price,
      productQty: product.qty,
      shipping
    };
  }
}