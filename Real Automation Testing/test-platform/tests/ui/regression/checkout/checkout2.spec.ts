import { test } from '../../../../core/fixtures/auth.fixture';
import { CheckoutAssertions } from '../../../../validation/ui/checkout/checkout.assert';

test.describe('Checkout2 - UPI & COD Tests', () => {

  test('1. UPI validation - empty input shows inline error', async ({ checkoutFlow, checkoutPage }) => {

    await checkoutFlow.openUPIPayment("Galaxy S25 ultra");

    await checkoutPage.selectUPIMode();

    await checkoutPage.payViaUPI(); // empty

    await CheckoutAssertions.expectUPIError(
      checkoutPage,
      /UPI ID is required/i
    );
  });

  test.only('2. UPI Payment - Random Token Success Flow', async ({ checkoutFlow, checkoutPage }) => {

    const data = await checkoutFlow.completeUPIPaymentWithToken("Galaxy S25 ultra");

    await CheckoutAssertions.expectPaymentSuccess(checkoutPage);
  });

  test('3. UPI Payment - Random Invalid UPI → Failure', async ({ checkoutFlow, checkoutPage }) => {

    await checkoutFlow.openUPIPayment("Galaxy S25 ultra");

    const invalidUPI = checkoutFlow.generateInvalidUPI();

    await checkoutPage.enterUPI(invalidUPI);
    await checkoutPage.payViaUPI();

    await CheckoutAssertions.expectUPIFailure(checkoutPage, invalidUPI);
  });

  test('4. UPI Payment - Invalid format (no @)', async ({ checkoutFlow, checkoutPage }) => {

    await checkoutFlow.openUPIPayment("Galaxy S25 ultra");

    const invalidUPI = checkoutFlow.generateInvalidUPINoAt();

    await checkoutPage.enterUPI(invalidUPI);
    await checkoutPage.payViaUPI();

    await CheckoutAssertions.expectUPIFormatError(checkoutPage);
  });

  test.only('5. COD flow - order placed successfully', async ({ checkoutFlow, checkoutPage }) => {

    await checkoutFlow.completeCODOrder("Galaxy S25 ultra");

    await CheckoutAssertions.expectCODSuccess(checkoutPage);
  });

});