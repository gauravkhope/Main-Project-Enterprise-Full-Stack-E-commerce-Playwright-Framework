import type { Locator, Page } from '@playwright/test';

export class CompleteFlowPage {

  constructor(public page: Page) {}

  // ============================================================
  // 🔹 NAVIGATION
  // ============================================================
  async gotoHomePage() {
    await this.page.goto('/');
  }

  async waitForCheckoutPage() {
    await this.page.waitForURL(/checkout/);
  }

  async waitForOrderDetailsPage() {
    await this.page.waitForURL(/\/orders\/\d+/);
  }

  // ============================================================
  // 🔹 PRODUCT SECTION
  // ============================================================
  trendingProducts() {
    return this.page.getByTestId(
      'trending-product-card'
    );
  }

  productName(product: Locator) {
    return product.locator('h3');
  }

  productPrice(product: Locator) {
    return product.locator('p').first();
  }

  quantitySelector() {
    return this.page
      .getByTestId('quantity-selector')
      .locator('span');
  }

  buyNowButton() {
    return this.page.getByRole('button', {
      name: /buy now/i
    });
  }

  // ============================================================
  // 🔹 SHIPPING FORM
  // ============================================================
  addressInput() {
    return this.page.locator(
      'input[name="address"]'
    );
  }

  cityInput() {
    return this.page.locator(
      'input[name="city"]'
    );
  }

  stateInput() {
    return this.page.locator(
      'input[name="state"]'
    );
  }

  zipInput() {
    return this.page.locator(
      'input[name="zip"]'
    );
  }

  phoneInput() {
    return this.page.locator(
      'input[name="phone"]'
    );
  }

  emailInput() {
    return this.page.locator(
      'input[name="email"]'
    );
  }

  // ============================================================
  // 🔹 CHECKOUT SUMMARY
  // ============================================================
  checkoutSummary() {
    return this.page.getByTestId(
      'checkout-order-summary'
    );
  }

  checkoutItemQuantity() {
    return this.page.getByTestId(
      'checkout-item-quantity'
    );
  }

  checkoutItemPrice() {
    return this.page.getByTestId(
      'checkout-item-price'
    );
  }

  checkoutSubtotal() {
    return this.page.getByTestId(
      'checkout-subtotal'
    );
  }

  checkoutShipping() {
    return this.page.getByTestId(
      'checkout-shipping'
    );
  }

  checkoutTotal() {
    return this.page.getByTestId(
      'checkout-total'
    );
  }

  // ============================================================
  // 🔹 PAYMENT SECTION
  // ============================================================
  paymentMethodSection() {
    return this.page.getByTestId(
      'payment-method'
    );
  }

  cardPaymentButton() {
    return this.paymentMethodSection()
      .getByRole('button', {
        name: 'Credit / Debit Card'
      });
  }

  upiPaymentButton() {
    return this.paymentMethodSection()
      .getByRole('button', {
        name: 'UPI'
      });
  }

  codPaymentButton() {
    return this.paymentMethodSection()
      .getByRole('button', {
        name: 'Cash On Delivery'
      });
  }

  proceedToPaymentButton() {
    return this.page.getByRole('button', {
      name: /proceed to payment/i
    });
  }

  proceedToCodButton() {
    return this.page.getByRole('button', {
      name: /proceed to cod/i
    });
  }

  // ============================================================
  // 🔹 PAYMENT MODAL
  // ============================================================
  paymentModal() {
    return this.page.getByTestId(
      'payment-modal'
    );
  }

  cardNumberInput() {
    return this.paymentModal()
      .getByTestId('card-number');
  }

  cardCvvInput() {
    return this.paymentModal()
      .getByTestId('cvv');
  }

  cardExpiryInput() {
    return this.paymentModal()
      .getByTestId('expiry');
  }

  confirmCardButton() {
    return this.paymentModal()
      .getByTestId('confirm-card');
  }

  placeOrderButton() {
    return this.paymentModal()
      .getByRole('button', {
        name: /place order/i
      });
  }

  upiModeSelector() {
    return this.paymentModal()
      .getByTestId('upi-mode-selector');
  }

  upiHelpButton() {
    return this.page.getByRole('button', {
      name: /UPI Help/i
    });
  }

  upiOptions() {
    return this.page
      .getByTestId('upi-ids')
      .locator('button');
  }

  payViaUpiButton() {
    return this.page.getByRole('button', {
      name: /Pay via UPI/i
    });
  }

  confirmCodButton() {
    return this.paymentModal()
      .getByRole('button', {
        name: /confirm cash on delivery/i
      });
  }

  // ============================================================
  // 🔹 PAYMENT SUCCESS
  // ============================================================
  paymentSuccessMessage() {
    return this.page.locator(
      'text=/Payment successful/i'
    );
  }

  orderConfirmedMessage() {
    return this.page.getByText(
      /order confirmed/i
    );
  }

  orderConfirmationStatus() {
    return this.page.getByRole('status');
  }

  // ============================================================
  // 🔹 ORDER CONFIRMATION PAGE
  // ============================================================
  orderConfirmationPage() {
    return this.page.getByTestId(
      'order-confirmation-page'
    );
  }

  orderSuccessSection() {
    return this.page.getByTestId(
      'order-success-section'
    );
  }

  paymentStatus() {
    return this.page.getByTestId(
      'payment-status'
    );
  }

  orderTitle() {
    return this.page.getByTestId(
      'order-title'
    );
  }

  orderTitleProductName() {
    return this.page.getByTestId(
      'order-title-productname'
    );
  }

  deliveryDate() {
    return this.page
      .getByTestId('delivery-info')
      .getByTestId('delivery-date');
  }

  orderItemName() {
    return this.page.getByTestId(
      'order-item-name'
    );
  }

  orderItemQuantity() {
    return this.page.getByTestId(
      'order-item-quantity'
    );
  }

  orderItemPrice() {
    return this.page.getByTestId(
      'order-item-price'
    );
  }

  shippingAddress() {
    return this.page.getByTestId(
      'shipping-address'
    );
  }

  contactPhone() {
    return this.page.getByTestId(
      'contact-phone'
    );
  }

  contactEmail() {
    return this.page.getByTestId(
      'contact-email'
    );
  }

  orderSummary() {
    return this.page.getByTestId(
      'order-summary'
    );
  }

  orderDateSummary() {
    return this.orderSummary()
      .getByTestId('order-date');
  }

  paymentMethodSummary() {
    return this.orderSummary()
      .getByTestId('payment-method');
  }

  orderStatusSummary() {
    return this.orderSummary()
      .getByTestId('order-status');
  }

  subtotalSummary() {
    return this.orderSummary()
      .getByTestId('subtotal');
  }

  totalPaidSummary() {
    return this.orderSummary()
      .getByTestId('total-paid');
  }

  // ============================================================
  // 🔹 ORDER DETAILS PAGE
  // ============================================================
  viewOrderDetailsButton() {
    return this.page.getByRole('button', {
      name: /view order details/i
    });
  }

  orderId() {
    return this.page.getByTestId(
      'order-id'
    );
  }

  orderDate() {
    return this.page.getByTestId(
      'order-date'
    );
  }

  orderStatus() {
    return this.page.getByTestId(
      'order-status'
    );
  }

  shippingPhone() {
    return this.page.getByTestId(
      'shipping-phone'
    );
  }

  shippingEmail() {
    return this.page.getByTestId(
      'shipping-email'
    );
  }

  paymentMethod() {
    return this.page.getByTestId(
      'payment-method'
    );
  }

  productNameDetails() {
    return this.page.getByTestId(
      'product-name'
    );
  }

  productQty() {
    return this.page.getByTestId(
      'product-qty'
    );
  }

  orderItemTotal() {
    return this.page.getByTestId(
      'order-item-total'
    );
  }

  subtotal() {
    return this.page.getByTestId(
      'subtotal'
    );
  }

  gst() {
    return this.page.getByTestId(
      'gst'
    );
  }

  orderTotal() {
    return this.page.getByTestId(
      'order-total'
    );
  }
}