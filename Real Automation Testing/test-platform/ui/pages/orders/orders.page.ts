import { Page } from '@playwright/test';

export class OrdersPage {
  constructor(public page: Page) {}

  async gotoHome() {
    await this.page.goto('/');
  }

  async openOrders() {
    await this.page.getByTestId("navbar-hamburger").click();
    await this.page.getByTestId("side-drawer").getByText("MY PROFILE").click();
    await this.page.getByTestId("side-drawer").getByText("Orders").click();
  }

  orderCards() {
    return this.page.locator('[data-testid^="order-card-"]');
  }

  firstOrder() {
    return this.orderCards().first();
  }

  async openFirstOrderDetails() {
    await this.firstOrder()
      .getByRole('button', { name: /view order details/i })
      .click();
  }
}