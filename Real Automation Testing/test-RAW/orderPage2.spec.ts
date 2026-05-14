import { test, expect, Page } from '@playwright/test';

const HOUR = 60 * 60 * 1000;

test('Order detailed page - full lifecycle validation (UI + time + dates)', async ({ browser }) => {
  test.setTimeout(240000);

  // =========================
  // 🔹 HELPER: LOGIN + OPEN ORDER
  // =========================
  const loginAndOpenOrder = async (page: Page) => {
    await page.goto('/');

    await page.getByTestId("navbar-hamburger").click();
    await page.getByTestId("side-drawer").getByText("Log In").click();

    await page.getByPlaceholder("you@example.com")
      .fill("gauravkhope31@gmail.com");

    await page.locator("#password")
      .fill("SmartShopGAURAV31");

    await page.getByLabel("Remember me").check();
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.getByTestId("navbar-hamburger").click();
    const drawer = page.getByTestId("side-drawer");

    await drawer.getByText("MY PROFILE").click();
    await drawer.getByText("Orders").click();

    const order = page.locator('[data-testid^="order-card-"]').first();
    await order.getByRole('button', { name: /view order details/i }).click();

    await expect(page).toHaveURL(/orders\/\d+/);
  };

  // =========================
  // 🔹 HELPER: STEP UI VALIDATION
  // =========================
  const validateStep = async (page: Page, step: string, completed: boolean) => {
    const icon = page.getByTestId(`tracking-icon-${step}`);
    const text = page.getByTestId(`tracking-text-${step}`);

    if (completed) {
      await expect(icon.locator('svg')).toBeVisible(); // ✔
      await expect(text).toHaveClass(/text-gray-800/); // dark
    } else {
      await expect(icon.locator('svg')).toHaveCount(0); // no ✔
      await expect(icon).toContainText(/[0-9]/); // number
      await expect(text).toHaveClass(/text-gray-400/); // light
    }
  };

  // =========================
  // 🔹 HELPER: DATE VALIDATION
  // =========================
 const validateDate = async (
  page: Page,
  step: string,
  time: number,
  completed: boolean
) => {
  const expected = page.getByTestId(`tracking-date-expected-${step}`);
  const actual = page.getByTestId(`tracking-date-actual-${step}`);

  const formatted = new Date(time).toLocaleDateString('en-IN');

  if (completed) {
    // ✅ actual date MUST exist
    await expect(actual).toHaveCount(1);

    // ✅ correct date
    await expect(actual).toContainText(formatted);

    // ❌ should NOT contain "Expected"
    await expect(actual).not.toContainText('Expected');

    console.log(`✔ COMPLETED → ${step}: ${formatted}`);

  } else {
    // ✅ expected date MUST exist
    await expect(expected).toHaveCount(1);

    // ✅ contains "Expected"
    await expect(expected).toContainText('Expected');

    // ✅ correct date
    await expect(expected).toContainText(formatted);

    console.log(`✔ FUTURE → ${step}: Expected ${formatted}`);
  }
};

  // =========================
  // 🔹 HELPER: OPEN WITH TIME
  // =========================
  const openWithTime = async (time: number) => {
    const context = await browser.newContext();

    await context.addInitScript((t) => {
      window.__TEST_NOW__ = t;
    }, time);

    const page = await context.newPage();
    await loginAndOpenOrder(page);

    return { page, context };
  };

  // =========================
  // 🔹 STEP 1: NORMAL (PLACED)
  // =========================
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();

  await loginAndOpenOrder(page1);

  const createdAtText = await page1.getByTestId('order-createdAt').textContent();
  if (!createdAtText) throw new Error('order-createdAt textContent is null');
  const createdAt = new Date(createdAtText).getTime();

  await expect(page1.getByTestId('order-status')).toContainText('Order Placed');

  await validateStep(page1, 'order-placed', true);
  await validateStep(page1, 'order-packed', false);
  await validateStep(page1, 'order-shipped', false);
  await validateStep(page1, 'order-delivered', false);

  await validateDate(page1, 'order-placed', createdAt, true);
  await validateDate(page1, 'order-packed', createdAt + 12 * HOUR, false);
  await validateDate(page1, 'order-shipped', createdAt + 24 * HOUR, false);
  await validateDate(page1, 'order-delivered', createdAt + 48 * HOUR, false);

  await context1.close();

  // =========================
  // 🔹 STEP 2: +12h (PACKED)
  // =========================
  let { page, context } = await openWithTime(createdAt + 12 * HOUR);

  await expect(page.getByTestId('order-status')).toContainText('Order Packed');

  await validateStep(page, 'order-placed', true);
  await validateStep(page, 'order-packed', true);
  await validateStep(page, 'order-shipped', false);
  await validateStep(page, 'order-delivered', false);

  await validateDate(page, 'order-packed', createdAt + 12 * HOUR, true);
  await validateDate(page, 'order-shipped', createdAt + 24 * HOUR, false);
  await validateDate(page, 'order-delivered', createdAt + 48 * HOUR, false);

  await context.close();

  // =========================
  // 🔹 STEP 3: +24h (SHIPPED)
  // =========================
  ({ page, context } = await openWithTime(createdAt + 24 * HOUR));

  await expect(page.getByTestId('order-status')).toContainText('Shipped');

  await validateStep(page, 'order-placed', true);
  await validateStep(page, 'order-packed', true);
  await validateStep(page, 'order-shipped', true);
  await validateStep(page, 'order-delivered', false);

  await validateDate(page, 'order-shipped', createdAt + 24 * HOUR, true);
  await validateDate(page, 'order-delivered', createdAt + 48 * HOUR, false);

  await context.close();

  // =========================
  // 🔹 STEP 4: +48h (DELIVERED)
  // =========================
  ({ page, context } = await openWithTime(createdAt + 48 * HOUR));

  await expect(page.getByTestId('order-status')).toContainText('Delivered');

  await validateStep(page, 'order-placed', true);
  await validateStep(page, 'order-packed', true);
  await validateStep(page, 'order-shipped', true);
  await validateStep(page, 'order-delivered', true);

  await validateDate(page, 'order-delivered', createdAt + 48 * HOUR, true);

  await context.close();
});

