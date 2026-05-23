import { CheckoutPage } from '../../pages/checkout/checkout.page';

export class CheckoutFlow {
  constructor(private checkoutPage: CheckoutPage) {}

  async goToCheckout(productName: string) {
    await this.checkoutPage.gotoHome();

    const product = this.checkoutPage.getProduct(productName);
    await product.click();

    await this.checkoutPage.clickBuyNow();
  }

  async openPayment(productName: string) {
    await this.goToCheckout(productName);
    await this.checkoutPage.fillShipping();
    await this.checkoutPage.proceedToPayment();
  }

  generateRandomCard() {
    const number = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');

    const cvv = Math.floor(100 + Math.random() * 900).toString();

    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const year = String(26 + Math.floor(Math.random() * 5));

    return { number, cvv, expiry: `${month}/${year}` };
  }

  generateMismatchedCard() {
    const number = "4624893621784242";

    const cvv = Math.floor(100 + Math.random() * 900).toString();

    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const year = String(26 + Math.floor(Math.random() * 5));

    return { number, cvv, expiry: `${month}/${year}` };
  }

  async completeValidPayment(productName: string) {
    // await this.openPayment(productName);
       if (productName) {
        await this.openPayment(productName);
    }

    const modal = this.checkoutPage.modal();

    await modal.getByRole('button', { name: /Test Tokens/i }).click();

    const tokens = modal.getByTestId('card-token');
    const count = await tokens.count();

    const randomIndex = Math.floor(Math.random() * count);
    const randomToken = tokens.nth(randomIndex);

    const last4 = await randomToken.locator('span').first().innerText();
    const cvvText = await randomToken.locator('span').last().innerText();
    const cvv = cvvText.replace('CVV ', '').trim();

    const first12 = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');

    const card = first12 + last4;

    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const year = String(26 + Math.floor(Math.random() * 10));

    await this.checkoutPage.fillCard(card, cvv, `${month}${year}`);
    await this.checkoutPage.confirmCard();
    await this.checkoutPage.placedOrder();


    return { last4 };
  }

  async fixWithValidToken() {
    const modal = this.checkoutPage.modal();

    await modal.getByRole('button', { name: /Test Tokens/i }).click();

    const tokens = modal.getByTestId('card-token');
    const count = await tokens.count();

    const randomIndex = Math.floor(Math.random() * count);
    const randomToken = tokens.nth(randomIndex);

    const last4 = await randomToken.locator('span').first().innerText();
    const cvvText = await randomToken.locator('span').last().innerText();
    const cvv = cvvText.replace('CVV ', '').trim();

    const first12 = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');

    const validCard = first12 + last4;

    await this.checkoutPage.fillCard('', '', '');

    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const year = String(26 + Math.floor(Math.random() * 5));

    await this.checkoutPage.fillCard(validCard, cvv, `${month}${year}`);
    await this.checkoutPage.confirmCard();

    return { last4 };
  }
  async openUPIPayment(productName: string) {
  await this.goToCheckout(productName);

  await this.checkoutPage.fillShipping();

  const payment = this.checkoutPage.page.getByTestId('payment-method');
  await payment.getByRole('button', { name: /UPI/i }).click();

  await this.checkoutPage.proceedToPayment();
}

generateInvalidUPI() {
  const str = Math.random().toString(36).substring(2, 10);
  return `${str}@upi`;
}

generateInvalidUPINoAt() {
  const str = Math.random().toString(36).substring(2, 10);
  return `${str}upi`;
}

async completeUPIPaymentWithToken(productName: string) {
  await this.openUPIPayment(productName);

  const modal = this.checkoutPage.modal();

  await modal.getByRole('button', { name: /UPI Help/i }).click();

  const options = modal.getByTestId('upi-ids').locator('button');
  const count = await options.count();

  const index = Math.floor(Math.random() * count);
  const selected = options.nth(index);

  const upi = await selected.innerText();

  await selected.click();

  await this.checkoutPage.payViaUPI();

  return { upi };
}

async completeCODOrder(productName: string) {
  await this.goToCheckout(productName);

  await this.checkoutPage.fillShipping();

  const payment = this.checkoutPage.page.getByTestId('payment-method');

  await payment.getByRole('button', { name: /Cash On Delivery/i }).click();

  await this.checkoutPage.page
    .getByRole('button', { name: /Proceed to COD/i })
    .click();

  const modal = this.checkoutPage.modal();

  await modal.getByRole('button', {
    name: /Confirm Cash on Delivery Order/i
  }).click();
}
}