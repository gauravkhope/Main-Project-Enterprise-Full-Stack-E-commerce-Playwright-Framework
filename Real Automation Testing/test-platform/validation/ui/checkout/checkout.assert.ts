import { expect } from '@playwright/test';
import { CheckoutPage } from '../../../ui/pages/checkout/checkout.page';

export class CheckoutAssertions {

  static async expectCheckoutPage(page: CheckoutPage) {
    await expect(page.page).toHaveURL(/checkout/);
  }

  static async expectToast(page: CheckoutPage, text: RegExp) {
    await expect(page.page.getByText(text)).toBeVisible();
  }

  static async expectPaymentModal(page: CheckoutPage) {
    await expect(page.page.getByTestId('payment-modal')).toBeVisible();
  }

  static async expectCardErrors(page: CheckoutPage) {
    await expect(page.page.getByText(/Card number is required/i)).toBeVisible();
    await expect(page.page.getByText(/CVV is required/i)).toBeVisible();
    await expect(page.page.getByText(/Expiry date is required/i)).toBeVisible();
  }

  static async expectCardError(page: CheckoutPage, text: RegExp) {
    await expect(page.page.getByText(text)).toBeVisible();
  }

  static async expectPaymentConfirmed(page: CheckoutPage, last4: string) {
    await expect(page.page.getByText(/Payment Confirmed/i)).toBeVisible();
    await expect(page.page.getByText(new RegExp(last4))).toBeVisible();
  }

  static async expectOrderSuccess(page: CheckoutPage) {
    await expect(page.page.getByText(/Payment Successful/i)).toBeVisible();
    await expect(
      page.page.getByText(/Payment successful! Order placed/i)
    ).toBeVisible();
  }

  static async expectModalClosed(page: CheckoutPage) {
    await expect(page.page.getByTestId('payment-modal')).not.toBeVisible();
  }
  static async expectUPIError(page:CheckoutPage, text: RegExp) {
  await expect(page.page.getByText(text)).toBeVisible();
}

static async expectUPIFailure(page:CheckoutPage, upi: string) {
  await expect(page.page.getByText(/Payment failed/i)).toBeVisible();
  await expect(page.page.getByText(/Invalid or unlisted UPI ID/i)).toBeVisible();
  await expect(page.page.getByText(new RegExp(upi))).toBeVisible();
}

static async expectUPIFormatError(page:CheckoutPage) {
  await expect(
    page.page.getByText(/Invalid UPI ID format/i)
  ).toBeVisible();
}

static async expectPaymentSuccess(page:CheckoutPage) {
  await expect(
    page.page.getByText(/Payment Successful/i)
  ).toBeVisible();
}

static async expectCODSuccess(page:CheckoutPage) {
  await expect(page.page.getByText(/Order Confirmed/i)).toBeVisible();
  await expect(page.page.getByText(/Order Placed Successfully/i)).toBeVisible();
}
}