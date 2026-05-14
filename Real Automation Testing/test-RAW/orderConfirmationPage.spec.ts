import { test, expect} from '@playwright/test';

let storageState: any;

// 🔐 LOGIN ONCE
test.beforeAll(async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("/");

  await page.getByTestId("navbar-hamburger").click();
  await page.getByTestId("side-drawer").getByText("Log In").click();

  await page.getByPlaceholder("you@example.com")
    .fill("rameshkhope622@gmail.com");

  await page.locator("#password")
    .fill("RameshKhope");

  await page.getByLabel("Remember me").check();

  await page.getByRole("button", { name: "Sign In" }).click();

  await page.waitForURL('/');

  // Save session
  storageState = await context.storageState();

  await context.close();
});

test('Order Confirmation Page Validation', async ({ browser  }) => {

  test.setTimeout(80000);
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // =========================
  // 1. GO TO HOME
  // =========================
  await page.goto('/');

  const products = page.getByTestId('trending-product-card');

  const count = await products.count();
  expect(count).toBeGreaterThan(0); // sanity

  // =========================
  // 2. SELECT RANDOM PRODUCT
  // =========================
  const randomIndex = Math.floor(Math.random() * count);
  const selectedProduct = products.nth(randomIndex);

  // Extract name + price (as per your DOM: h3 + p)
  const productName = (await selectedProduct.locator('h3').textContent())?.trim();
  const productPrice = (await selectedProduct.locator('p').first().textContent())?.trim();

  console.log('Selected Product:', productName, productPrice);

  // Click product
  await selectedProduct.click();
  const productQty = await page.getByTestId('quantity-selector').locator('span').textContent();

  // =========================
  // 4. BUY NOW
  // =========================
  await page.getByRole('button', { name: /Buy Now/i }).click();

  await expect(page).toHaveURL(/checkout/);

  // =========================
  // 5. FILL SHIPPING + STORE DATA
  // =========================
 await page.locator('input[name="address"]').fill('vile parle , BKC road');
   await page.locator('input[name="city"]').fill('Mumbai');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('400002');
  await page.locator('input[name="phone"]').fill('9689769664');

  // =========================
  // 6. EXTRACT SHIPPING DATA (VALIDATION PURPOSE)
  // =========================
  const extractedAddress = await page.locator('input[name="address"]').inputValue();
  const extractedCity = await page.locator('input[name="city"]').inputValue();
  const extractedState = await page.locator('input[name="state"]').inputValue();
  const extractedZip = await page.locator('input[name="zip"]').inputValue();
  const extractedPhone = await page.locator('input[name="phone"]').inputValue();
  const extractedEmail = await page.locator('input[name="email"]').inputValue();
 
  // =========================
  // 8. SELECT UPI
  // =========================
 const paymentSection = page.getByTestId('payment-method');
  await paymentSection.getByRole('button', { name: /UPI/i }).click();

  // =========================
  // 9. PROCEED TO PAYMENT
  // =========================
  await page.getByRole('button', { name: /Proceed to Payment/i }).click();
  const modal = page.getByTestId('payment-modal');
  await expect(modal).toBeVisible();

  // Open UPI help
  await page.getByRole('button', { name: /UPI Help/i }).click();

  const upiList = page.getByTestId('upi-ids');
  const upiOptions = upiList.locator('button');

  const upiCount = await upiOptions.count();
  const randomUPIIndex = Math.floor(Math.random() * upiCount);

  await upiOptions.nth(randomUPIIndex).click();

  // Pay
  await page.getByRole('button', { name: /Pay via UPI/i }).click();

  // =========================
  // 10. WAIT FOR PAYMENT SUCCESS
  // =========================
  await expect(page.locator('text=/Payment successful/i')).toBeVisible();

  // =========================
  // 11. Validate ORDER CONFIRMATION PAGE
  // =========================
  await expect(page.getByTestId('order-confirmation-page')).toBeVisible();
  await expect(page.getByTestId("order-success-section")).toBeVisible();
  await expect(page.getByTestId("payment-status")).toHaveText("Payment Confirmed");

   // =========================
  // 12. VALIDATE FLIP ANIMATION TEXT
  // =========================
  const orderTitle = page.getByTestId('order-title');
  await expect(orderTitle).toBeVisible();
  await expect(orderTitle.locator('h1')).toContainText(/Order Placed Successfully/i);
  await expect(page.getByTestId("order-title-productname")).toContainText(productName!);
  
  // =========================================
  // 13. VALIDATE EXPECTED DELIVERY DATE
  // =========================================
 const confirmationExpectedDelivery = page.getByTestId('delivery-info'); 
 const deliveryDate = confirmationExpectedDelivery.getByTestId("delivery-date");
 const deliveryText = confirmationExpectedDelivery.locator('p').nth(1);
 await expect(confirmationExpectedDelivery).toBeVisible();
await expect(confirmationExpectedDelivery.locator('h2')).toHaveText(/Estimated Delivery/i);
await expect(deliveryText).toHaveText(/Your order is packed with care and moving through processing./i);
 
const today = new Date();
// Add 3 days
today.setDate(today.getDate() + 3);
// Format: Friday, 27 March 2026
const expectedDate = today.toLocaleDateString('en-GB', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});
console.log(expectedDate);
await expect(deliveryDate).toHaveText(expectedDate);

  // =========================
  // 14. VALIDATE PRODUCT DATA
  // =========================
  const orderProductInfo = page.getByTestId("order-items");
  await expect(orderProductInfo.locator('h3')).toContainText(`Order Items (${productQty})`);
await expect(page.getByTestId("order-item-name")).toContainText(productName!);
await expect(page.getByTestId("order-item-quantity")).toContainText(productQty!);
await expect(page.getByTestId("order-item-price").locator('p').first()).toContainText(`₹${productPrice!}.00`);

  // =========================
  // 13. VALIDATE SHIPPING DATA
  // =========================
 const shippingInfo = page.getByTestId('shipping-address');
 await expect(shippingInfo.locator('p').first()).toHaveText(extractedAddress);
 await expect(shippingInfo.locator('p').nth(1)).toHaveText(`${extractedCity}, ${extractedState} ${extractedZip}`);
 await expect(page.getByTestId('contact-phone')).toHaveText(extractedPhone);
 await expect(page.getByTestId('contact-email')).toHaveText(extractedEmail);

// ==============================
  // 14. VALIDATE Order Summary
  // ============================
  const orderSummary = page.getByTestId('order-summary');
  await expect(orderSummary).toBeVisible();
  await expect(orderSummary.locator('h3')).toHaveText(/Order Summary/i);
  await expect(orderSummary.getByTestId("subtotal").locator("span").last()).toContainText(`₹${productPrice!}.00`);
  await expect(orderSummary.getByTestId("total-paid").locator("span").first()).toContainText("Total Paid");
  await expect(orderSummary.getByTestId("total-paid").locator("span").last()).toContainText(`₹${productPrice!}.00`);

  const today1 = new Date();

const formattedDate = `${today1.getDate()}/${today1.getMonth() + 1}/${today1.getFullYear()}`

await expect(orderSummary.getByTestId("order-date").locator("span").last()).toContainText(formattedDate);
await expect(orderSummary.getByTestId("payment-method").locator("span").last()).toContainText("upi");
await expect(orderSummary.getByTestId("order-status").locator("span").last()).toContainText("processing");

  // ==============================
  // 16. VALIDATE  BUTTONS
  // ==============================
  await expect(page.getByRole("button", { name: "View Order Details" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue Shopping" })).toBeVisible();

});

test('Order Confirmation Page View Order Details Buttons', async ({ browser  }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // =========================
  // 1. GO TO HOME
  // =========================
  await page.goto('/');

  const products = page.getByTestId('trending-product-card');

  const count = await products.count();
  expect(count).toBeGreaterThan(0); 

  // =========================
  // 2. SELECT RANDOM PRODUCT
  // =========================
  const randomIndex = Math.floor(Math.random() * count);
  const selectedProduct = products.nth(randomIndex);

  // Click product
  await selectedProduct.click();
 
  // =========================
  // 4. BUY NOW
  // =========================
  await page.getByRole('button', { name: /Buy Now/i }).click();

  await expect(page).toHaveURL(/checkout/);

  // =========================
  // 5. FILL SHIPPING + STORE DATA
  // =========================
 await page.locator('input[name="address"]').fill('vile parle , BKC road');
   await page.locator('input[name="city"]').fill('Mumbai');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('400002');
  await page.locator('input[name="phone"]').fill('9689769664');

  // =========================
  // 8. SELECT UPI
  // =========================
 const paymentSection = page.getByTestId('payment-method');
  await paymentSection.getByRole('button', { name: /UPI/i }).click();

  // =========================
  // 9. PROCEED TO PAYMENT
  // =========================
  await page.getByRole('button', { name: /Proceed to Payment/i }).click();
  const modal = page.getByTestId('payment-modal');
  await expect(modal).toBeVisible();

  // Open UPI help
  await page.getByRole('button', { name: /UPI Help/i }).click();

  const upiList = page.getByTestId('upi-ids');
  const upiOptions = upiList.locator('button');

  const upiCount = await upiOptions.count();
  const randomUPIIndex = Math.floor(Math.random() * upiCount);

  await upiOptions.nth(randomUPIIndex).click();

  // Pay
  await page.getByRole('button', { name: /Pay via UPI/i }).click();

  // =========================
  // 10. WAIT FOR PAYMENT SUCCESS
  // =========================
  await expect(page.locator('text=/Payment successful/i')).toBeVisible();

  // ==============================
  // 11. VALIDATE  BUTTONS
  // ==============================
  await expect(page.getByRole("button", { name: "View Order Details" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue Shopping" })).toBeVisible();
  await page.getByRole("button", { name: "View Order Details" }).click();
  await expect(page.getByText("Order Tracking")).toBeVisible();


});

test('Order Confirmation Page Continue Shopping Buttons', async ({ browser  }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // =========================
  // 1. GO TO HOME
  // =========================
  await page.goto('/');

  const products = page.getByTestId('trending-product-card');

  const count = await products.count();
  expect(count).toBeGreaterThan(0); 

  // =========================
  // 2. SELECT RANDOM PRODUCT
  // =========================
  const randomIndex = Math.floor(Math.random() * count);
  const selectedProduct = products.nth(randomIndex);

  // Click product
  await selectedProduct.click();
 
  // =========================
  // 4. BUY NOW
  // =========================
  await page.getByRole('button', { name: /Buy Now/i }).click();

  await expect(page).toHaveURL(/checkout/);

  // =========================
  // 5. FILL SHIPPING + STORE DATA
  // =========================
 await page.locator('input[name="address"]').fill('vile parle , BKC road');
   await page.locator('input[name="city"]').fill('Mumbai');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('400002');
  await page.locator('input[name="phone"]').fill('9689769664');

  // =========================
  // 8. SELECT UPI
  // =========================
 const paymentSection = page.getByTestId('payment-method');
  await paymentSection.getByRole('button', { name: /UPI/i }).click();

  // =========================
  // 9. PROCEED TO PAYMENT
  // =========================
  await page.getByRole('button', { name: /Proceed to Payment/i }).click();
  const modal = page.getByTestId('payment-modal');
  await expect(modal).toBeVisible();

  // Open UPI help
  await page.getByRole('button', { name: /UPI Help/i }).click();

  const upiList = page.getByTestId('upi-ids');
  const upiOptions = upiList.locator('button');

  const upiCount = await upiOptions.count();
  const randomUPIIndex = Math.floor(Math.random() * upiCount);

  await upiOptions.nth(randomUPIIndex).click();

  // Pay
  await page.getByRole('button', { name: /Pay via UPI/i }).click();

  // =========================
  // 10. WAIT FOR PAYMENT SUCCESS
  // =========================
  await expect(page.locator('text=/Payment successful/i')).toBeVisible();

  // ==============================
  // 11. VALIDATE  BUTTONS
  // ==============================
  await expect(page.getByRole("button", { name: "View Order Details" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue Shopping" })).toBeVisible();
  await page.getByRole("button", { name: "Continue Shopping" }).click();
  await expect(page).toHaveURL('/products');


});


