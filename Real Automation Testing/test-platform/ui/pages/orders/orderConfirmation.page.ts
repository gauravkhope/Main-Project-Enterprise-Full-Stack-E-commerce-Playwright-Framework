import { Page } from '@playwright/test';

export class OrderPage {
  constructor(public page: Page) {}

  products() {
    return this.page.getByTestId('trending-product-card');
  }

  async selectRandomProduct(): Promise<{ name: string; price: string; qty: string }> {
    const products = this.products();
    const count = await products.count();

    const index = Math.floor(Math.random() * count);
    const selected = products.nth(index);

    const name = (await selected.locator('h3').textContent())?.trim() ?? '';
    const pricee = (await selected.locator('p').first().textContent())?.trim() ?? '';

    await selected.click();
     
const price = (await this.page.getByTestId('product-price').textContent())?.trim() ?? '';

    const qty = (await this.page
      .getByTestId('quantity-selector')
      .locator('span')
      .textContent()) ?? '';

    return { name, price, qty };
  }

  async fillShipping(): Promise<void> {
    await this.page.locator('input[name="address"]').fill('vile parle , BKC road');
    await this.page.locator('input[name="city"]').fill('Mumbai');
    await this.page.locator('input[name="state"]').fill('Maharashtra');
    await this.page.locator('input[name="zip"]').fill('400002');
    await this.page.locator('input[name="phone"]').fill('9689769664');
  }

  async extractShipping(): Promise<{
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
  }> {
    return {
      address: await this.page.locator('input[name="address"]').inputValue(),
      city: await this.page.locator('input[name="city"]').inputValue(),
      state: await this.page.locator('input[name="state"]').inputValue(),
      zip: await this.page.locator('input[name="zip"]').inputValue(),
      phone: await this.page.locator('input[name="phone"]').inputValue(),
      email: await this.page.locator('input[name="email"]').inputValue(),
    };
  }

  async selectUPI() {
    const payment = this.page.getByTestId('payment-method');
    await payment.getByRole('button', { name: /UPI/i }).click();
  }

  async payWithRandomUPI() {
    const modal = this.page.getByTestId('payment-modal');

    await this.page.getByRole('button', { name: /UPI Help/i }).click();

    const options = this.page.getByTestId('upi-ids').locator('button');
    const count = await options.count();

    const index = Math.floor(Math.random() * count);
    await options.nth(index).click();

    await this.page.getByRole('button', { name: /Pay via UPI/i }).click();
  }

  async clickViewOrderDetails() {
    await this.page.getByRole("button", { name: "View Order Details" }).click();
  }

  async clickContinueShopping() {
    await this.page.getByRole("button", { name: "Continue Shopping" }).click();
  }
}