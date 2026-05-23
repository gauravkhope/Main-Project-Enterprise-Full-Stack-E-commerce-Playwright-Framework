import { CompleteFlowPage }
  from '../../pages/checkout/completeFlow.page';

export class CompleteFlow {

  constructor(
    private completePage: CompleteFlowPage
  ) {}

  // ============================================================
  // 🔹 UTIL
  // ============================================================
  cleanPrice(
    text: string | null
  ) {

    return Number(
      text
        ?.replace(/[₹,]/g, '')
        .trim()
    );
  }

  formatPrice(
    amount: number
  ) {

    return `₹${amount.toFixed(2)}`;
  }

  // ============================================================
  // 🔹 RANDOM PRODUCT
  // ============================================================
  async selectRandomTrendingProduct() {

    const products =
      this.completePage.trendingProducts();

    const count =
      await products.count();

    const randomIndex =
      Math.floor(
        Math.random() * count
      );

    const product =
      products.nth(randomIndex);

    const productName =
      (
        await this.completePage
          .productName(product)
          .textContent()
      )?.trim();

    const productPriceText =
      await this.completePage
        .productPrice(product)
        .textContent();

    const productPrice =
      this.cleanPrice(
        productPriceText
      );

    await product.click();

    return {
      product,
      productName,
      productPrice
    };
  }

  // ============================================================
  // 🔹 PRODUCT DATA
  // ============================================================
  async getProductQuantity() {

    const qtyText =
      await this.completePage
        .quantitySelector()
        .textContent();

    return Number(qtyText);
  }

  async getProductFinancials(
    productPrice: number,
    productQty: number
  ) {

    const subtotal =
      productPrice * productQty;

    const shipping =
      subtotal >= 499
        ? 0
        : 99;

    const gst =
      Math.round(subtotal * 0.18);

    const total =
      subtotal + gst + shipping;

    return {
      subtotal,
      shipping,
      gst,
      total
    };
  }

  // ============================================================
  // 🔹 SHIPPING FORM
  // ============================================================
  async fillShippingDetails() {

    await this.completePage
      .addressInput()
      .fill(
        'Vile Parle BKC Road'
      );

    await this.completePage
      .cityInput()
      .fill('Mumbai');

    await this.completePage
      .stateInput()
      .fill(
        'Maharashtra'
      );

    await this.completePage
      .zipInput()
      .fill('400002');

    await this.completePage
      .phoneInput()
      .fill(
        '9689769664'
      );

    if (
      await this.completePage
        .emailInput()
        .count()
    ) {

      await this.completePage
        .emailInput()
        .fill(
          'gaurav@test.com'
        );
    }
  }

  // ============================================================
  // 🔹 PAYMENT METHOD
  // ============================================================
  async chooseRandomPaymentMethod() {

    const methods = [
      'CARD',
      'UPI',
      'COD'
    ];

    const method =
      methods[
        Math.floor(
          Math.random() *
          methods.length
        )
      ];

    if (method === 'CARD') {

      await this.completePage
        .cardPaymentButton()
        .click();

      await this.completePage
        .proceedToPaymentButton()
        .click();

      await this.completePage
        .cardNumberInput()
        .fill(
          '4246258264151111'
        );

      await this.completePage
        .cardExpiryInput()
        .fill('12/30');

      await this.completePage
        .cardCvvInput()
        .fill('101');

      await this.completePage
        .confirmCardButton()
        .click();

      await this.completePage
        .paymentSuccessMessage()
        .waitFor();
    }

    if (method === 'UPI') {

      await this.completePage
        .upiPaymentButton()
        .click();

      await this.completePage
        .proceedToPaymentButton()
        .click();

      await this.completePage
        .upiHelpButton()
        .click();

      const upiOptions =
        this.completePage
          .upiOptions();

      const count =
        await upiOptions.count();

      const randomIndex =
        Math.floor(
          Math.random() * count
        );

      await upiOptions
        .nth(randomIndex)
        .click();

      await this.completePage
        .payViaUpiButton()
        .click();

      await this.completePage
        .paymentSuccessMessage()
        .waitFor();
    }

    if (method === 'COD') {

      await this.completePage
        .codPaymentButton()
        .click();

      await this.completePage
        .proceedToCodButton()
        .click();

      await this.completePage
        .confirmCodButton()
        .click();

      await this.completePage
        .orderConfirmedMessage()
        .waitFor();
    }

    return method;
  }

  // ============================================================
  // 🔹 COMPLETE FLOW
  // ============================================================
  async executeCompleteFlow() {

    // =========================
    // HOME
    // =========================
    await this.completePage
      .gotoHomePage();

    // =========================
    // PRODUCT
    // =========================
    const {
      productName,
      productPrice
    } =
      await this
        .selectRandomTrendingProduct();

    const productQty =
      await this
        .getProductQuantity();

    await this.completePage
      .buyNowButton()
      .click();

    // =========================
    // CHECKOUT
    // =========================
    await this.completePage
      .waitForCheckoutPage();

    await this
      .fillShippingDetails();

    const financials =
      await this
        .getProductFinancials(
          productPrice,
          productQty
        );

    // =========================
    // PAYMENT
    // =========================
    const paymentMethod =
      await this
        .chooseRandomPaymentMethod();

    // =========================
    // CONFIRMATION
    // =========================
    await this.completePage
      .orderConfirmationPage()
      .waitFor();

    return {

      // PRODUCT
      productName,
      productPrice,
      productQty,

      // PAYMENT
      paymentMethod,

      // FINANCIALS
      ...financials
    };
  }
}