import { test } from '../../../../core/fixtures/auth.fixture';
import { OrderCancelAssertions }from '../../../../validation/ui/orders/orderCancel.assert';
import { authStoragePath, ensureAuthStorageDir, hasUsableAuthStorage } from '../../../../core/auth/authStorage';
import { performLogin } from '../../../../core/auth/loginHelper';
import type { Browser } from '@playwright/test';
import { hours }from '../../../../core/utils/time.util';

async function ensureAuthState(browser: Browser): Promise<void> {
  ensureAuthStorageDir();

  if (hasUsableAuthStorage()) {
    return;
  }

  const setupContext = await browser.newContext();
  const page = await setupContext.newPage();

  await performLogin(page);
  await setupContext.storageState({ path: authStoragePath });
  await setupContext.close();
}

test.describe('Order Cancel Suite', () => {   

  // =========================
  // 1. Cancel Validation
  // =========================
  test('1. Cancel Order - UI + Tracking + Button Validation',

    async ({ orderCancelPage, orderCancelFlow }) => {

      await orderCancelPage.openOrdersPage();

      await orderCancelFlow.openProcessingOrderAndSave();

      await orderCancelFlow.cancelOrder();

      const page = orderCancelPage.page;

      await OrderCancelAssertions.expectCancelled(page);

      await OrderCancelAssertions.expectCancelTracking(page);

      await OrderCancelAssertions.expectInactiveSteps(page);

      await OrderCancelAssertions.expectCancelButtonHidden(page);
    }
  );

  // =========================
  // 2. Icon Validation
  // =========================
  test.only('2. Cancel Order - icon and color validation',async ({ orderCancelPage, orderCancelFlow }) => {

      await orderCancelPage.openOrdersPage();

      await orderCancelFlow.openCancelledOrderAndSave();

      const page = orderCancelPage.page;

      await OrderCancelAssertions.expectCancelled(page);

      await OrderCancelAssertions.expectGreenCheck(
        page,
        'order-placed'
      );
     await OrderCancelAssertions.expectRefund(page);
      await OrderCancelAssertions.expectCancelTracking(page);

      await OrderCancelAssertions.expectInactiveSteps(page);

      await OrderCancelAssertions.expectCancelButtonHidden(page);
    }
  );

  // =========================
  // 3. +12h Packed Cancel
  // =========================
  test('3. +12h Packed → Cancel → Reset Tracking', async ({ browser }) => {
    
      await ensureAuthState(browser);
      const context = await browser.newContext({
        storageState: authStoragePath
      });

      await context.addInitScript((t) => {
        (window as any).__TEST_NOW__ = t;
      }, Date.now() + hours(12));

      const page = await context.newPage();

      const orderCancelPage =
        new (await import('../../../../ui/pages/orders/orderCancel.page'))
          .OrderCancelPage(page);

      const orderCancelFlow =
        new (await import('../../../../ui/flows/orders/orderCancel.flow'))
          .OrderCancelFlow(orderCancelPage);

      await orderCancelPage.openOrdersPage();

      await orderCancelFlow.openProcessingOrderAndSave();

      await OrderCancelAssertions.expectPackedState(page);

      await orderCancelFlow.cancelOrder();

      await OrderCancelAssertions.expectCancelled(page);

      await OrderCancelAssertions.expectCancelTracking(page);

      await OrderCancelAssertions.expectInactiveSteps(page);

      await context.close();
    }
  );

  // =========================
  // 4. +24h Shipped Cancel
  // =========================
  test('4. +24h Shipped → Cancel → Payment Refund',async ({ browser }) => {
    
      await ensureAuthState(browser);
      const context = await browser.newContext({
        storageState: authStoragePath
      });

      await context.addInitScript((t) => {
        (window as any).__TEST_NOW__ = t;
      }, Date.now() + hours(24));

      const page = await context.newPage();

      const orderCancelPage =
        new (await import('../../../../ui/pages/orders/orderCancel.page'))
          .OrderCancelPage(page);

      const orderCancelFlow =
        new (await import('../../../../ui/flows/orders/orderCancel.flow'))
          .OrderCancelFlow(orderCancelPage);

      await orderCancelPage.openOrdersPage();

      await orderCancelFlow.openProcessingOrderAndSave();

      await OrderCancelAssertions.expectShippedState(page);

      await OrderCancelAssertions.expectGreenCheck(
        page,
        'order-placed'
      );

      await OrderCancelAssertions.expectGreenCheck(
        page,
        'order-packed'
      );

      await OrderCancelAssertions.expectGreenCheck(
        page,
        'order-shipped'
      );

      await OrderCancelAssertions.expectPaid(page);

      await orderCancelFlow.cancelOrder();

      await OrderCancelAssertions.expectCancelled(page);

      await OrderCancelAssertions.expectRefund(page);

      await OrderCancelAssertions.expectCancelButtonHidden(page);

      await context.close();
    }
  );

});