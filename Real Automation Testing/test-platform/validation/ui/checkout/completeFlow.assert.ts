import { expect, type Page }
  from '@playwright/test';

export class CompleteFlowAssertions {

  // ============================================================
  // 🔹 UTIL
  // ============================================================
  static cleanPrice(
    text: string | null
  ) {

    return Number(
      text
        ?.replace(/[₹,]/g, '')
        .trim()
    );
  }

  static formatPrice(
    amount: number
  ) {

    return `₹${amount.toFixed(2)}`;
  }

  // ============================================================
  // 🔹 CHECKOUT VALIDATION
  // ============================================================
  static async expectCheckoutSummary(
    page: Page,
    data: {
      productName: string;
      productPrice: number;
      productQty: number;
      subtotal: number;
      shipping: number;
      gst: number;
      total: number;
    }
  ) {

    const summary =
      page.getByTestId(
        'checkout-order-summary'
      );

    await expect(summary)
      .toBeVisible();

    // =========================
    // PRODUCT NAME
    // =========================
    const summaryName =
      await summary
        .locator('h3')
        .innerText();

    expect(summaryName)
      .toContain(
        data.productName
      );

    // =========================
    // QUANTITY
    // =========================
    const qtyText =
      await page
        .getByTestId(
          'checkout-item-quantity'
        )
        .innerText();

    const qty =
      Number(
        qtyText.replace(/\D/g, '')
      );

    expect(qty)
      .toBe(
        data.productQty
      );

    // =========================
    // ITEM PRICE
    // =========================
    const itemPriceText =
      await page
        .getByTestId(
          'checkout-item-price'
        )
        .textContent();

    const itemPrice =
      this.cleanPrice(
        itemPriceText
      );

    expect(itemPrice)
      .toBe(
        data.productPrice
      );

    // =========================
    // SUBTOTAL
    // =========================
    const subtotalText =
      await page
        .getByTestId(
          'checkout-subtotal'
        )
        .textContent();

    const subtotal =
      this.cleanPrice(
        subtotalText
      );

    expect(subtotal)
      .toBe(
        data.subtotal
      );

    // =========================
    // SHIPPING
    // =========================
    const shippingText =
      await page
        .getByTestId(
          'checkout-shipping'
        )
        .textContent();

    if (
      data.shipping === 0
    ) {

      expect(
        shippingText
      ).toContain(
        'FREE'
      );

    } else {

      const shipping =
        this.cleanPrice(
          shippingText
        );

      expect(shipping)
        .toBe(
          data.shipping
        );
    }

    // =========================
    // GST
    // =========================
    const gstText =
      await page
        .getByTestId(
          'checkout-gst'
        )
        .textContent();

    const gst =
      this.cleanPrice(
        gstText
      );

    expect(gst)
      .toBe(
        data.gst
      );

    // =========================
    // TOTAL
    // =========================
    const totalText =
      await page
        .getByTestId(
          'checkout-total'
        )
        .textContent();

    const total =
      this.cleanPrice(
        totalText
      );

    expect(total)
      .toBe(
        data.total
      );
  }

  // ============================================================
  // 🔹 PAYMENT VALIDATION
  // ============================================================
  static async expectPaymentValidation(
    page: Page,
    paymentMethod: string
  ) {

    if (
      paymentMethod === 'CARD'
    ) {

      await expect(
        page.locator(
          'text=/Payment successful/i'
        )
      ).toBeVisible();
    }

    if (
      paymentMethod === 'UPI'
    ) {

      await expect(
        page.locator(
          'text=/Payment successful/i'
        )
      ).toBeVisible();
    }

    if (
      paymentMethod === 'COD'
    ) {

      await expect(
        page.getByText(
          /order confirmed/i
        )
      ).toBeVisible();
    }
  }

  // ============================================================
  // 🔹 CONFIRMATION PAGE
  // ============================================================
  static async expectConfirmationPage(
    page: Page,
    data: {
      productName: string;
      productQty: number;
      subtotal: number;
      total: number;
      paymentMethod: string;
    }
  ) {

    // =========================
    // PAGE
    // =========================
    await expect(
      page.getByTestId(
        'order-confirmation-page'
      )
    ).toBeVisible();

    await expect(
      page.getByTestId(
        'order-success-section'
      )
    ).toBeVisible();

    // =========================
    // PAYMENT STATUS
    // =========================
    if (
      data.paymentMethod === 'COD'
    ) {

      await expect(
        page.getByTestId(
          'payment-status'
        )
      ).toHaveText(
        /payment due/i
      );

    } else {

      await expect(
        page.getByTestId(
          'payment-status'
        )
      ).toHaveText(
        /payment confirmed/i
      );
    }

    // =========================
    // PRODUCT NAME
    // =========================
    await expect(
      page.getByTestId(
        'order-title-productname'
      )
    ).toContainText(
      data.productName
    );

    // =========================
    // QUANTITY
    // =========================
    await expect(
      page.getByTestId(
        'order-item-quantity'
      )
    ).toContainText(
      `${data.productQty}`
    );

    // =========================
    // SUBTOTAL
    // =========================
    await expect(
      page.getByTestId(
        'subtotal'
      )
    ).toContainText(
      this.formatPrice(
        data.subtotal
      )
    );

    // =========================
    // TOTAL
    // =========================
    await expect(
      page.getByTestId(
        'total-paid'
      )
    ).toContainText(
      this.formatPrice(
        data.total
      )
    );

    // =========================
    // PAYMENT METHOD
    // =========================
    await expect(
      page.getByTestId(
        'payment-method'
      )
    ).toContainText(
      data.paymentMethod
        .toLowerCase()
    );

    // =========================
    // DELIVERY DATE
    // =========================
    await expect(
      page
        .getByTestId(
          'delivery-info'
        )
        .getByTestId(
          'delivery-date'
        )
    ).toBeVisible();

    // =========================
    // SHIPPING
    // =========================
    await expect(
      page.getByTestId(
        'shipping-address'
      )
    ).toBeVisible();

    await expect(
      page.getByTestId(
        'contact-phone'
      )
    ).toBeVisible();

    await expect(
      page.getByTestId(
        'contact-email'
      )
    ).toBeVisible();
  }

  // ============================================================
  // 🔹 ORDER DETAILS PAGE
  // ============================================================
  static async expectOrderDetailsPage(
    page: Page,
    data: {
      productName: string;
      productQty: number;
      subtotal: number;
      gst: number;
      total: number;
      paymentMethod: string;
    }
  ) {

    // =========================
    // HEADER
    // =========================
    await expect(
      page.getByTestId(
        'order-id'
      )
    ).toBeVisible();

    await expect(
      page.getByTestId(
        'order-date'
      )
    ).toBeVisible();

    await expect(
      page.getByTestId(
        'order-status'
      )
    ).toBeVisible();

    // =========================
    // PRODUCT
    // =========================
    await expect(
      page.getByTestId(
        'product-name'
      )
    ).toContainText(
      data.productName
    );

    await expect(
      page.getByTestId(
        'product-qty'
      )
    ).toContainText(
      `${data.productQty}`
    );

    // =========================
    // PAYMENT
    // =========================
    await expect(
      page.getByTestId(
        'payment-method'
      )
    ).toContainText(
      data.paymentMethod
        .toLowerCase()
    );

    if (
      data.paymentMethod === 'COD'
    ) {

      await expect(
        page.getByTestId(
          'payment-status'
        )
      ).toContainText(
        /pending/i
      );

    } else {

      await expect(
        page.getByTestId(
          'payment-status'
        )
      ).toContainText(
        /paid/i
      );
    }

    // =========================
    // SHIPPING
    // =========================
    await expect(
      page.getByTestId(
        'shipping-address'
      )
    ).toBeVisible();

    await expect(
      page.getByTestId(
        'shipping-phone'
      )
    ).toBeVisible();

    await expect(
      page.getByTestId(
        'shipping-email'
      )
    ).toBeVisible();

    // =========================
    // FINANCIALS
    // =========================
    const subtotalText =
      await page
        .getByTestId(
          'subtotal'
        )
        .textContent();

    const subtotal =
      this.cleanPrice(
        subtotalText
      );

    expect(subtotal)
      .toBe(
        data.subtotal
      );

    const gstText =
      await page
        .getByTestId(
          'gst'
        )
        .textContent();

    const gst =
      this.cleanPrice(
        gstText
      );

    expect(gst)
      .toBe(
        data.gst
      );

    const totalText =
      await page
        .getByTestId(
          'order-total'
        )
        .textContent();

    const total =
      this.cleanPrice(
        totalText
      );

    expect(total)
      .toBe(
        data.total
      );
  }
}