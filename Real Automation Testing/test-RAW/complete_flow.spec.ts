import { test, expect, Page } from "@playwright/test";

// ============================================================
// 🔹 HELPERS (REUSABLE)
// ============================================================

let storageState: any;

// 🔐 LOGIN ONCE
test.beforeAll(async ({ browser }) => {
 test.setTimeout(60000);
  const context0 = await browser.newContext();
  const page0 = await context0.newPage();

  await page0.goto("/");

  await page0.getByTestId("navbar-hamburger").click();
  await page0.getByTestId("side-drawer").getByText("Log In").click();

  await page0
    .getByPlaceholder("you@example.com")
    .fill("rameshkhope622@gmail.com");

  await page0.locator("#password").fill("RameshKhope");

  await page0.getByLabel("Remember me").check();

  await page0.getByRole("button", { name: "Sign In" }).click();

  await page0.waitForURL("/");

  // Save session
  storageState = await context0.storageState();

  await context0.close();
});

const cleanPrice = (text: string | null) => {
  return Number(text?.replace(/[₹,]/g, '').trim());
};

test("FULL E2E: Product → Checkout → Payment → Confirmation → Order Details", async ({
  browser,
}) => {
  test.setTimeout(120000);

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // ============================================================
  // 🔹 STEP 1: PRODUCT
  // ============================================================
  await page.goto("/");

  const products = page.getByTestId("trending-product-card");
  const count = await products.count();

  const product = products.nth(Math.floor(Math.random() * count));

  const productName = (await product.locator("h3").textContent())!.trim();
  const productPriceText = await product.locator("p").first().textContent();
  const productPrice = cleanPrice(productPriceText);

  await product.click();

  const productQtyText = await page
    .getByTestId("quantity-selector")
    .locator("span")
    .textContent();
  const productQty = Number(productQtyText);

  await page.getByRole("button", { name: /buy now/i }).click();
  await expect(page).toHaveURL(/checkout/);

  // ============================================================
  // 🔹 STEP 2: SHIPPING
  // ============================================================
  await page.locator('input[name="address"]').fill("vile parle , BKC road");
  await page.locator('input[name="city"]').fill("Mumbai");
  await page.locator('input[name="state"]').fill("Maharashtra");
  await page.locator('input[name="zip"]').fill("400002");
  await page.locator('input[name="phone"]').fill("9689769664");

  const extractedAddress = await page
    .locator('input[name="address"]')
    .inputValue();
  const extractedCity = await page.locator('input[name="city"]').inputValue();
  const extractedState = await page.locator('input[name="state"]').inputValue();
  const extractedZip = await page.locator('input[name="zip"]').inputValue();
  const extractedPhone = await page.locator('input[name="phone"]').inputValue();
  const extractedEmail = await page.locator('input[name="email"]').inputValue();

  // ============================================================
  // 🔥 STEP 3: CHECKOUT ORDER SUMMARY VALIDATION
  // ============================================================

  const checkoutSummary = page.getByTestId("checkout-order-summary");
  await expect(checkoutSummary).toBeVisible();
  const summaryName = await checkoutSummary.locator("h3").innerText();
  expect(summaryName).toContain(productName);

  const qtyText = await checkoutSummary
    .getByTestId("checkout-item-quantity")
    .innerText();
  const summaryQty = Number(qtyText.replace(/\D/g, ""));
  expect(summaryQty).toBe(productQty);

  const priceText = await checkoutSummary
    .getByTestId("checkout-item-price")
    .textContent();
  const summaryPrice = cleanPrice(priceText);
  console.log("Summary Price:", summaryPrice, "Product Price:", productPrice);
  expect(summaryPrice).toBe(productPrice);

  const subtotal = productPrice * productQty;
  const shipping = subtotal < 499 ? 99 : 0;
  const total = subtotal + shipping;

  await expect(page.getByTestId("checkout-subtotal")).toContainText(`₹${subtotal}.00`);

  const shippingText = await page.getByTestId("checkout-shipping").textContent();
  if (shipping === 0) {
    expect(shippingText).toContain("FREE");
  } else {
    expect(cleanPrice(shippingText)).toBe(99);
  }

 
   await expect(page.getByTestId("checkout-total")).toContainText(`₹${total}.00`);



  // ============================================================
  // 🔹 STEP 4: PAYMENT METHOD
  // ============================================================
  const methods = ["Card", "UPI", "COD"];
  const paymentMethod = methods[Math.floor(Math.random() * 3)];

  const paymentSection = page.getByTestId("payment-method");

  if (paymentMethod === "Card") {
    await paymentSection.getByRole("button", { name: "Credit / Debit Card" }).click();
  } else if (paymentMethod === "UPI") {
    await paymentSection.getByRole("button", { name: "UPI" }).click();
  } else {
    await paymentSection
      .getByRole("button", { name: "Cash On Delivery" })
      .click();
  }

  // ============================================================
  // 🔹 STEP 5: PROCEED
  // ============================================================
  if (paymentMethod === "COD") {
    await page.getByRole("button", { name: /proceed to cod/i }).click();
  } else {
    await page.getByRole("button", { name: /proceed to payment/i }).click();
  }

  const modal = page.getByTestId("payment-modal");
  await expect(modal).toBeVisible();

  // ============================================================
  // 🔥 STEP 6: PAYMENT FLOWS (STRICT)
  // ============================================================

  if (paymentMethod === "Card") {
    await modal.getByTestId("card-number").fill("4611111111114242");
    await modal.getByTestId("cvv").fill("100");
    await modal.getByTestId("expiry").fill("1228");

    await modal.getByTestId("confirm-card").click();
    await expect(modal.getByText(/payment confirmed/i)).toBeVisible();

    await modal.getByRole("button", { name: /place order/i }).click();
  }

  if (paymentMethod === "UPI") {
    await modal.getByTestId("upi-mode-selector").selectOption("upi");

    await page.getByRole("button", { name: /UPI Help/i }).click();
    const upiOptions = page.getByTestId("upi-ids").locator("button");

    const randomUPI = Math.floor(Math.random() * (await upiOptions.count()));
    await upiOptions.nth(randomUPI).click();

    await page.getByRole("button", { name: /Pay via UPI/i }).click();
    await expect(page.locator("text=/Payment successful/i")).toBeVisible();
  }

  if (paymentMethod === "COD") {
    await modal
      .getByRole("button", { name: /confirm cash on delivery/i })
      .click();
    await expect(page.getByText(/order confirmed/i)).toBeVisible();
  }
  if (paymentMethod !== "COD") {
  const orderConfirmationMessage = page.getByRole("status");
  await expect(orderConfirmationMessage).toBeVisible();
  await expect(orderConfirmationMessage).toHaveText("Payment successful! Order placed 🎉");
};
  await page.waitForTimeout(3000) // Wait for order processing (simulate backend delay)


  // ============================================================
  // 🔥 STEP 7: ORDER CONFIRMATION (EXACT YOUR FLOW)
  // ============================================================
  await expect(page.getByTestId("order-confirmation-page")).toBeVisible();
  await expect(page.getByTestId("order-success-section")).toBeVisible();

  if (paymentMethod === "COD") {
    await expect(page.getByTestId("payment-status")).toHaveText(/payment due/i);
  } else {
    await expect(page.getByTestId("payment-status")).toHaveText(
      /payment confirmed/i,
    );
  }

  const orderTitle = page.getByTestId("order-title");
  await expect(orderTitle).toBeVisible();
  await expect(orderTitle.locator("h1")).toContainText(
    /Order Placed Successfully/i,
  );
  await expect(page.getByTestId("order-title-productname")).toContainText(
    productName,
  );

  // Delivery date
  const today = new Date();
  today.setDate(today.getDate() + 3);

  const expectedDate = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  
  const formatPrice = (value: number) => {
  return value.toLocaleString('en-IN');
};

  await expect(
    page.getByTestId("delivery-info").getByTestId("delivery-date"),
  ).toHaveText(expectedDate);

  // Product validation
  await expect(page.getByTestId("order-item-name")).toContainText(productName);
  await expect(page.getByTestId("order-item-quantity")).toContainText(
    productQtyText!,
  );
  await expect(
    page.getByTestId("order-item-price").locator("p").first(),
  ).toContainText(`₹${formatPrice(subtotal)}.00`);
  await expect(
    page.getByTestId("order-item-price").locator("p").last(),
  ).toContainText(`₹${formatPrice(productPrice)}.00 each`);
  // Shipping validation
  const shippingInfo = page.getByTestId("shipping-address");
  await expect(shippingInfo.locator("p").first()).toHaveText(extractedAddress);
  await expect(shippingInfo.locator("p").nth(1)).toHaveText(
    `${extractedCity}, ${extractedState} ${extractedZip}`,
  );
  await expect(page.getByTestId("contact-phone")).toHaveText(extractedPhone);
  await expect(page.getByTestId("contact-email")).toHaveText(extractedEmail);

  const orderSummary = page.getByTestId("order-summary");
  await expect(orderSummary).toBeVisible();
  await expect(
    orderSummary.getByTestId("subtotal").locator("span").last(),
  ).toContainText(`₹${formatPrice(subtotal)}.00`);
  await expect(
    orderSummary.getByTestId("total-paid").locator("span").last(),
  ).toContainText(`₹${formatPrice(total)}.00`);

  const today1 = new Date();

  const formattedDate = `${today1.getDate()}/${today1.getMonth() + 1}/${today1.getFullYear()}`;

  await expect(
    orderSummary.getByTestId("order-date").locator("span").last(),
  ).toContainText(formattedDate);
  await expect(
    orderSummary.getByTestId("payment-method").locator("span").last(),
  ).toContainText(paymentMethod.toLowerCase());
  await expect(
    orderSummary.getByTestId("order-status").locator("span").last(),
  ).toContainText("processing");

  // ============================================================
  // 🔥 STEP 8: VIEW ORDER DETAILS
  // ============================================================

  await page.getByRole("button", { name: "View Order Details" }).click();
  await page.waitForURL(/\/orders\/\d+/);

  // ============================================================
  // 🔥 STEP 9: ORDER DETAILS VALIDATION
  // ============================================================

  await expect(page.getByTestId("order-id")).toBeVisible();
  await expect(page.getByTestId("order-date")).toBeVisible();

  const status = await page.getByTestId("order-status").textContent();
  expect(status).toMatch(/Order Placed|Packed|Shipped|Delivered/);

  await expect(page.getByTestId("shipping-address")).toBeVisible();
  await expect(shippingInfo.locator("p").first()).toHaveText(extractedAddress);
  await expect(shippingInfo.locator("p").nth(1)).toHaveText(
    `${extractedCity}, ${extractedState} ${extractedZip}`,
  );
  await expect(page.getByTestId("shipping-phone")).toHaveText(extractedPhone);
  await expect(page.getByTestId("shipping-email")).toHaveText(extractedEmail);

  await expect(page.getByTestId("payment-method")).toBeVisible();
  await expect(page.getByTestId("payment-method")).toContainText(paymentMethod.toLowerCase());
  const paymentStatus = await page.getByTestId("payment-status").textContent();

  if (paymentMethod === "COD") {
    expect(paymentStatus).toMatch(/pending/i);
  } else {
    expect(paymentStatus).toMatch(/paid/i);
  }

  await expect(page.getByTestId("product-name")).toContainText(productName);

  const qty = Number(
    (await page.getByTestId("product-qty").innerText()).replace(/\D/g, ""),
  );
  expect(qty).toBe(productQty);
  await expect(page.getByTestId("order-item-total")).toContainText(
    `₹${formatPrice(subtotal)}.00`,
  );

  const subtotalText2 = await page.getByTestId("subtotal").innerText();
  const gstText = await page.getByTestId("gst").innerText();
  const totalText2 = await page.getByTestId("order-total").innerText();

  const subtotalVal = cleanPrice(subtotalText2);
  const gstVal = cleanPrice(gstText);
  const totalVal = cleanPrice(totalText2);

  expect(subtotalVal).toBe(subtotal);
  expect(gstVal).toBeCloseTo(subtotal * 0.18, 0);
  expect(totalVal).toBeCloseTo(subtotalVal + gstVal + shipping, 0);

  await context.close();
});
 