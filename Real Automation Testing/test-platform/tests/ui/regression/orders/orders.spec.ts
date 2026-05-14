import { test, expect } from '../../../../core/fixtures/auth.fixture';
import { OrdersAssertions } from '../../../../validation/ui/orders/orders.assert';
import { hours } from '../../../../core/utils/time.util';
import { performLogin } from '../../../../core/auth/loginHelper';
import { authStoragePath, ensureAuthStorageDir, hasUsableAuthStorage } from '../../../../core/auth/authStorage';
import type { Browser, Page } from '@playwright/test';
import { getOrderByStatusAndSave, getOrderById } from '../../../../helpers/orders.helper';

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

// moved helpers to ../../../../../../../helpers/orders.helper

test.describe('Orders Suite (Auth Scoped)', () => {

  // =========================
  // 1. Orders Navigation
  // =========================
  test('1. Orders Validation', async ({ ordersFlow, ordersPage }) => {

    await ordersFlow.navigateToOrders();

    await OrdersAssertions.expectOrdersPage(ordersPage);

    await ordersPage.page.waitForTimeout(3000);
  });

  // =========================
  // 2. Order Card Detailed Validation
  // =========================
  test('2. Order card detailed validation', async ({ ordersFlow, ordersPage }) => {

    test.setTimeout(60000);

    await ordersFlow.navigateToOrders();

    await expect(ordersPage.page.getByText("My Orders")).toBeVisible();

    const orderCards = ordersPage.orderCards();
    const orderCount = await orderCards.count();

    console.log("Total Orders:", orderCount);

    await OrdersAssertions.expectOrderCount(orderCount);

    const firstOrder = ordersPage.page.getByTestId(`order-card-${orderCount - 1}`);

    const data = {
      id: await firstOrder.getByTestId("order-id").textContent(),
      date: await firstOrder.getByTestId("order-date").textContent(),
      price: await firstOrder.getByTestId("order-price").textContent(),
      address: await firstOrder.getByTestId("order-address").textContent(),
      status: await firstOrder.getByTestId("order-status").textContent(),
      total: await firstOrder.getByTestId("order-price").textContent(),
    };

    await OrdersAssertions.expectOrderCardData(data);
  });

  // =========================
  // 3. Lifecycle Processing → Completed (2 contexts)
  // =========================
  test('3. Order lifecycle: Processing → Completed using time control', async ({ browser }) => {

    test.setTimeout(120000);
    await ensureAuthState(browser);

    // CURRENT TIME
    const context1 = await browser.newContext({
      storageState: authStoragePath
    });
    const page1 = await context1.newPage();

    await page1.goto('/');
    await page1.getByTestId("navbar-hamburger").click();
    const drawer1 = page1.getByTestId("side-drawer");

    await drawer1.getByText("MY PROFILE").click();
    await drawer1.getByText("Orders").click();

    const order1 = page1.locator('[data-testid^="order-card-"]').first();
    const status1 = order1.getByTestId('order-status');

    await OrdersAssertions.expectProcessing(status1);

    await context1.close();

    // FUTURE TIME (+48h)
    const context2 = await browser.newContext({
      storageState: authStoragePath
    });

    await context2.addInitScript((t) => {
      (window as any).__TEST_NOW__ = t;
    }, Date.now() + hours(48));

    const page2 = await context2.newPage();

    await page2.goto('/');
    await page2.getByTestId("navbar-hamburger").click();
    const drawer2 = page2.getByTestId("side-drawer");

    await drawer2.getByText("MY PROFILE").click();
    await drawer2.getByText("Orders").click();

    const order2 = page2.locator('[data-testid^="order-card-"]').first();
    const status2 = order2.getByTestId('order-status');

    await OrdersAssertions.expectCompleted(status2);

    await context2.close();
  });

  // =========================
  // 4. Order Details Full Validation
  // =========================
  test('4. Order Details Page - Full Validation', async ({ ordersFlow, ordersPage }) => {

    test.setTimeout(120000);

    await ordersFlow.navigateToOrders();

    await ordersPage.openFirstOrderDetails();

    await ordersPage.page.waitForTimeout(3000);

    const page = ordersPage.page;

    await OrdersAssertions.expectOrderDetailsPage(page);

    const statusText = await OrdersAssertions.expectStatusValidation(page);

    await OrdersAssertions.expectTracking(page);
    await OrdersAssertions.expectShipping(page);
    await OrdersAssertions.expectPayment(page);
    await OrdersAssertions.expectProduct(page);
    await OrdersAssertions.expectSummary(page);
    await OrdersAssertions.expectButtons(page, statusText);
  });

  // =========================
  // 5. Order Detailed Page (Reload with future time)
  // =========================
  test('5. Order detailed page (time reload)', async ({ browser }) => {

    test.setTimeout(120000);
    await ensureAuthState(browser);

    const context = await browser.newContext({
      storageState: authStoragePath
    });

    await context.addInitScript((t) => {
      (window as any).__TEST_NOW__ = t;
    }, Date.now() + hours(48));

    const page = await context.newPage();

    await page.goto('/');
    await page.getByTestId("navbar-hamburger").click();
    const drawer = page.getByTestId("side-drawer");

    await drawer.getByText("MY PROFILE").click();
    await drawer.getByText("Orders").click();

    const order = page.locator('[data-testid^="order-card-"]').first();

    await order.getByRole('button', { name: /view order details/i }).click();

    await page.waitForTimeout(3000);

    await context.close();
  });

  // =========================
  // 6. Full Lifecycle (12h / 24h / 48h)
  // =========================
  test.only('6. Full lifecycle validation (multi-step time)', async ({ browser }) => {

    test.setTimeout(240000);
    await ensureAuthState(browser);

    let savedOrderId: string | null = null;

    const openWithTime = async (time: number) => {
      const context = await browser.newContext({
        storageState: authStoragePath
      });

      await context.addInitScript((t) => {
        (window as any).__TEST_NOW__ = t;
      }, time);

      const page = await context.newPage();

      await page.goto('/');
      await page.getByTestId("navbar-hamburger").click();
      const drawer = page.getByTestId("side-drawer");

      await drawer.getByText("MY PROFILE").click();
      await drawer.getByText("Orders").click();

      let order, orderId;

      // First time: filter by "Processing" and save the order details
      if (!savedOrderId) {
        const result = await getOrderByStatusAndSave(page, 'Processing');
        order = result.order;
        orderId = result.orderId;
        savedOrderId = orderId;

      } else {
        // Subsequent times: fetch by saved order ID
        order = getOrderById(page, savedOrderId);
        orderId = savedOrderId;
      }

      await Promise.all([
        page.waitForURL(/\/orders\/\d+$/),
        order.getByRole('button', { name: /view order details/i }).click()
      ]);

      return { page, context, orderId };
    };

    // STEP 1 → NOW
    let { page, context, orderId } = await openWithTime(Date.now());
    await expect(page.getByTestId('order-status')).toHaveText("Order Placed");
    await context.close();

    // STEP 2 → +12h
    ({ page, context, orderId } = await openWithTime(Date.now() + hours(12)));
    await expect(page.getByTestId('order-status')).toBeVisible();
    await context.close();

    // STEP 3 → +24h
    ({ page, context, orderId } = await openWithTime(Date.now() + hours(24)));
    await expect(page.getByTestId('order-status')).toBeVisible();
    await context.close();

    // STEP 4 → +48h
    ({ page, context, orderId } = await openWithTime(Date.now() + hours(48)));
    await expect(page.getByTestId('order-status')).toHaveText("Delivered");
    await context.close();
  });

});