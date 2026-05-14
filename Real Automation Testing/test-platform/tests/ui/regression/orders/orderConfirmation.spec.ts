import { test } from '../../../../core/fixtures/auth.fixture';
import { OrderAssertions } from '../../../../validation/ui/orders/orderConfirmation.assert';

test.describe('Order Confirmation Tests', () => {

  test.only('1. Full Order Confirmation Page Validation', async ({ orderFlow, orderPage }) => {

    test.setTimeout(80000);

    const data = await orderFlow.completeOrderWithUPI();

    await OrderAssertions.expectOrderPageVisible(orderPage);
    await OrderAssertions.expectPaymentConfirmed(orderPage);

    await OrderAssertions.expectOrderTitle(orderPage, data.productName);

    await OrderAssertions.expectDeliveryDate(orderPage);

    await OrderAssertions.expectProductDetails(
      orderPage,
      data.productName,
      data.productPrice,
      data.productQty
    );

    await OrderAssertions.expectShippingDetails(
      orderPage,
      data.shipping
    );

    await OrderAssertions.expectOrderSummary(
      orderPage,
      data.productPrice
    );

    await OrderAssertions.expectActionButtons(orderPage);
  });

  test('2. View Order Details Button', async ({ orderFlow, orderPage }) => {

    await orderFlow.completeOrderWithUPI();

    await OrderAssertions.expectActionButtons(orderPage);

    await orderPage.clickViewOrderDetails();

    await OrderAssertions.expectOrderTrackingPage(orderPage);
  });

  test('3. Continue Shopping Button', async ({ orderFlow, orderPage }) => {

    await orderFlow.completeOrderWithUPI();

    await OrderAssertions.expectActionButtons(orderPage);

    await orderPage.clickContinueShopping();

    await OrderAssertions.expectProductsPage(orderPage);
  });

});