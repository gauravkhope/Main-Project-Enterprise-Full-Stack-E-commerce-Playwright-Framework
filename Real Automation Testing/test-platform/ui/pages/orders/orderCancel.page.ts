import type { Locator, Page } from '@playwright/test';

export class OrderCancelPage {
  constructor(public page: Page) {}

  // =========================
  // 🔹 NAVIGATION
  // =========================
  async openOrdersPage() {
    await this.page.goto('/');

    await this.page.getByTestId('navbar-hamburger').click();

    const drawer = this.page.getByTestId('side-drawer');

    await drawer.getByText('MY PROFILE').click();
    await drawer.getByText('Orders').click();
  }

  // =========================
  // 🔹 OPEN ORDER
  // =========================
  async openOrderDetails(order: Locator) {
    await Promise.all([
      this.page.waitForURL(/\/orders\/\d+$/),
      order.getByRole('button', {
        name: /view order details/i
      }).click()
    ]);

  }

  // =========================
  // 🔹 LOCATORS
  // =========================
  cancelButton() {
    return this.page.getByRole('button', {
      name: /cancel order/i
    });
  }

  confirmCancelButton() {
    return this.page.getByRole('button', {
      name: /confirm/i
    });
  }

  // =========================
  // 🔹 ACTIONS
  // =========================
  async cancelOrder() {
    await this.cancelButton().click();

    const confirmBtn = this.confirmCancelButton();

    if (await confirmBtn.count()) {
      await confirmBtn.click();
    }
  }
}