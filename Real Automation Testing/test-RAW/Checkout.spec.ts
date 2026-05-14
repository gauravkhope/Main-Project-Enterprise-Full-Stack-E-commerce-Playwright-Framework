import { test, expect, BrowserContext } from '@playwright/test';

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


// 🧪 TEST CASE
test('Navigate from Home → PDP → Checkout', async ({ browser }) => {

  // 👉 Create new context using stored login
  const context: BrowserContext = await browser.newContext({
    storageState,
  });

  const page = await context.newPage();

  // Step 1: Go to Home Page
  await page.goto('/');

  const productName = "Galaxy S25 ultra";

  // Step 2: Click on Product
  const productCard = page.getByTestId("trending-product-card");
  await productCard.filter({ hasText: productName }).first().click();

  // Step 3: Verify PDP opened
  await expect(page).toHaveURL(/home-product/);

  // Step 4: Click Buy Now
  await page.getByRole('button', { name: /Buy Now/i }).click();

  // Step 5: Verify Checkout page
  await expect(page).toHaveURL(/checkout/);

  await context.close();
});


test('Checkout validation - empty form shows toast', async ({ browser }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // Step 1: Go to Home
  await page.goto('/');

  const productName = "Galaxy S25 ultra";

  // Step 2: Open PDP
  const productCard = page.getByTestId("trending-product-card");
  await productCard.filter({ hasText: productName }).first().click();

  await expect(page).toHaveURL(/home-product/);

  // Step 3: Buy Now → Checkout
  await page.getByRole('button', { name: /Buy Now/i }).click();
  await expect(page).toHaveURL(/checkout/);

  // Step 4: Click Proceed without filling form
  await page.getByRole('button', { name: /Proceed to Payment/i }).click();

  // Step 5: Verify Toast Message
  await expect(
    page.getByText(/Please fill in all shipping fields/i)
  ).toBeVisible();

  // Step 6: Ensure still on checkout page
  await expect(page).toHaveURL(/checkout/);

  await context.close();
});

test('Checkout valid form → opens payment modal', async ({ browser }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // Step 1: Go to Home
  await page.goto('/');

  const productName = "Galaxy S25 ultra";

  // Step 2: Open PDP
  const productCard = page.getByTestId("trending-product-card");
  await productCard.filter({ hasText: productName }).first().click();

  await expect(page).toHaveURL(/home-product/);

  // Step 3: Buy Now → Checkout
  await page.getByRole('button', { name: /Buy Now/i }).click();
  await expect(page).toHaveURL(/checkout/);

  // =========================
  // Step 4: Fill Shipping Form
  // =========================
  await page.locator('input[name="address"]').fill('123 Main St');;
  await page.locator('input[name="city"]').fill('Akola');
  await page.locator('input[name="state"]').fill('Maharashtra');
  await expect(page.locator('input[name="country"]')).toHaveValue('India');
  await expect(page.locator('input[name="country"]')).toBeDisabled();
  await page.locator('input[name="zip"]').fill('444001');
  await page.locator('input[name="phone"]').fill('9689769664');
  await expect(page.locator('input[name="email"]')).toHaveValue('rameshkhope622@gmail.com');

  // =========================
// Step 5: Proceed to Payment
// =========================
await page.getByRole('button', { name: /Proceed to Payment/i }).click();

// =========================
// Step 6: Verify Payment Modal
// =========================
const modal = page.getByTestId('payment-modal');

await expect(modal).toBeVisible();

// Strong validation (inside modal)
await expect(modal.getByTestId('payment-title')).toBeVisible();

// Optional: verify order info present
await expect(modal).toContainText('Order #');

await context.close();
});


test('Card validation - empty fields show errors', async ({ browser }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // Navigate → Checkout → Modal (reuse flow)
  await page.goto('/');

  const productName = "Galaxy S25 ultra";

  const productCard = page.getByTestId("trending-product-card");
  await productCard.filter({ hasText: productName }).first().click();

  await page.getByRole('button', { name: /Buy Now/i }).click();

  // Fill shipping
  await page.locator('input[name="address"]').fill('123 Main St');
   await page.locator('input[name="city"]').fill('Akola');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('444001');
  await page.locator('input[name="phone"]').fill('9689769664');

  await page.getByRole('button', { name: /Proceed to Payment/i }).click();

  const modal = page.getByTestId('payment-modal');
  await expect(modal).toBeVisible();

  // =========================
  // Click Confirm Card (EMPTY)
  // =========================
  await modal.getByTestId('confirm-card').click();

  // =========================
  // Validate Errors (isVisible)
  // =========================
  const cardError = modal.getByText(/Card number is required/i);
  const cvvError = modal.getByText(/CVV is required/i);
  const expiryError = modal.getByText(/Expiry date is required/i);

  await expect(cardError).toBeVisible();
  await expect(cvvError).toBeVisible();
  await expect(expiryError).toBeVisible();

  // Extra (explicit isVisible usage)
  expect(await cardError.isVisible()).toBeTruthy();
  expect(await cvvError.isVisible()).toBeTruthy();
  expect(await expiryError.isVisible()).toBeTruthy();

  await context.close();
});

test('Card validation - random invalid card shows error', async ({ browser }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // Navigate → Checkout → Modal
  await page.goto('/');

  const productName = "Galaxy S25 ultra";

  await page.getByTestId("trending-product-card")
    .filter({ hasText: productName })
    .first()
    .click();

  await page.getByRole('button', { name: /Buy Now/i }).click();

  // Fill shipping
  await page.locator('input[name="address"]').fill('123 Main St');
   await page.locator('input[name="city"]').fill('Akola');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('444001');
  await page.locator('input[name="phone"]').fill('9689769664');


  await page.getByRole('button', { name: /Proceed to Payment/i }).click();

  const modal = page.getByTestId('payment-modal');
  await expect(modal).toBeVisible();

  // =========================
  // Generate RANDOM DATA
  // =========================
  const randomCard = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 10)
  ).join('');

  const randomCVV = Math.floor(100 + Math.random() * 900).toString();

  const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const randomYear = String(26 + Math.floor(Math.random() * 5)); // 2026-2030
  const expiry = `${randomMonth}/${randomYear}`;

  // =========================
  // Fill Card Details
  // =========================
  await modal.getByTestId('card-number').fill(randomCard);
  await modal.getByTestId('cvv').fill(randomCVV);
  await modal.getByTestId('expiry').fill(expiry);

  await modal.getByTestId('confirm-card').click();

  // =========================
  // Validate Error
  // =========================
  const error = modal.getByText(/Invalid demo card/i);

  await expect(error).toBeVisible();

  // Optional explicit check
  expect(await error.isVisible()).toBeTruthy();

  await context.close();
});

test('Card validation - random invalid card with mismatched CVV shows error', async ({ browser }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // Navigate → Checkout → Modal
  await page.goto('/');

  const productName = "Galaxy S25 ultra";

  await page.getByTestId("trending-product-card")
    .filter({ hasText: productName })
    .first()
    .click();

  await page.getByRole('button', { name: /Buy Now/i }).click();

  // Fill shipping
  await page.locator('input[name="address"]').fill('123 Main St');
   await page.locator('input[name="city"]').fill('Akola');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('444001');
  await page.locator('input[name="phone"]').fill('9689769664');


  await page.getByRole('button', { name: /Proceed to Payment/i }).click();

  const modal = page.getByTestId('payment-modal');
  await expect(modal).toBeVisible();

  // =========================
  // Generate RANDOM DATA
  // =========================
  const randomCard = "4624893621784242"; // Valid format but in demo allowlist
  

  const randomCVV = Math.floor(100 + Math.random() * 900).toString();

  const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const randomYear = String(26 + Math.floor(Math.random() * 5)); // 2026-2030
  const expiry = `${randomMonth}/${randomYear}`;

  // =========================
  // Fill Card Details
  // =========================
  await modal.getByTestId('card-number').fill(randomCard);
  await modal.getByTestId('cvv').fill(randomCVV);
  await modal.getByTestId('expiry').fill(expiry);

  await modal.getByTestId('confirm-card').click();

  // =========================
  // Validate Error
  // =========================
  const error = modal.getByText(/CVV does not match this demo card/i);

  await expect(error).toBeVisible();

  // Optional explicit check
  expect(await error.isVisible()).toBeTruthy();

  await context.close();
});

test('Valid card → payment confirmed → place order → success', async ({ browser }) => {
  test.setTimeout(60000); // Increase timeout for this end-to-end flow
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // Navigate → Checkout → Modal
  await page.goto('/');

  const productName = "Galaxy Fold 7";
  const  productCard = page.getByTestId("trending-product-card")
  .filter({ hasText: productName })
  .first();
  
  const productTitle = await productCard.locator("h3").textContent();
  const productPrice = await productCard.locator("p").textContent();
  await productCard.click();

  await page.getByRole('button', { name: /Buy Now/i }).click();

  // Fill shipping
  await page.locator('input[name="address"]').fill('123 Main St');
   await page.locator('input[name="city"]').fill('Akola');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('444001');
  await page.locator('input[name="phone"]').fill('9689769664');

  // Select Payment Method and Proceed
  const paymentTypeBlock = page.getByTestId("payment-method")
  await expect(paymentTypeBlock).toBeVisible();
  await expect(paymentTypeBlock.locator("h2")).toContainText("Payment Method");
  await expect(paymentTypeBlock.getByRole('button', { name: "Credit / Debit Card" })).toBeVisible();
  await paymentTypeBlock.getByRole('button', { name: "Credit / Debit Card" }).click();
  await page.getByRole('button', { name: /Proceed to Payment/i }).click();

  const modal = page.getByTestId('payment-modal');
  await expect(modal).toBeVisible();

  const orderInfo = modal.getByTestId('payment-product-info');
  await expect(orderInfo.locator('p').first()).toContainText("Product");
  await expect(orderInfo.locator('p').nth(1)).toContainText(productTitle!.trim());
  await expect(orderInfo.locator('p').nth(2)).toContainText("Amount");
  await expect(orderInfo.locator('p').last()).toContainText(`${productPrice!.trim()}.00`);
  // =========================
  // Open Test Tokens
  // =========================
  await modal.getByRole('button', { name: /Test Tokens/i }).click();

  const tokens = modal.getByTestId('card-token');
  const count = await tokens.count();

  const randomIndex = Math.floor(Math.random() * count);
  const randomToken = tokens.nth(randomIndex);

  const last4 = await randomToken.locator('span').first().innerText();
  const cvvText = await randomToken.locator('span').last().innerText();
  const cvv = cvvText.replace('CVV ', '').trim();

  // Generate card
  const first12 = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10)
  ).join('');

  const cardNumber = first12 + last4;

  // Expiry
  const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const randomYear = String(26 + Math.floor(Math.random() * 10)); // 2026-2035
  const expiry = `${randomMonth}${randomYear}`;

  // Fill
  await modal.getByTestId('card-number').fill(cardNumber);
  await modal.getByTestId('cvv').fill(cvv);
  await modal.getByTestId('expiry').fill(expiry);

  await modal.getByTestId('confirm-card').click();

  // =========================
  // ✅ PAYMENT CONFIRMED PAGE VALIDATION
  // =========================
  await expect(modal.getByText(/Payment Confirmed/i)).toBeVisible();

  // Masked card visible (last 4 digits)
  await expect(modal.getByText(new RegExp(last4))).toBeVisible();

  // Place Order button visible with text
  const placeOrderBtn = modal.getByRole('button', { name: /Place Order/i });
  await expect(placeOrderBtn).toBeVisible();

  // =========================
  // Click Place Order
  // =========================
  await placeOrderBtn.click();

  // =========================
  // ✅ PAYMENT SUCCESS VALIDATION
  // =========================
  await expect(modal.getByText(/Payment Successful/i)).toBeVisible();

  // Toast validation
  await expect(
    page.getByText(/Payment successful! Order placed/i)
  ).toBeVisible();

  await context.close();
});

test('Cancel button closes payment modal', async ({ browser }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // Navigate → Checkout → Modal
  await page.goto('/');

  const productName = "Galaxy S25 ultra";

  await page.getByTestId("trending-product-card")
    .filter({ hasText: productName })
    .first()
    .click();

  await page.getByRole('button', { name: /Buy Now/i }).click();

  // Fill shipping
  await page.locator('input[name="address"]').fill('123 Main St');
   await page.locator('input[name="city"]').fill('Akola');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('444001');
  await page.locator('input[name="phone"]').fill('9689769664');
  await page.getByRole('button', { name: /Proceed to Payment/i }).click();

  const modal = page.getByTestId('payment-modal');
  await expect(modal).toBeVisible();

  // =========================
  // Click Cancel
  // =========================
  await modal.getByTestId('cancel-card').click();

  // =========================
  // Verify Modal Closed
  // =========================
  await expect(modal).not.toBeVisible();

  // Optional: ensure back on checkout page
  await expect(page).toHaveURL(/checkout/);

  await context.close();
});

test('Recovery flow - invalid card → fix → success', async ({ browser }) => {

test.setTimeout(60000); // Increase timeout for this end-to-end flow
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // Navigate → Checkout → Modal
  await page.goto('/');

  const productName = "Galaxy S25 ultra";

  await page.getByTestId("trending-product-card")
    .filter({ hasText: productName })
    .first()
    .click();

  await page.getByRole('button', { name: /Buy Now/i }).click();

  // Fill shipping
  await page.locator('input[name="address"]').fill('123 Main St');
   await page.locator('input[name="city"]').fill('Akola');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('444001');
  await page.locator('input[name="phone"]').fill('9689769664');

  await page.getByRole('button', { name: /Proceed to Payment/i }).click();

  const modal = page.getByTestId('payment-modal');
  await expect(modal).toBeVisible();

  // =========================
  // STEP 1: INVALID CARD
  // =========================
  await modal.getByTestId('card-number').fill('1111222233339999');
  await modal.getByTestId('cvv').fill('123');
  await modal.getByTestId('expiry').fill('1228');

  await modal.getByTestId('confirm-card').click();

  const error = modal.getByText(/Invalid demo card/i);
  await expect(error).toBeVisible();

  // =========================
  // STEP 2: FIX WITH VALID TOKEN
  // =========================
  await modal.getByRole('button', { name: /Test Tokens/i }).click();

  const tokens = modal.getByTestId('card-token');
  const count = await tokens.count();

  const randomIndex = Math.floor(Math.random() * count);
  const randomToken = tokens.nth(randomIndex);

  const last4 = await randomToken.locator('span').first().innerText();
  const cvvText = await randomToken.locator('span').last().innerText();
  const cvv = cvvText.replace('CVV ', '').trim();

  // Generate valid card
  const first12 = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10)
  ).join('');

  const validCard = first12 + last4;

  // Clear old values (IMPORTANT)
  await modal.getByTestId('card-number').fill('');
  await modal.getByTestId('cvv').fill('');
  await modal.getByTestId('expiry').fill('');

  // Fill correct values
  const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const randomYear = String(26 + Math.floor(Math.random() * 5));
  const expiry = `${randomMonth}${randomYear}`;

  await modal.getByTestId('card-number').fill(validCard);
  await modal.getByTestId('cvv').fill(cvv);
  await modal.getByTestId('expiry').fill(expiry);

  await modal.getByTestId('confirm-card').click();

  // =========================
  // STEP 3: SUCCESS
  // =========================
  await expect(modal.getByText(/Payment Confirmed/i)).toBeVisible();

  await context.close();
});