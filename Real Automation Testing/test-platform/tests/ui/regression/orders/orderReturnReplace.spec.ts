import { test } from '../../../../core/fixtures/auth.fixture';

import {
  OrderReturnReplaceAssertions
} from '../../../../validation/ui/orders/orderReturnReplace.assert';

test.describe('Order Return & Replace Suite', () => {

  test('Return Flow Validation',async ({orderReturnReplacePage, orderReturnReplaceFlow}) => {

      await orderReturnReplacePage.openOrdersPage();

      await orderReturnReplaceFlow
        .openCompletedOrderAndSave();

      await orderReturnReplaceFlow
        .clearReturnIfExists();

      await OrderReturnReplaceAssertions
        .expectDelivered(
          orderReturnReplacePage.page
        );

      await orderReturnReplacePage.submitReturn(
        'Damaged product'
      );

      await OrderReturnReplaceAssertions
        .expectReturnRequested(
          orderReturnReplacePage.page
        );

      await OrderReturnReplaceAssertions
        .expectReturnButtonHidden(
          orderReturnReplacePage.page
        );

      await orderReturnReplacePage
        .returnCancelButton()
        .click();

      await OrderReturnReplaceAssertions
        .expectReturnCancelled(
          orderReturnReplacePage.page
        );
    }
  );

  test('Replace Flow Validation', async ({orderReturnReplacePage,orderReturnReplaceFlow}) => {

      await orderReturnReplacePage.openOrdersPage();

      await orderReturnReplaceFlow
        .openCompletedOrderAndSave();

      await orderReturnReplaceFlow
        .clearReplaceIfExists();

      await OrderReturnReplaceAssertions
        .expectDelivered(
          orderReturnReplacePage.page
        );

      await orderReturnReplacePage.submitReplace(
        'Damaged product'
      );

      await OrderReturnReplaceAssertions
        .expectReplaceRequested(
          orderReturnReplacePage.page
        );

      await OrderReturnReplaceAssertions
        .expectReplaceButtonHidden(
          orderReturnReplacePage.page
        );

      await orderReturnReplacePage
        .replaceCancelButton()
        .click();

      await OrderReturnReplaceAssertions
        .expectReplaceCancelled(
          orderReturnReplacePage.page
        );
    }
  );

  test('Invalid reason validation',async ({orderReturnReplacePage, orderReturnReplaceFlow}) => {

      await orderReturnReplacePage.openOrdersPage();

      await orderReturnReplaceFlow
        .openCompletedOrderAndSave();

      await orderReturnReplacePage
        .returnButton()
        .click();

      await orderReturnReplacePage
        .textarea()
        .fill('ABC');

      await orderReturnReplacePage
        .submitButton()
        .click();

      await OrderReturnReplaceAssertions
        .expectValidationToast(
          orderReturnReplacePage.page
        );
    }
  );

});