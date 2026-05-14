import { test, expect} from '@playwright/test';

// Extend the Window interface to include __TEST_NOW__ for TypeScript
declare global {
  interface Window {
    __TEST_NOW__?: number;
  }
}

let storageState: any;

// 🔐 LOGIN ONCE
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
test.setTimeout(60000);
  await page.goto("/");

  await page.getByTestId("navbar-hamburger").click();
  await page.getByTestId("side-drawer").getByText("Log In").click();

  await page.getByPlaceholder("you@example.com")
    .fill("gauravkhope31@gmail.com");

  await page.locator("#password")
    .fill("SmartShopGAURAV31");

  await page.getByLabel("Remember me").check();

  await page.getByRole("button", { name: "Sign In" }).click();

  await page.waitForURL('/');

  // Save session
  storageState = await context.storageState();

  await context.close();
});

test('Orders Validation', async ({ browser  }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // =========================
  // 1. GO TO HOME
  // =========================
  await page.goto('/');
   await page.getByTestId("navbar-hamburger").click();
     await page.getByTestId("side-drawer").getByText("MY PROFILE").click();
     await page.getByTestId("side-drawer").getByText("Orders").click();
     await expect(page).toHaveURL('/orders');
await page.waitForTimeout(3000);

});

test("order card detailed validation", async ({ browser }) => {
test.setTimeout(60000);
  const context = await browser.newContext({ storageState });
  const page = await context.newPage(); 

await page.goto('/');
   await page.getByTestId("navbar-hamburger").click();
     await page.getByTestId("side-drawer").getByText("MY PROFILE").click();
     await page.getByTestId("side-drawer").getByText("Orders").click();
     await page.waitForTimeout(3000);
     await expect(page.getByText("My Orders")).toBeVisible();
     const orderCards = page.locator('[data-testid^="order-card-"]');
     const orderCount = await orderCards.count();
     console.log("Total Orders:", orderCount);
      expect(orderCount).toBeGreaterThan(0);
      const firstOrder = page.getByTestId(`order-card-${orderCount - 1}`);
      const orderId = await firstOrder.getByTestId("order-id").textContent();
      const orderDate = await firstOrder.getByTestId("order-date").textContent();
      const orderPrice = await firstOrder.getByTestId("order-price").textContent();
      const orderAddress = await firstOrder.getByTestId("order-address").textContent();
      const orderStatus = await firstOrder.getByTestId("order-status").textContent();
      const orderTotal = await firstOrder.getByTestId("order-price").textContent();
      expect(orderId).toBeTruthy();
      expect(orderStatus).toBeTruthy();
      expect(orderTotal).toBeTruthy();
      expect(orderDate).toBeTruthy();
      expect(orderPrice).toBeTruthy();
      expect(orderAddress).toBeTruthy();


});


test('Order lifecycle: Processing → Completed using time control', async ({ browser }) => {
  test.setTimeout(120000);

  // =========================
  // 🔹 STEP 1: NORMAL TIME (PROCESSING)
  // =========================
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();

  // Login
  await page1.goto('/');

  await page1.getByTestId("navbar-hamburger").click();
  await page1.getByTestId("side-drawer").getByText("Log In").click();

  await page1.getByPlaceholder("you@example.com")
    .fill("gauravkhope31@gmail.com");

  await page1.locator("#password")
    .fill("SmartShopGAURAV31");

  await page1.getByLabel("Remember me").check();
  await page1.getByRole("button", { name: "Sign In" }).click();

  // Navigate to Orders
  await page1.getByTestId("navbar-hamburger").click();
  const drawer1 = page1.getByTestId("side-drawer");
  await expect(drawer1).toBeVisible();

  await drawer1.getByText("MY PROFILE").click();
  await expect(drawer1.getByText("Orders")).toBeVisible();
  await drawer1.getByText("Orders").click();

  await expect(page1).toHaveURL(/orders/);

  // Validate Processing
  const order1 = page1.locator('[data-testid^="order-card-"]').first();
  const status1 = order1.getByTestId('order-status');

  await expect(order1).toBeVisible();
  await expect(status1).toHaveText('Processing');

  // Save order number (optional debug)
  const orderIdText = await order1.getByTestId('order-id').textContent();
  console.log('Order:', orderIdText);

  await context1.close();

  // =========================
  // 🔹 STEP 2: FUTURE TIME (+2 DAYS → COMPLETED)
  // =========================
  const context2 = await browser.newContext();

  // 🔥 Inject test time BEFORE page load
  await context2.addInitScript(() => {
    window.__TEST_NOW__ = Date.now() + 2 * 24 * 60 * 60 * 1000;
  });

  const page2 = await context2.newPage();

  // Login again
  await page2.goto('/');

  await page2.getByTestId("navbar-hamburger").click();
  await page2.getByTestId("side-drawer").getByText("Log In").click();

  await page2.getByPlaceholder("you@example.com")
    .fill("gauravkhope31@gmail.com");

  await page2.locator("#password")
    .fill("SmartShopGAURAV31");

  await page2.getByLabel("Remember me").check();
  await page2.getByRole("button", { name: "Sign In" }).click();

  // Navigate to Orders
  await page2.getByTestId("navbar-hamburger").click();
  const drawer2 = page2.getByTestId("side-drawer");

  await expect(drawer2).toBeVisible();

  await drawer2.getByText("MY PROFILE").click();
  await expect(drawer2.getByText("Orders")).toBeVisible();
  await drawer2.getByText("Orders").click();

  await expect(page2).toHaveURL(/orders/);

  // Validate Completed
  const order2 = page2.locator('[data-testid^="order-card-"]').first();
  const status2 = order2.getByTestId('order-status');

  await expect(order2).toBeVisible();
  await expect(status2).toHaveText('Completed');

  await context2.close();
});



test('Order Details Page - Full Validation', async ({ browser  }) => {
test.setTimeout(120000);
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // =========================
  // 1. GO TO HOME
  // =========================
  await page.goto('/');
   await page.getByTestId("navbar-hamburger").click();
     await page.getByTestId("side-drawer").getByText("MY PROFILE").click();
     await page.getByTestId("side-drawer").getByText("Orders").click();
  const order1 = page.locator('[data-testid^="order-card-"]').first().getByRole('button', { name: /View Order Details/i });
  await order1.click();
 await page.waitForTimeout(3000);
  // =========================
  // 🔹 STEP 1: Navigate
  // =========================

  // =========================
  // 🔹 STEP 2: HEADER VALIDATION
  // =========================
  const orderId = page.getByTestId('order-id');
  const orderDate = page.getByTestId('order-date');

  await expect(orderId).toBeVisible();
  await expect(orderId).toContainText('Order #');

  await expect(orderDate).toBeVisible();

  // =========================
  // 🔹 STEP 3: STATUS VALIDATION
  // =========================
  const status = page.getByTestId('order-status');

  await expect(status).toBeVisible();

  const statusText = await status.textContent();

  expect(statusText).toMatch(/Order Placed|Order Packed|Shipped|Delivered|Cancelled/);

  // =========================
  // 🔹 STEP 4: TRACKING VALIDATION
  // =========================
  await expect(page.getByTestId('tracking-step-order-placed')).toBeVisible();
  await expect(page.getByTestId('tracking-step-order-packed')).toBeVisible();
  await expect(page.getByTestId('tracking-step-order-shipped')).toBeVisible();
  await expect(page.getByTestId('tracking-step-order-delivered')).toBeVisible();

  // =========================
  // 🔹 STEP 5: SHIPPING VALIDATION
  // =========================
  const address = page.getByTestId('shipping-address');
  const phone = page.getByTestId('shipping-phone');
  const email = page.getByTestId('shipping-email');

  await expect(address).toBeVisible();
  await expect(address).toContainText('India');

  await expect(phone).toBeVisible();
  await expect(email).toBeVisible();

  // =========================
  // 🔹 STEP 6: PAYMENT VALIDATION
  // =========================
  const paymentMethod = page.getByTestId('payment-method');
  const paymentStatus = page.getByTestId('payment-status');
  const paymentAmount = page.getByTestId('payment-amount');

  await expect(paymentMethod).toBeVisible();
  // await expect(paymentMethod).toHaveText(/COD|UPI|Card/);

  await expect(paymentStatus).toBeVisible();
  // await expect(paymentStatus).toHaveText(/PAID|PENDING/);

  await expect(paymentAmount).toBeVisible();

  // =========================
  // 🔹 STEP 7: PRODUCT VALIDATION
  // =========================
  const productName = page.getByTestId('product-name');
  const productQty = page.getByTestId('product-qty');
  const productPrice = page.getByTestId('product-price');

  await expect(productName).toBeVisible();
  await expect(productQty).toBeVisible();
  await expect(productPrice).toBeVisible();

  // =========================
  // 🔹 STEP 8: ORDER SUMMARY VALIDATION
  // =========================
  const subtotal = page.getByTestId('subtotal');
  const gst = page.getByTestId('gst');
  const total = page.getByTestId('order-total');

  await expect(subtotal).toBeVisible();
  await expect(gst).toBeVisible();
  await expect(total).toBeVisible();

  // =========================
  // 🔹 STEP 9: PRICE CALCULATION VALIDATION (ADVANCED)
  // =========================
  const subtotalText = await subtotal.textContent();
  const gstText = await gst.textContent();
  const totalText = await total.textContent();

  const clean = (val: string | null) =>
    Number(val?.replace(/[₹,]/g, ''));

  const subtotalVal = clean(subtotalText);
  const gstVal = clean(gstText);
  const totalVal = clean(totalText);

  expect(totalVal).toBeCloseTo(subtotalVal + gstVal, 0);

  // =========================
  // 🔹 STEP 10: BUTTON VALIDATION
  // =========================
  const cancelBtn = page.getByRole('button', { name: 'Cancel Order' });
  const continueBtn = page.getByRole('button', { name: 'Continue Shopping' });
  const printBtn = page.getByRole('button', { name: 'Print Invoice' });

  await expect(printBtn).toBeVisible();
  await expect(continueBtn).toBeVisible();

  // Conditional UI
  if (statusText?.includes('Delivered')) {
    await expect(page.getByText('Order Return')).toBeVisible();
    await expect(page.getByText('Order Replace')).toBeVisible();
  } else {
    await expect(cancelBtn).toBeVisible();
  }

});





test('Order detailed page', async ({ browser }) => {
  test.setTimeout(120000);

  // =========================
  // 🔹 STEP 1: NORMAL TIME (PROCESSING)
  // =========================
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();

  // Login
  await page1.goto('/');

  await page1.getByTestId("navbar-hamburger").click();
  await page1.getByTestId("side-drawer").getByText("Log In").click();

  await page1.getByPlaceholder("you@example.com")
    .fill("gauravkhope31@gmail.com");

  await page1.locator("#password")
    .fill("SmartShopGAURAV31");

  await page1.getByLabel("Remember me").check();
  await page1.getByRole("button", { name: "Sign In" }).click();

  // Navigate to Orders
  await page1.getByTestId("navbar-hamburger").click();
  const drawer1 = page1.getByTestId("side-drawer");

  await drawer1.getByText("MY PROFILE").click();
  await drawer1.getByText("Orders").click();


  // Validate Processing
  const order1 = page1.locator('[data-testid^="order-card-"]').first();
  await order1.getByRole('button', { name: /view order details/i }).click();
await page1.waitForTimeout(3000);

  // =========================
  // 🔹 STEP 2: FUTURE TIME (+2 DAYS → COMPLETED)
  // =========================

  // 🔥 Inject test time BEFORE page load
  await context1.addInitScript(() => {
    window.__TEST_NOW__ = Date.now() + 2 * 24 * 60 * 60 * 1000;
  });

  await page1.reload();
  // Login again
 
  // Validate Completed

await page1.waitForTimeout(3000);  
  await context1.close();
});
