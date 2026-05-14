import { test, expect } from '@playwright/test';

// Add this declaration to extend the Window interface for __TEST_NOW__
declare global {
  interface Window {
    __TEST_NOW__?: number;
  }
}

test('Cancel Order - UI + Tracking + Button Validation', async ({ page }) => {
  test.setTimeout(60000);

  // =========================
  // 🔹 LOGIN + NAVIGATION
  // =========================
  await page.goto('/');

  await page.getByTestId("navbar-hamburger").click();
  await page.getByTestId("side-drawer").getByText("Log In").click();

  await page.getByPlaceholder("you@example.com")
    .fill("rameshkhope622@gmail.com");

  await page.locator("#password")
    .fill("RameshKhope");

  await page.getByLabel("Remember me").check();
  await page.getByRole("button", { name: "Sign In" }).click();

  // Go to Orders
  await page.getByTestId("navbar-hamburger").click();
  const drawer = page.getByTestId("side-drawer");

  await drawer.getByText("MY PROFILE").click();
  await drawer.getByText("Orders").click();

  // Open first order
  const order = page.locator('[data-testid^="order-card-"]').first();
  await order.getByRole('button', { name: /view order details/i }).click();
  await page.waitForTimeout(2000); // wait for order details to load

  await expect(page).toHaveURL(/orders\/\d+/);

  // =========================
  // 🔹 CLICK CANCEL ORDER
  // =========================
  const cancelBtn = page.getByRole('button', { name: /cancel order/i });

  await expect(cancelBtn).toBeVisible();
  await cancelBtn.click();

 

  // =========================
  // 🔹 VALIDATE STATUS
  // =========================
  await expect(page.getByTestId('order-status'))
    .toContainText('Cancelled');

  // =========================
  // 🔹 VALIDATE TRACKING (❌ CANCELLED)
  // =========================
  const cancelStep = page.getByTestId('tracking-step-cancelled');

  // ✔ Cross icon visible
  await expect(cancelStep.locator('svg')).toBeVisible();

  // ✔ Text visible
  await expect(cancelStep.getByTestId('tracking-text-cancelled'))
    .toHaveText(/cancelled/i);

  // ✔ Date visible (no Expected)
  const cancelDate = cancelStep.getByTestId('tracking-date-actual-cancelled');

  await expect(cancelDate).toBeVisible();
  await expect(cancelDate).not.toContainText('Expected');

  // =========================
  // 🔹 VALIDATE OTHER STEPS INACTIVE
  // =========================
  await expect(
    page.getByTestId('tracking-icon-order-packed').locator('svg')
  ).toHaveCount(0);

  await expect(
    page.getByTestId('tracking-icon-order-shipped').locator('svg')
  ).toHaveCount(0);

  // =========================
  // 🔹 CANCEL BUTTON SHOULD DISAPPEAR
  // =========================
  await expect(
    page.getByRole('button', { name: /cancel order/i })
  ).toHaveCount(0);

});



test('Cancel Order - icon and color validation', async ({ page }) => {
  test.setTimeout(60000);

  // =========================
  // 🔹 LOGIN + NAVIGATION
  // =========================
  await page.goto('/');

  await page.getByTestId("navbar-hamburger").click();
  await page.getByTestId("side-drawer").getByText("Log In").click();

  await page.getByPlaceholder("you@example.com")
    .fill("rameshkhope622@gmail.com");

  await page.locator("#password")
    .fill("RameshKhope");

  await page.getByLabel("Remember me").check();
  await page.getByRole("button", { name: "Sign In" }).click();

  // Go to Orders
  await page.getByTestId("navbar-hamburger").click();
  const drawer = page.getByTestId("side-drawer");

  await drawer.getByText("MY PROFILE").click();
  await drawer.getByText("Orders").click();

  // Open first order
  const order = page.locator('[data-testid^="order-card-"]').first();
  await order.getByRole('button', { name: /view order details/i }).click();
  await page.waitForTimeout(2000); // wait for order details to load

  await expect(page).toHaveURL(/orders\/\d+/);


  // =========================
  // 🔹 VALIDATE STATUS
  // =========================
  await expect(page.getByTestId('order-status'))
    .toContainText('Cancelled');

    const placedIcon = page.getByTestId('tracking-icon-order-placed');

// ✅ green gradient background
await expect(placedIcon).toHaveClass(/from-green-400/);
await expect(placedIcon).toHaveClass(/to-green-500/);

// ✅ text color (icon color)
await expect(placedIcon).toHaveClass(/text-white/);

// ✅ svg present
const svg1 = placedIcon.locator('svg');
await expect(svg1).toBeVisible();

// ✅ correct icon (checkmark)
await expect(svg1).toHaveClass(/circle-check/);

  // =========================
  // 🔹 VALIDATE TRACKING (❌ CANCELLED)
  // =========================
  const cancelStep = page.getByTestId('tracking-step-cancelled');

  // ✔ Cross icon visible
  await expect(cancelStep.locator('svg')).toBeVisible();

  // ✔ Text visible
  await expect(cancelStep.getByTestId('tracking-text-cancelled'))
    .toHaveText(/cancelled/i);

  // ✔ Date visible (no Expected)
  const cancelDate = cancelStep.getByTestId('tracking-date-actual-cancelled');

  await expect(cancelDate).toBeVisible();
  await expect(cancelDate).not.toContainText('Expected');
  const cancelIcon = page.getByTestId('tracking-icon-cancelled');

// ✅ color
await expect(cancelIcon).toHaveClass(/bg-red-500/);

// ✅ icon exists
const svg = cancelIcon.locator('svg');
await expect(svg).toBeVisible();

// ✅ correct icon (cross)
await expect(svg).toHaveClass(/circle-x/);

  // =========================
  // 🔹 VALIDATE OTHER STEPS INACTIVE
  // =========================
  await expect(
    page.getByTestId('tracking-icon-order-packed').locator('svg')
  ).toHaveCount(0);

  await expect(
    page.getByTestId('tracking-icon-order-shipped').locator('svg')
  ).toHaveCount(0);

  // =========================
  // 🔹 CANCEL BUTTON SHOULD DISAPPEAR
  // =========================
  await expect(
    page.getByRole('button', { name: /cancel order/i })
  ).toHaveCount(0);

});



test('Order → +12h Packed → Cancel → Validate Tracking Reset', async ({ browser }) => {
  test.setTimeout(120000);

  // =========================
  // 🔹 STEP 1: OPEN WITH +12h (PACKED)
  // =========================
  const context = await browser.newContext();

  await context.addInitScript(() => {
    window.__TEST_NOW__ = Date.now() + 12 * 60 * 60 * 1000;
  });

  const page = await context.newPage();

  // 🔹 Login
  await page.goto('/');

  await page.getByTestId("navbar-hamburger").click();
  await page.getByTestId("side-drawer").getByText("Log In").click();

  await page.getByPlaceholder("you@example.com")
    .fill("rameshkhope622@gmail.com");

  await page.locator("#password")
    .fill("RameshKhope");

  await page.getByLabel("Remember me").check();
  await page.getByRole("button", { name: "Sign In" }).click();

  // 🔹 Go to order details
  await page.getByTestId("navbar-hamburger").click();
  const drawer = page.getByTestId("side-drawer");

  await drawer.getByText("MY PROFILE").click();
  await drawer.getByText("Orders").click();

  const order = page.locator('[data-testid^="order-card-"]').first();
  await order.getByRole('button', { name: /view order details/i }).click();

  await expect(page).toHaveURL(/orders\/\d+/);

  // =========================
  // 🔹 STEP 2: VALIDATE PACKED STATE
  // =========================
  await expect(page.getByTestId('order-status'))
    .toContainText('Order Packed');

  // ✔ placed completed
  await expect(
    page.getByTestId('tracking-icon-order-placed').locator('svg')
  ).toBeVisible();

  // ✔ packed completed
  await expect(
    page.getByTestId('tracking-icon-order-packed').locator('svg')
  ).toBeVisible();

  // ❌ shipped not completed
  await expect(
    page.getByTestId('tracking-icon-order-shipped').locator('svg')
  ).toHaveCount(0);

  // =========================
  // 🔹 STEP 3: CANCEL ORDER
  // =========================
  const cancelBtn = page.getByRole('button', { name: /cancel order/i });

  await expect(cancelBtn).toBeVisible();
  await cancelBtn.click();

  const confirmBtn = page.getByRole('button', { name: /confirm/i });

  if (await confirmBtn.count() > 0) {
    await confirmBtn.click();
  }

  // =========================
  // 🔹 STEP 4: VALIDATE CANCELLED STATE
  // =========================
  await expect(page.getByTestId('order-status'))
    .toContainText('Cancelled');

  // =========================
  // 🔹 STEP 5: TRACKING VALIDATION
  // =========================

  // ✔ Cancel icon (red cross)
  const cancelIcon = page.getByTestId('tracking-icon-cancelled');

  await expect(cancelIcon).toHaveClass(/bg-red-500/);

  const cancelSvg = cancelIcon.locator('svg');
  await expect(cancelSvg).toBeVisible();
  await expect(cancelSvg).toHaveClass(/circle-x/);

  // ✔ Cancel text
  await expect(
    page.getByTestId('tracking-text-cancelled')
  ).toContainText(/cancelled/i);

  // ✔ Cancel date (no Expected)
  const cancelDate = page.getByTestId('tracking-date-actual-cancelled');

  await expect(cancelDate).toBeVisible();
  await expect(cancelDate).not.toContainText('Expected');

  // =========================
  // 🔹 STEP 6: OTHER STEPS RESET
  // =========================

  // ❌ packed should NOT remain active after cancel
  await expect(
    page.getByTestId('tracking-icon-order-packed').locator('svg')
  ).toHaveCount(0);

  // ❌ shipped
  await expect(
    page.getByTestId('tracking-icon-order-shipped').locator('svg')
  ).toHaveCount(0);

  // =========================
  // 🔹 STEP 7: CANCEL BUTTON HIDDEN
  // =========================
  await expect(
    page.getByRole('button', { name: /cancel order/i })
  ).toHaveCount(0);

  await context.close();
});




test('Order → +24h Shipped → Cancel → Validate UI + Payment', async ({ browser }) => {
  test.setTimeout(120000);
const HOUR = 60 * 60 * 1000;
  // =========================
  // 🔹 STEP 1: MOCK TIME (+24h)
  // =========================
  const context = await browser.newContext();

  await context.addInitScript(() => {
    window.__TEST_NOW__ = Date.now() + 24 * 60 * 60 * 1000;
  });

  const page = await context.newPage();

  // =========================
  // 🔹 LOGIN + NAVIGATION
  // =========================
  await page.goto('/');

  await page.getByTestId("navbar-hamburger").click();
  await page.getByTestId("side-drawer").getByText("Log In").click();

  await page.getByPlaceholder("you@example.com")
    .fill("rameshkhope622@gmail.com");

  await page.locator("#password")
    .fill("RameshKhope");

  await page.getByLabel("Remember me").check();
  await page.getByRole("button", { name: "Sign In" }).click();

  await page.getByTestId("navbar-hamburger").click();
  const drawer = page.getByTestId("side-drawer");

  await drawer.getByText("MY PROFILE").click();
  await drawer.getByText("Orders").click();

  const order = page.locator('[data-testid^="order-card-"]').first();
  await order.getByRole('button', { name: /view order details/i }).click();

  await expect(page).toHaveURL(/orders\/\d+/);

  // =========================
  // 🔹 STEP 2: VALIDATE SHIPPED STATE
  // =========================
  await expect(page.getByTestId('order-status'))
    .toContainText('Shipped');

  // =========================
  // 🔹 HELPER: VALIDATE GREEN CHECK ICON (DYNAMIC)
  // =========================
  const validateCompletedIcon = async (step: string) => {
    const icon = page.getByTestId(`tracking-icon-${step}`);

    // ✅ green gradient
    await expect(icon).toHaveClass(/from-green-400/);
    await expect(icon).toHaveClass(/to-green-500/);

    // ✅ white icon
    await expect(icon).toHaveClass(/text-white/);

    // ✅ svg visible
    const svg = icon.locator('svg');
    await expect(svg).toBeVisible();

    // ✅ check icon
    await expect(svg).toHaveClass(/circle-check/);
  };

  // =========================
  // 🔹 VALIDATE ALL COMPLETED STEPS
  // =========================
  await validateCompletedIcon('order-placed');
  await validateCompletedIcon('order-packed');
  await validateCompletedIcon('order-shipped');

  // =========================
  // 🔹 PAYMENT BEFORE CANCEL
  // =========================
  await expect(page.getByTestId('payment-status'))
    .toContainText(/Paid/i);

  // =========================
  // 🔹 STEP 3: CANCEL ORDER
  // =========================
  const cancelBtn = page.getByRole('button', { name: /cancel order/i });

  await expect(cancelBtn).toBeVisible();
  await cancelBtn.click();

  await expect(page.getByRole('status')).toContainText('Order cancelled successfully!');

  // =========================
  // 🔹 STEP 4: VALIDATE CANCELLED STATUS
  // =========================
  await expect(page.getByTestId('order-status'))
    .toContainText(/Cancelled/i);

  // =========================
  // 🔹 STEP 5: VALIDATE CANCEL ICON (RED ❌)
  // =========================
  const cancelIcon = page.getByTestId('tracking-icon-cancelled');

  await expect(cancelIcon).toHaveClass(/bg-red-500/);

  const cancelSvg = cancelIcon.locator('svg');
  await expect(cancelSvg).toBeVisible();
  await expect(cancelSvg).toHaveClass(/circle-x/);

  // =========================
  // 🔹 STEP 6: PAYMENT AFTER CANCEL
  // =========================
  await expect(page.getByTestId('payment-status'))
    .toContainText(/Refunded/i);

  // =========================
  // 🔹 STEP 7: CANCEL BUTTON HIDDEN
  // =========================
  await expect(
    page.getByRole('button', { name: /cancel order/i })
  ).toHaveCount(0);

  await context.close();
});