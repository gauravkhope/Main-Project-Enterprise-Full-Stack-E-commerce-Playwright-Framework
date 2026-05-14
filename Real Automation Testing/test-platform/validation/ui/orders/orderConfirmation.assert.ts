import { expect } from '@playwright/test';
import type { OrderPage } from '../../../ui/pages/orders/orderConfirmation.page';

type ShippingDetails = Awaited<ReturnType<OrderPage['extractShipping']>>;

export class OrderAssertions {

  static async expectOrderPageVisible(page: OrderPage) {
    await expect(page.page.getByTestId('order-confirmation-page')).toBeVisible();
      await expect(page.page.getByTestId("order-success-section")).toBeVisible();

  }

  static async expectPaymentConfirmed(page: OrderPage) {
    await expect(page.page.getByTestId("payment-status"))
      .toHaveText("Payment Confirmed");
  }

  static async expectOrderTitle(page: OrderPage, productName: string) {
     const orderTitle = page.page.getByTestId('order-title');
  await expect(orderTitle).toBeVisible();
  await expect(orderTitle.locator('h1')).toContainText(/Order Placed Successfully/i);
    await expect(page.page.getByTestId("order-title-productname"))
      .toContainText(productName);
  }

  static async expectDeliveryDate(page: OrderPage) {
    const today = new Date();
    today.setDate(today.getDate() + 3);

    const expected = today.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    await expect(
      page.page.getByTestId("delivery-date")
    ).toHaveText(expected);
    // =========================================
    // 13. VALIDATE EXPECTED DELIVERY DATE
    // =========================================
    const confirmationExpectedDelivery = page.page.getByTestId('delivery-info');
    const deliveryDate = confirmationExpectedDelivery.getByTestId('delivery-date');
    const deliveryText = confirmationExpectedDelivery.locator('p').nth(1);
    await expect(confirmationExpectedDelivery).toBeVisible();
    await expect(confirmationExpectedDelivery.locator('h2')).toHaveText(/Estimated Delivery/i);
    await expect(deliveryText).toHaveText(/Your order is packed with care and moving through processing./i);

    await expect(deliveryDate).toHaveText(expected);
  }

  static async expectProductDetails(page: OrderPage, name: string, price: string, qty: string) {
    await expect(page.page.getByTestId("order-item-name")).toContainText(name);
    await expect(page.page.getByTestId("order-item-quantity")).toContainText(qty);
    await expect(page.page.getByTestId("order-item-price").locator('p').first())
      .toContainText(`${price}.00`);
    // =========================
    // 14. VALIDATE PRODUCT DATA
    // =========================
    const orderProductInfo = page.page.getByTestId('order-items');
    await expect(orderProductInfo.locator('h3')).toContainText(`Order Items (${qty})`);
    await expect(page.page.getByTestId('order-item-name')).toContainText(name);
    await expect(page.page.getByTestId('order-item-quantity')).toContainText(qty);
    await expect(page.page.getByTestId('order-item-price').locator('p').first()).toContainText(`${price}.00`);
  }

  static async expectShippingDetails(page: OrderPage, shipping: ShippingDetails) {
    await expect(page.page.getByTestId('contact-phone'))
      .toHaveText(shipping.phone);

    await expect(page.page.getByTestId('contact-email'))
      .toHaveText(shipping.email);
    // =========================
    // 13. VALIDATE SHIPPING DATA
    // =========================
    const shippingInfo = page.page.getByTestId('shipping-address');
    await expect(shippingInfo.locator('p').first()).toHaveText(shipping.address);
    await expect(shippingInfo.locator('p').nth(1)).toHaveText(`${shipping.city}, ${shipping.state} ${shipping.zip}`);
    await expect(page.page.getByTestId('contact-phone')).toHaveText(shipping.phone);
    await expect(page.page.getByTestId('contact-email')).toHaveText(shipping.email);
  }

  static async expectOrderSummary(page: OrderPage, price: string) {
 
    // =============================
    // 14. VALIDATE Order Summary
    // ============================
    const orderSummary = page.page.getByTestId('order-summary');
    await expect(orderSummary).toBeVisible();
    await expect(orderSummary.locator('h3')).toHaveText(/Order Summary/i);
    await expect(orderSummary.getByTestId('subtotal').locator('span').last()).toContainText(`${price}.00`);
    await expect(orderSummary.getByTestId('total-paid').locator('span').first()).toContainText('Total Paid');
    await expect(orderSummary.getByTestId('total-paid').locator('span').last()).toContainText(`${price}.00`);

    const today1 = new Date();
    const formattedDate = `${today1.getDate()}/${today1.getMonth() + 1}/${today1.getFullYear()}`;
    await expect(orderSummary.getByTestId('order-date').locator('span').last()).toContainText(formattedDate);
    await expect(orderSummary.getByTestId('payment-method').locator('span').last()).toContainText('upi');
    await expect(orderSummary.getByTestId('order-status').locator('span').last()).toContainText('processing');
  }

  static async expectActionButtons(page: OrderPage) {
    await expect(page.page.getByRole("button", { name: "View Order Details" })).toBeVisible();
    await expect(page.page.getByRole("button", { name: "Continue Shopping" })).toBeVisible();
  }

  static async expectOrderTrackingPage(page: OrderPage) {
    await expect(page.page.getByText("Order Tracking")).toBeVisible();
  }

  static async expectProductsPage(page: OrderPage) {
    await expect(page.page).toHaveURL('/products');
  }
}