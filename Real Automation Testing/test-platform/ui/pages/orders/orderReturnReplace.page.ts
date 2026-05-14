import type { Locator, Page } from '@playwright/test';

export class OrderReturnReplacePage {

  constructor(public page: Page) {}

  // =========================
  // NAVIGATION
  // =========================
  async openOrdersPage() {
    await this.page.goto('/');

    await this.page.getByTestId('navbar-hamburger').click();

    const drawer = this.page.getByTestId('side-drawer');

    await drawer.getByText('MY PROFILE').click();
    await drawer.getByText('Orders').click();
  }

  // =========================
  // OPEN ORDER
  // =========================
  async openOrder(order: Locator) {
    await Promise.all([
      this.page.waitForURL(/\/orders\/\d+$/),
      order.getByRole('button', {
        name: /view order details/i
      }).click()
    ]);
  }

  // =========================
  // BUTTONS
  // =========================
  returnButton() {
    return this.page.getByRole('button', {
      name: /order return/i
    });
  }

  replaceButton() {
    return this.page.getByRole('button', {
      name: /order replace/i
    });
  }

  returnCancelButton() {
    return this.page.getByRole('button', {
      name: /return cancel/i
    });
  }

  replaceCancelButton() {
    return this.page.getByRole('button', {
      name: /cancel replace/i
    });
  }

  submitButton() {
    return this.page.getByRole('button', {
      name: /submit request/i
    });
  }

  textarea() {
    return this.page.getByPlaceholder(
      'Please tell us the reason...'
    );
  }

  // =========================
  // ACTIONS
  // =========================
  async submitReturn(reason: string) {
    await this.returnButton().click();

    await this.textarea().fill(reason);

    await this.submitButton().click();
  }

  async submitReplace(reason: string) {
    await this.replaceButton().click();

    await this.textarea().fill(reason);

    await this.submitButton().click();
  }
}