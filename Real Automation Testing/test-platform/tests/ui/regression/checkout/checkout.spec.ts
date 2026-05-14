import { test } from '../../../../core/fixtures/auth.fixture';
import { CheckoutAssertions } from '../../../../validation/ui/checkout/checkout.assert';

test.describe('Checkout Tests (Auth Scoped)', () => {

  test.only('1. Navigate from Home → PDP → Checkout', async ({ checkoutFlow, checkoutPage }) => {

    await checkoutFlow.goToCheckout("Galaxy S25 ultra");

    await CheckoutAssertions.expectCheckoutPage(checkoutPage);
  });

  test('2. Checkout validation - empty form shows toast', async ({ checkoutFlow, checkoutPage }) => {

    await checkoutFlow.goToCheckout("Galaxy S25 ultra");

    await checkoutPage.proceedToPayment();

    await CheckoutAssertions.expectToast(
      checkoutPage,
      /Please fill in all shipping fields/i
    );
  });

  test('3. Checkout valid form → opens payment modal', async ({ checkoutFlow, checkoutPage }) => {

    await checkoutFlow.openPayment("Galaxy S25 ultra");

    await CheckoutAssertions.expectPaymentModal(checkoutPage);
  });

  test('4. Card validation - empty fields show errors', async ({ checkoutFlow, checkoutPage }) => {

    await checkoutFlow.openPayment("Galaxy S25 ultra");

    await checkoutPage.confirmEmptyCard();

    await CheckoutAssertions.expectCardErrors(checkoutPage);
  });

  test('5. Card validation - random invalid card shows error', async ({ checkoutFlow, checkoutPage }) => {

    await checkoutFlow.openPayment("Galaxy S25 ultra");

    const card = checkoutFlow.generateRandomCard();

    await checkoutPage.fillCard(card.number, card.cvv, card.expiry);
    await checkoutPage.confirmCard();

    await CheckoutAssertions.expectCardError(
      checkoutPage,
      /Invalid demo card/i
    );
  });

  test('6. Card validation - mismatched CVV shows error', async ({ checkoutFlow, checkoutPage }) => {

    await checkoutFlow.openPayment("Galaxy S25 ultra");

    const card = checkoutFlow.generateMismatchedCard();

    await checkoutPage.fillCard(card.number, card.cvv, card.expiry);
    await checkoutPage.confirmCard();

    await CheckoutAssertions.expectCardError(
      checkoutPage,
      /CVV does not match this demo card/i
    );
  });

  test.skip('7. Valid card → payment confirmed → place order → success', async ({ checkoutFlow, checkoutPage }) => {

    test.setTimeout(60000); // same as original

    const data = await checkoutFlow.completeValidPayment("Galaxy Fold 7");
    await CheckoutAssertions.expectPaymentConfirmed(
      checkoutPage,
      data.last4
    );

    await CheckoutAssertions.expectOrderSuccess(checkoutPage);
  });

  test('8. Cancel button closes payment modal', async ({ checkoutFlow, checkoutPage }) => {

    await checkoutFlow.openPayment("Galaxy S25 ultra");

    await checkoutPage.cancelPayment();

    await CheckoutAssertions.expectModalClosed(checkoutPage);
  });

  test('9. Recovery flow - invalid card → fix → success', async ({ checkoutFlow, checkoutPage }) => {

    test.setTimeout(60000); // same as original

    await checkoutFlow.openPayment("Galaxy S25 ultra");

    // Step 1: Invalid card (same logic)
    await checkoutPage.fillCard('1111222233339999', '123', '1228');
    await checkoutPage.confirmCard();

    await CheckoutAssertions.expectCardError(
      checkoutPage,
      /Invalid demo card/i
    );

    // Step 2: Fix using valid token (same logic)
    const data = await checkoutFlow.fixWithValidToken();

    // Step 3: Success validation
    await CheckoutAssertions.expectPaymentConfirmed(
      checkoutPage,
      data.last4
    );
  });

});