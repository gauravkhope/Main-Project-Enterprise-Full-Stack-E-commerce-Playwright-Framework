import { test }from '../../../core/fixtures/auth.fixture';
import { CompleteFlowAssertions }from '../../../validation/ui/checkout/completeFlow.assert';

test.describe(
  'Complete E2E Flow',
  () => {

    test(
      'Product → Checkout → Payment → Confirmation → Order Details',

      async ({
        completeFlow,
        completeFlowPage
      }) => {

        const page =
          completeFlowPage.page;

        // ============================================================
        // 🔹 COMPLETE FLOW
        // ============================================================
        const flowData =
          await completeFlow
            .executeCompleteFlow();

        if (!flowData.productName) {
          throw new Error(
            'Complete flow did not return productName'
          );
        }

        const productName =
          flowData.productName;

        // ============================================================
        // 🔹 CHECKOUT VALIDATION
        // ============================================================
        await CompleteFlowAssertions
          .expectCheckoutSummary(
            page,
            {
              productName:
                productName,

              productPrice:
                flowData.productPrice,

              productQty:
                flowData.productQty,

              subtotal:
                flowData.subtotal,

              shipping:
                flowData.shipping,

              gst:
                flowData.gst,

              total:
                flowData.total
            }
          );

        // ============================================================
        // 🔹 PAYMENT VALIDATION
        // ============================================================
        await CompleteFlowAssertions
          .expectPaymentValidation(
            page,
            flowData.paymentMethod
          );

        // ============================================================
        // 🔹 CONFIRMATION PAGE
        // ============================================================
        await CompleteFlowAssertions
          .expectConfirmationPage(
            page,
            {
              productName:
                productName,

              productQty:
                flowData.productQty,

              subtotal:
                flowData.subtotal,

              total:
                flowData.total,

              paymentMethod:
                flowData.paymentMethod
            }
          );

        // ============================================================
        // 🔹 ORDER DETAILS PAGE
        // ============================================================
        await completeFlowPage
          .viewOrderDetailsButton()
          .click();

        await completeFlowPage
          .waitForOrderDetailsPage();

        await CompleteFlowAssertions
          .expectOrderDetailsPage(
            page,
            {
              productName:
                productName,

              productQty:
                flowData.productQty,

              subtotal:
                flowData.subtotal,

              gst:
                flowData.gst,

              total:
                flowData.total,

              paymentMethod:
                flowData.paymentMethod
            }
          );
      }
    );
  }
);