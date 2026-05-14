import { expect, type Page } from '@playwright/test';

export class OrderCancelAssertions {

  static async expectCancelled(page: Page) {
    await expect(page.getByTestId('order-status'))
      .toContainText('Cancelled');
  }

  static async expectCancelTracking(page: Page) {
    const cancelStep = page.getByTestId('tracking-step-cancelled');

    // ✅ icon visible
    await expect(cancelStep.locator('svg')).toBeVisible();

    // ✅ text
    await expect(
      cancelStep.getByTestId('tracking-text-cancelled')
    ).toHaveText(/cancelled/i);

    // ✅ date
    const cancelDate =
      cancelStep.getByTestId('tracking-date-actual-cancelled');

    await expect(cancelDate).toBeVisible();

    await expect(cancelDate)
      .not.toContainText('Expected');
  }

  static async expectInactiveSteps(page: Page) {
    await expect(
      page.getByTestId('tracking-icon-order-packed')
        .locator('svg')
    ).toHaveCount(0);

    await expect(
      page.getByTestId('tracking-icon-order-shipped')
        .locator('svg')
    ).toHaveCount(0);
  }

  static async expectCancelButtonHidden(page: Page) {
    await expect(
      page.getByRole('button', {
        name: /cancel order/i
      })
    ).toHaveCount(0);
  }

  static async expectPackedState(page: Page) {
    await expect(page.getByTestId('order-status'))
      .toContainText('Order Packed');
  }

  static async expectShippedState(page: Page) {
    await expect(page.getByTestId('order-status'))
      .toContainText('Shipped');
  }

  static async expectPaid(page: Page) {
    await expect(page.getByTestId('payment-status'))
      .toContainText(/Paid/i);
  }

  static async expectRefund(page: Page) {
    await expect(page.getByTestId('payment-status'))
      .toContainText(/Refunded/i);
  }

  static async expectGreenCheck(
    page: Page,
    step: string
  ) {
    const icon =
      page.getByTestId(`tracking-icon-${step}`);

    // ✅ green gradient
    await expect(icon).toHaveClass(/from-green-400/);
    await expect(icon).toHaveClass(/to-green-500/);

    // ✅ white icon
    await expect(icon).toHaveClass(/text-white/);

    // ✅ svg
    const svg = icon.locator('svg');

    await expect(svg).toBeVisible();

    // ✅ checkmark icon
    await expect(svg).toHaveClass(/circle-check/);
  }
}