import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    __TEST_NOW__?: number;
  }
}

test("Order Return Validation", async ({ browser }) => {
  test.setTimeout(180000);

  const BASE_TIME = Date.now();
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();

  // =====================
  // 🔹 LOGIN
  // =====================
  await page1.goto("/");
  await page1.getByTestId("navbar-hamburger").click();
  await page1.getByTestId("side-drawer").getByText("Log In").click();
  await page1
    .getByPlaceholder("you@example.com")
    .fill("rameshkhope622@gmail.com");
  await page1.locator("#password").fill("RameshKhope");
  await page1.getByLabel("Remember me").check();
  await page1.getByRole("button", { name: "Sign In" }).click();

  // =========================
  // 🔹 NAVIGATE TO ORDER
  // =========================
  await page1.getByTestId("navbar-hamburger").click();
  const drawer1 = page1.getByTestId("side-drawer");
  await drawer1.getByText("MY PROFILE").click();
  await drawer1.getByText("Orders").click();
  await page1.waitForTimeout(3000);

  // =========================
  // 🔹 STEP 3: FIND COMPLETED ORDER (CORE LOGIC 🔥)
  // =========================
  const allOrders = page1.locator('[data-testid^="order-card-"]');
  const completedOrders = allOrders.filter({
    has: page1.getByTestId("order-status").filter({ hasText: "Completed" }),
  });
  const count = await completedOrders.count();
  expect(count).toBeGreaterThan(0);
  // Pick first matching order
  const selectedCard = completedOrders.first();
  const orderId = await selectedCard.getByTestId("order-id").textContent();
  // Remove non-numeric characters to get only the number from orderId
  const orderIdNumber = orderId?.replace(/\D/g, "");
  const finalCard = page1.getByTestId(`order-card-${orderIdNumber}`);
  await finalCard.getByRole("button", { name: /view order details/i }).click();
  await page1.waitForTimeout(3000); // wait for status update
  const returnCancelButton = page1.getByRole("button", {
    name: /return cancel/i,
  });
  if (await returnCancelButton.isVisible()) {
    await returnCancelButton.click();
  }

  // ===============================
  // 🔹 VALIDATE DELIVERED & Return
  // ===============================
  await expect(page1.getByTestId("order-status")).toContainText(/delivered/i);
  await expect(page1.getByTestId("payment-status")).toHaveText(/paid/i);
  await page1.getByRole("button", { name: /order return/i }).click();
  await page1
    .getByPlaceholder("Please tell us the reason...")
    .fill("Damaged product");
  await page1.getByRole("button", { name: /submit request/i }).click();

  // =========================
  // 🔹 VALIDATE RETURN REQUESTED
  // =========================
  await expect(page1.getByTestId("order-status")).toContainText(
    /return requested/i,
  );

  // =========================
  // 🔹 STEP 6: RETURN REQUESTED STEP
  // =========================
  const returnIcon = page1.getByTestId("tracking-icon-return-requested");
  const returnText = page1.getByTestId("tracking-text-return-requested");
  const pickedText1 = page1.getByTestId("tracking-text-order-picked");
  const returnSvg = returnIcon.locator("svg");
  const pickedicon = page1.getByTestId("tracking-icon-order-picked");

  await expect(returnText).toHaveText("Return Requested");
  await expect(pickedText1).toHaveText("Order Picked");
  // ✅ orange background
  await expect(returnIcon).toHaveClass(/bg-orange-400/);
  // ✅ icon visible
  await expect(returnSvg).toBeVisible();
  await expect(pickedicon.locator("svg")).toHaveCount(0); // no ✔
  await expect(pickedicon).toContainText(/[0-9]/); // number
  await expect(pickedText1).toHaveClass(/orange-400/); // light

  // =========================
  // 🔹 DATE VALIDATION
  // =========================

  // ✔ actual date (no Expected)
  const returnDate = page1.getByTestId("tracking-date-actual-return-requested");
  await expect(returnDate).toBeVisible();
  await expect(returnDate).not.toContainText("Expected");

  // =========================
  // 🔹 STEP 8: NEXT STEP (ORDER PICKED)
  // =========================
  const pickedExpected1 = page1.getByTestId(
    "tracking-date-expected-order-picked",
  );
  await expect(pickedExpected1).toBeVisible();
  await expect(pickedExpected1).toContainText("Expected");
  await context1.close();

  // ============================================================
  // 🔹 CONTEXT 2 → PICKED (+26h)
  // ============================================================
  const context2 = await browser.newContext();

  await context2.addInitScript((baseTime) => {
    window.__TEST_NOW__ = baseTime + 26 * 60 * 60 * 1000;
  }, BASE_TIME);

  const page2 = await context2.newPage();

  // =========================
  // 🔹 LOGIN AGAIN
  // =========================
  await page2.goto("/");
  await page2.getByTestId("navbar-hamburger").click();
  await page2.getByTestId("side-drawer").getByText("Log In").click();
  await page2
    .getByPlaceholder("you@example.com")
    .fill("rameshkhope622@gmail.com");
  await page2.locator("#password").fill("RameshKhope");
  await page2.getByLabel("Remember me").check();
  await page2.getByRole("button", { name: "Sign In" }).click();

  // =========================
  // 🔹 OPEN SAME ORDER
  // =========================
  const drawer2 = page2.getByTestId("side-drawer");
  await page2.getByTestId("navbar-hamburger").click();
  await drawer2.getByText("MY PROFILE").click();
  await drawer2.getByText("Orders").click();

  const orderCard2 = page2.locator(
    `[data-testid="order-card-${orderIdNumber}"]`,
  );
  await orderCard2.getByRole("button", { name: /view order details/i }).click();
  await page2.waitForTimeout(3000); // wait for orders to load

  const orderPickedIcon2 = page2.getByTestId("tracking-icon-order-picked");
  const pickedText2 = page2.getByTestId("tracking-text-order-picked");
  const pickedExpected2 = page2.getByTestId(
    "tracking-date-actual-order-picked",
  );
  const paymentStatus2 = page2.getByTestId("payment-status");

  // =========================
  // 🔹 VALIDATE PICKED
  // =========================
  await expect(page2.getByTestId("order-status")).toContainText(
    /Order Returned/i,
  );
  await expect(orderPickedIcon2.locator("svg")).toBeVisible();
  await expect(orderPickedIcon2).toHaveClass(/bg-orange-600/);
  await expect(orderPickedIcon2.locator("svg")).toHaveClass(/circle-check/);
  await expect(pickedText2).toHaveClass(/orange-800/); // light
  await expect(pickedExpected2).toBeVisible();
  await expect(pickedExpected2).not.toContainText("Expected");

  await expect(paymentStatus2).toHaveText(/refunded/i);
  await context2.close();
});

test("Order Replace Validation", async ({ browser }) => {
  test.setTimeout(180000);

  const BASE_TIME = Date.now();
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();

  // =====================
  // 🔹 LOGIN
  // =====================
  await page1.goto("/");
  await page1.getByTestId("navbar-hamburger").click();
  await page1.getByTestId("side-drawer").getByText("Log In").click();
  await page1
    .getByPlaceholder("you@example.com")
    .fill("rameshkhope622@gmail.com");
  await page1.locator("#password").fill("RameshKhope");
  await page1.getByLabel("Remember me").check();
  await page1.getByRole("button", { name: "Sign In" }).click();

  // =========================
  // 🔹 NAVIGATE TO ORDER
  // =========================
  await page1.getByTestId("navbar-hamburger").click();
  const drawer1 = page1.getByTestId("side-drawer");
  await drawer1.getByText("MY PROFILE").click();
  await drawer1.getByText("Orders").click();
  await page1.waitForTimeout(3000);

  // =========================
  // 🔹 STEP 3: FIND COMPLETED ORDER (CORE LOGIC 🔥)
  // =========================
  const allOrders = page1.locator('[data-testid^="order-card-"]');
  const completedOrders = allOrders.filter({
    has: page1.getByTestId("order-status").filter({ hasText: "Completed" }),
  });
  const count = await completedOrders.count();
  expect(count).toBeGreaterThan(0);
  // Pick first matching order
  const selectedCard = completedOrders.first();
  const orderId = await selectedCard.getByTestId("order-id").textContent();
  // Remove non-numeric characters to get only the number from orderId
  const orderIdNumber = orderId?.replace(/\D/g, "");
  const finalCard = page1.getByTestId(`order-card-${orderIdNumber}`);
  await Promise.all([
    page1.waitForURL(/\/orders\/\d+$/),
    finalCard.getByRole("button", { name: /view order details/i }).click(),
  ]); // wait for status update
  const returnCancelButton = page1.getByRole("button", {
    name: "Return Cancel",
  });
  if (await returnCancelButton.isVisible()) {
    await returnCancelButton.click();
  }
  const replaceCancelBtn = page1.getByRole("button", {
    name: /Cancel Replace/i,
  });
  if (await replaceCancelBtn.isVisible()) {
    await replaceCancelBtn.click();
  }

  // ===============================
  // 🔹 VALIDATE DELIVERED & Return
  // ===============================
  await expect(page1.getByTestId("order-status")).toContainText(/delivered/i);
  await expect(page1.getByTestId("payment-status")).toHaveText(/paid/i);
  await page1.getByRole("button", { name: /order replace/i }).click();
  await page1
    .getByPlaceholder("Please tell us the reason...")
    .fill("Damaged product");
  await page1.getByRole("button", { name: /submit request/i }).click();

  // =========================
  // 🔹 VALIDATE REPLACE REQUESTED
  // =========================
  await expect(page1.getByTestId("order-status")).toContainText(
    /Replacement Requested/i,
  );
  const replaceText = page1.getByTestId("tracking-text-replacement-requested");
  const replaceIcon = page1.getByTestId("tracking-icon-replacement-requested");
  const replacedText = page1.getByTestId("tracking-text-order-replaced");
  const replacededIcon = page1.getByTestId("tracking-icon-order-replaced");
  const replaceSvg = replaceIcon.locator("svg");
  await expect(replaceText).toHaveText("Replacement Requested");
  await expect(replacedText).toHaveText("Order Replaced");
  await expect(replaceIcon).toHaveClass(
    /bg-gradient-to-r from-green-400 to-green-500/,
  );
  await expect(replaceSvg).toBeVisible();
  await expect(replacededIcon.locator("svg")).toHaveCount(0); // no ✔
  await expect(replacededIcon).toContainText(/[0-9]/); // number
  await expect(replacedText).toHaveClass(/gray-400/); // light

  // =========================
  // 🔹 DATE VALIDATION
  // =========================
  // ✔ actual date (no Expected)
  const returnDate = page1.getByTestId(
    "tracking-date-actual-replacement-requested",
  );
  await expect(returnDate).toBeVisible();
  await expect(returnDate).not.toContainText("Expected");

  // =========================
  // 🔹 STEP 8: NEXT STEP (ORDER PICKED)
  // =========================
  const pickedExpected1 = page1.getByTestId(
    "tracking-date-expected-order-replaced",
  );
  await expect(pickedExpected1).toBeVisible();
  await expect(pickedExpected1).toContainText("Expected");
  await context1.close();

  // ============================================================
  // 🔹 CONTEXT 2 → PICKED (+26h)
  // ============================================================
  const context2 = await browser.newContext();

  await context2.addInitScript((baseTime) => {
    window.__TEST_NOW__ = baseTime + 26 * 60 * 60 * 1000;
  }, BASE_TIME);

  const page2 = await context2.newPage();

  // =========================
  // 🔹 LOGIN AGAIN
  // =========================
  await page2.goto("/");
  await page2.getByTestId("navbar-hamburger").click();
  await page2.getByTestId("side-drawer").getByText("Log In").click();
  await page2
    .getByPlaceholder("you@example.com")
    .fill("rameshkhope622@gmail.com");
  await page2.locator("#password").fill("RameshKhope");
  await page2.getByLabel("Remember me").check();
  await page2.getByRole("button", { name: "Sign In" }).click();

  // =========================
  // 🔹 OPEN SAME ORDER
  // =========================
  const drawer2 = page2.getByTestId("side-drawer");
  await page2.getByTestId("navbar-hamburger").click();
  await drawer2.getByText("MY PROFILE").click();
  await drawer2.getByText("Orders").click();

  const orderCard2 = page2.locator(
    `[data-testid="order-card-${orderIdNumber}"]`,
  );
  await Promise.all([
    page2.waitForURL(/\/orders\/\d+$/),
    orderCard2.getByRole("button", { name: /view order details/i }).click(),
  ]); // wait for orders to load

  const paymentStatus2 = page2.getByTestId("payment-status");
  const replacededIcon2 = page2.getByTestId("tracking-icon-order-replaced");
  const replacedText2 = page2.getByTestId("tracking-text-order-replaced");
  const replacedActual2 = page2.getByTestId(
    "tracking-date-actual-order-replaced",
  );

  // =========================
  // 🔹 VALIDATE PICKED
  // =========================
  await expect(page2.getByTestId("order-status")).toContainText(
    /Order Replaced/i,
  );
  await expect(replacededIcon2.locator("svg")).toBeVisible();
  await expect(replacededIcon2).toHaveClass(
    /bg-gradient-to-r from-green-400 to-green-500/,
  );
  await expect(replacededIcon2.locator("svg")).toHaveClass(/circle-check/);
  await expect(replacedText2).toHaveClass(/gray-800/); // light
  await expect(replacedActual2).toBeVisible();
  await expect(replacedActual2).not.toContainText("Expected");
  await expect(paymentStatus2).toHaveText(/PAID/i);
  await context2.close();
});

test("Edge case Validation for Order Return & Replace ", async ({
  browser,
}) => {
  test.setTimeout(180000);

  const BASE_TIME = Date.now();
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();

  // =====================
  // 🔹 LOGIN
  // =====================
  await page1.goto("/");
  await page1.getByTestId("navbar-hamburger").click();
  await page1.getByTestId("side-drawer").getByText("Log In").click();
  await page1
    .getByPlaceholder("you@example.com")
    .fill("rameshkhope622@gmail.com");
  await page1.locator("#password").fill("RameshKhope");
  await page1.getByLabel("Remember me").check();
  await page1.getByRole("button", { name: "Sign In" }).click();

  // =========================
  // 🔹 NAVIGATE TO ORDER
  // =========================
  await page1.getByTestId("navbar-hamburger").click();
  const drawer1 = page1.getByTestId("side-drawer");
  await drawer1.getByText("MY PROFILE").click();
  await drawer1.getByText("Orders").click();
  await page1.waitForTimeout(3000);

  // =========================
  // 🔹 STEP 3: FIND COMPLETED ORDER (CORE LOGIC 🔥)
  // =========================
  const allOrders = page1.locator('[data-testid^="order-card-"]');
  const completedOrders = allOrders.filter({
    has: page1.getByTestId("order-status").filter({ hasText: "Completed" }),
  });
  const count = await completedOrders.count();
  expect(count).toBeGreaterThan(0);
  // Pick first matching order
  const selectedCard = completedOrders.first();
  const orderId = await selectedCard.getByTestId("order-id").textContent();
  // Remove non-numeric characters to get only the number from orderId
  const orderIdNumber = orderId?.replace(/\D/g, "");
  const finalCard = page1.getByTestId(`order-card-${orderIdNumber}`);
  await finalCard.getByRole("button", { name: /view order details/i }).click();
  await page1.waitForTimeout(3000); // wait for status update

  await page1.getByRole("button", { name: /order return/i }).click();
  await page1
    .getByPlaceholder("Please tell us the reason...")
    .fill("Damaged product");
  await page1.getByRole("button", { name: /submit request/i }).click();

  const textarea = page1.getByPlaceholder("Please tell us the reason...");
  const returnText = page1.getByTestId("tracking-text-return-requested");
  const pickedText = page1.getByTestId("tracking-text-order-picked");

  await expect(
    page1.getByRole("button", { name: /order return/i }),
  ).toHaveCount(0);
  await page1.getByRole("button", { name: /return cancel/i }).click();
  await expect(
    page1.getByRole("button", { name: /order return/i }),
  ).toBeVisible();
  await expect(page1.getByTestId("order-status")).toContainText(/Delivered/i);
  await expect(returnText).not.toBeVisible();
  await expect(pickedText).not.toBeVisible();

  await page1.getByRole("button", { name: /order return/i }).click();
  await textarea.fill("Product is damaged");
  await page1.getByRole("button", { name: /submit request/i }).click();
  await expect(returnText).toBeVisible();
  await expect(pickedText).toBeVisible();
  await page1.getByRole("button", { name: /return cancel/i }).click();

  await page1.getByRole("button", { name: /order return/i }).click();
  await textarea.fill("ABC");
  await page1.getByRole("button", { name: /submit request/i }).click();
  const toast = page1.getByRole("status").filter({
    hasText: "Please enter a valid reason (minimum 5 characters)",
  });
  await expect(toast).toBeVisible();
  //   await expect(returnOrdererror).toHaveText("Please enter a valid reason (minimum 5 characters)");
  await page1.getByRole("button", { name: /Cancel/i }).click();

  await page1.getByRole("button", { name: /order replace/i }).click();
  await textarea.fill("Product is damaged");
  await page1.getByRole("button", { name: /submit request/i }).click();

  await expect(page1.getByTestId("order-status")).toContainText(
    /Replacement Requested/i,
  );
  const replaceText = page1.getByTestId("tracking-text-replacement-requested");
  const replacedText = page1.getByTestId("tracking-step-order-replaced");
  await expect(replaceText).toBeVisible();
  await expect(replacedText).toBeVisible();
  await expect(
    page1.getByRole("button", { name: /order replace/i }),
  ).toHaveCount(0);
  await page1.getByRole("button", { name: /cancel replace/i }).click();
  await expect(
    page1.getByRole("button", { name: /order replace/i }),
  ).toBeVisible();
  await expect(page1.getByTestId("order-status")).toContainText(/Delivered/i);
  await expect(replaceText).not.toBeVisible();
  await expect(replacedText).not.toBeVisible();
  await context1.close();
});
