import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(public page: Page) {}

  async gotoHome() {
    await this.page.goto('/');
  }

  getProduct(productName: string) {
    return this.page.getByTestId("trending-product-card")
      .filter({ hasText: productName })
      .first();
  }

  async clickBuyNow() {
    await this.page.getByRole('button', { name: /Buy Now/i }).click();
  }

  async proceedToPayment() {
    await this.page.getByRole('button', { name: /Proceed to Payment/i }).click();
  }

  async fillShipping() {
    await this.page.locator('input[name="address"]').fill('BKC road , Bandra East');
    await this.page.locator('input[name="city"]').fill('Mumbai');
    await this.page.locator('input[name="state"]').fill('Maharashtra');
    await this.page.locator('input[name="zip"]').fill('400051');
    await this.page.locator('input[name="phone"]').fill('9689769664');
  }

  modal() {
    return this.page.getByTestId('payment-modal');
  }

  async confirmEmptyCard() {
    await this.modal().getByTestId('confirm-card').click();
  }

  async fillCard(number: string, cvv: string, expiry: string) {
    const modal = this.modal();
    await modal.getByTestId('card-number').fill(number);
    await modal.getByTestId('cvv').fill(cvv);
    await modal.getByTestId('expiry').fill(expiry);
  }

  async confirmCard() {
    await this.modal().getByTestId('confirm-card').click();
  }

  async placedOrder() {
     await this.modal().getByRole('button', { name: /Place Order/i }).click();
  }
  async cancelPayment() {
    await this.modal().getByTestId('cancel-card').click();
  }
  async selectUPIMode() {
  await this.modal().getByTestId('upi-mode-selector').selectOption('upi');
}

async payViaUPI() {
  await this.modal().getByRole('button', { name: /Pay via UPI/i }).click();
}

async enterUPI(upi: string) {
  await this.modal()
    .getByPlaceholder('username@bankhandle')
    .fill(upi);
}
}