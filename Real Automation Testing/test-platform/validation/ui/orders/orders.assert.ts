import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

type OrderData = {
  id: string | null;
  status: string | null;
  total: string | null;
  date: string | null;
  price: string | null;
  address: string | null;
};

type PageObject = { page: Page };

export class OrdersAssertions {

  static async expectOrdersPage(page: PageObject) {
    await expect(page.page).toHaveURL('/orders');
  }

  static async expectOrderCount(count: number) {
    expect(count).toBeGreaterThan(0);
  }

  static async expectOrderCardData(data: OrderData) {
    expect(data.id).toBeTruthy();
    expect(data.status).toBeTruthy();
    expect(data.total).toBeTruthy();
    expect(data.date).toBeTruthy();
    expect(data.price).toBeTruthy();
    expect(data.address).toBeTruthy();
  }

  static async expectProcessing(statusLocator: Locator) {
    await expect(statusLocator).toHaveText('Processing');
  }

  static async expectCompleted(statusLocator: Locator) {
    await expect(statusLocator).toHaveText('Completed');
  }

  static async expectOrderDetailsPage(page: Page) {
    await expect(page.getByTestId('order-id')).toBeVisible();
    await expect(page.getByTestId('order-id')).toContainText('Order #');
    await expect(page.getByTestId('order-date')).toBeVisible();
  }

  static async expectStatusValidation(page: Page) {
    const status = page.getByTestId('order-status');
    await expect(status).toBeVisible();

    const text = await status.textContent();
    expect(text).toMatch(/Order Placed|Order Packed|Shipped|Delivered|Cancelled/);

    return text;
  }

  static async expectTracking(page: Page) {
    await expect(page.getByTestId('tracking-step-order-placed')).toBeVisible();
    await expect(page.getByTestId('tracking-step-order-packed')).toBeVisible();
    await expect(page.getByTestId('tracking-step-order-shipped')).toBeVisible();
    await expect(page.getByTestId('tracking-step-order-delivered')).toBeVisible();
  }

  static async expectShipping(page: Page) {
    const address = page.getByTestId('shipping-address');
    await expect(address).toBeVisible();
    await expect(address).toContainText('India');

    await expect(page.getByTestId('shipping-phone')).toBeVisible();
    await expect(page.getByTestId('shipping-email')).toBeVisible();
  }

  static async expectPayment(page: Page) {
    await expect(page.getByTestId('payment-method')).toBeVisible();
    await expect(page.getByTestId('payment-status')).toBeVisible();
    await expect(page.getByTestId('payment-amount')).toBeVisible();
  }

  static async expectProduct(page: Page) {
    await expect(page.getByTestId('product-name')).toBeVisible();
    await expect(page.getByTestId('product-qty')).toBeVisible();
    await expect(page.getByTestId('product-price')).toBeVisible();
  }

  static async expectSummary(page: Page) {
    const subtotal = page.getByTestId('subtotal');
    const gst = page.getByTestId('gst');
    const total = page.getByTestId('order-total');

    await expect(subtotal).toBeVisible();
    await expect(gst).toBeVisible();
    await expect(total).toBeVisible();

    const clean = (val: string | null) => Number(val?.replace(/[₹,]/g, ''));

    const subtotalVal = clean(await subtotal.textContent());
    const gstVal = clean(await gst.textContent());
    const totalVal = clean(await total.textContent());

    expect(totalVal).toBeCloseTo(subtotalVal + gstVal, 0);
  }

  static async expectButtons(page: Page, statusText: string | null) {
    const cancelBtn = page.getByRole('button', { name: 'Cancel Order' });
    const continueBtn = page.getByRole('button', { name: 'Continue Shopping' });
    const printBtn = page.getByRole('button', { name: 'Print Invoice' });

    await expect(printBtn).toBeVisible();
    await expect(continueBtn).toBeVisible();

    if (statusText?.includes('Delivered')) {
      await expect(page.getByText('Order Return')).toBeVisible();
      await expect(page.getByText('Order Replace')).toBeVisible();
    } else {
      await expect(cancelBtn).toBeVisible();
    }
  }
}