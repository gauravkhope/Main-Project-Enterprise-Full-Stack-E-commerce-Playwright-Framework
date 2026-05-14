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

test('UPI validation - empty input shows inline error', async ({ browser }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // =========================
  // Navigate → Checkout → Modal
  // =========================
  await page.goto('/');

  const productName = "Galaxy S25 ultra";

  await page.getByTestId("trending-product-card")
    .filter({ hasText: productName })
    .first()
    .click();

  await page.getByRole('button', { name: /Buy Now/i }).click();

  // Fill shipping
  await page.locator('input[name="address"]').fill('vile parle , BKC road');
   await page.locator('input[name="city"]').fill('Mumbai');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('400002');
  await page.locator('input[name="phone"]').fill('9689769664');

  // Select UPI
  const paymentSection = page.getByTestId('payment-method');
  await paymentSection.getByRole('button', { name: /UPI/i }).click();

  // Open modal
  await page.getByRole('button', { name: /Proceed to Payment/i }).click();

  const modal = page.getByTestId('payment-modal');
  await expect(modal).toBeVisible();

  // =========================
  // Select UPI Mode
  // =========================
  await modal.getByTestId('upi-mode-selector').selectOption('upi');

  // =========================
  // Click Pay WITHOUT entering UPI
  // =========================
  await modal.getByRole('button', { name: /Pay via UPI/i }).click();

  // =========================
  // Verify Inline Error
  // =========================
  const error = modal.getByText(/UPI ID is required/i);

  await expect(error).toBeVisible();

  // Optional explicit check
  expect(await error.isVisible()).toBeTruthy();

  await context.close();
});

test('UPI Payment - Random Token Success Flow', async ({ browser }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // =========================
  // Step 1: Navigate
  // =========================
  await page.goto('/');

  const productName = "Galaxy S25 ultra";
const  productCard = page.getByTestId("trending-product-card")
    .filter({ hasText: productName })
    .first();
    const productTitle = await productCard.locator("h3").textContent();
  const productPrice = await productCard.locator("p").textContent();
  await productCard.click();

  await page.getByRole('button', { name: /Buy Now/i }).click();

  // =========================
  // Step 2: Fill Shipping
  // =========================
 await page.locator('input[name="address"]').fill('vile parle , BKC road');
   await page.locator('input[name="city"]').fill('Mumbai');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('400002');
  await page.locator('input[name="phone"]').fill('9689769664');

  // =========================
  // Step 3: Select UPI
  // =========================
  const paymentSection = page.getByTestId('payment-method');
  await paymentSection.getByRole('button', { name: /UPI/i }).click();

  // =========================
  // Step 4: Open Payment Modal
  // =========================
  await page.getByRole('button', { name: /Proceed to Payment/i }).click();

  const modal = page.getByTestId('payment-modal');

  await expect(modal).toBeVisible();
  await expect(modal.getByTestId('payment-title')).toBeVisible();

   const orderInfo = modal.getByTestId('payment-product-info');
  await expect(orderInfo.locator('p').first()).toContainText("Product");
  await expect(orderInfo.locator('p').nth(1)).toContainText(productTitle!.trim());
  await expect(orderInfo.locator('p').nth(2)).toContainText("Amount");
  await expect(orderInfo.locator('p').last()).toContainText(productPrice!.trim());

  // =========================
  // Step 5: Verify UPI Selected
  // =========================
  await expect(
    modal.getByTestId('selected-payment-method')
  ).toContainText('UPI Payment');

  // =========================
  // Step 6: Select Mode
  // =========================
  await modal.getByTestId('upi-mode-selector').selectOption('upi');

  // =========================
  // Step 7: Open UPI Help
  // =========================
  await modal.getByRole('button', { name: /UPI Help/i }).click();

  const upiList = modal.getByTestId('upi-ids');
  const upiOptions = upiList.locator('button');

  const count = await upiOptions.count();

  // Random selection
  const randomIndex = Math.floor(Math.random() * count);
  const selectedUPIButton = upiOptions.nth(randomIndex);

  const selectedUPI = await selectedUPIButton.innerText();

  // Click selected UPI
  await selectedUPIButton.click();

  // =========================
  // Step 8: Verify Input Filled
  // =========================
  const upiInput = modal.getByPlaceholder('username@bankhandle');

  await expect(upiInput).toHaveValue(selectedUPI);

  // =========================
  // Step 9: Click Pay
  // =========================
  await modal.getByRole('button', { name: /Pay via UPI/i }).click();

  // =========================
  // Step 10: Verify Success
  // =========================
  await expect(
    modal.getByText(/Payment Successful/i)
  ).toBeVisible();

  await context.close();
});

test('UPI Payment - Random Invalid UPI → Failure', async ({ browser }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // =========================
  // Step 1: Navigate
  // =========================
  await page.goto('/');

  const productName = "Galaxy S25 ultra";

  await page.getByTestId("trending-product-card")
    .filter({ hasText: productName })
    .first()
    .click();

  await page.getByRole('button', { name: /Buy Now/i }).click();

  // =========================
  // Step 2: Fill Shipping
  // =========================
  await page.locator('input[name="address"]').fill('vile parle , BKC road');
   await page.locator('input[name="city"]').fill('Mumbai');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('400002');
  await page.locator('input[name="phone"]').fill('9689769664');

  // =========================
  // Step 3: Select UPI
  // =========================
  const paymentSection = page.getByTestId('payment-method');
  await paymentSection.getByRole('button', { name: /UPI/i }).click();

  // =========================
  // Step 4: Open Modal
  // =========================
  await page.getByRole('button', { name: /Proceed to Payment/i }).click();

  const modal = page.getByTestId('payment-modal');
  await expect(modal).toBeVisible();

  // =========================
  // Step 5: Select UPI Mode
  // =========================
  await modal.getByTestId('upi-mode-selector').selectOption('upi');

  // =========================
  // Step 6: Generate RANDOM INVALID UPI
  // =========================
  const randomString = Math.random().toString(36).substring(2, 10);
  const invalidUPI = `${randomString}@upi`;

  const upiInput = modal.getByPlaceholder('username@bankhandle');

  await upiInput.fill(invalidUPI);

  // =========================
  // Step 7: Click Pay
  // =========================
  await modal.getByRole('button', { name: /Pay via UPI/i }).click();

  // =========================
  // Step 8: Verify FAILURE TOAST
  // =========================
  await expect(
    page.getByText(/Payment failed/i)
  ).toBeVisible();

  await expect(
    page.getByText(/Payment Failed - Invalid or unlisted UPI ID/i)
  ).toBeVisible();

  // Optional strong validation (dynamic UPI in message)
  await expect(
    page.getByText(new RegExp(invalidUPI))
  ).toBeVisible();

  await context.close();
});


test('UPI Payment - Random Invalid UPI without @', async ({ browser }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // =========================
  // Step 1: Navigate
  // =========================
  await page.goto('/');

  const productName = "Galaxy S25 ultra";

  await page.getByTestId("trending-product-card")
    .filter({ hasText: productName })
    .first()
    .click();

  await page.getByRole('button', { name: /Buy Now/i }).click();

  // =========================
  // Step 2: Fill Shipping
  // =========================
  await page.locator('input[name="address"]').fill('vile parle , BKC road');
   await page.locator('input[name="city"]').fill('Mumbai');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('400002');
  await page.locator('input[name="phone"]').fill('9689769664');

  // =========================
  // Step 3: Select UPI
  // =========================
  const paymentSection = page.getByTestId('payment-method');
  await paymentSection.getByRole('button', { name: /UPI/i }).click();

  // =========================
  // Step 4: Open Modal
  // =========================
  await page.getByRole('button', { name: /Proceed to Payment/i }).click();

  const modal = page.getByTestId('payment-modal');
  await expect(modal).toBeVisible();

  // =========================
  // Step 5: Select UPI Mode
  // =========================
  await modal.getByTestId('upi-mode-selector').selectOption('upi');

  // =========================
  // Step 6: Generate RANDOM INVALID UPI
  // =========================
  const randomString = Math.random().toString(36).substring(2, 10);
  const invalidUPI = `${randomString}upi`;

  const upiInput = modal.getByPlaceholder('username@bankhandle');

  await upiInput.fill(invalidUPI);

  // =========================
  // Step 7: Click Pay
  // =========================
  await modal.getByRole('button', { name: /Pay via UPI/i }).click();
 
  // =========================
  // Verify Inline Error
  // =========================
  const error = modal.getByText("Invalid UPI ID format (example: username@okhdfcbank)");

  await expect(error).toBeVisible();

  // Optional explicit check
  expect(await error.isVisible()).toBeTruthy();
  
  await context.close();
});

test('COD flow - order placed successfully', async ({ browser }) => {

  const context = await browser.newContext({ storageState });
  const page = await context.newPage();

  // =========================
  // Navigate → Checkout
  // =========================
  await page.goto('/');

  const productName = "Galaxy S25 ultra";

  await page.getByTestId("trending-product-card")
    .filter({ hasText: productName })
    .first()
    .click();

  await page.getByRole('button', { name: /Buy Now/i }).click();

  // =========================
  // Fill Shipping
  // =========================
  await page.locator('input[name="address"]').fill('vile parle , BKC road');
   await page.locator('input[name="city"]').fill('Mumbai');
  await page.locator('input[name="state"]').fill('Maharashtra');
 await page.locator('input[name="zip"]').fill('400002');
  await page.locator('input[name="phone"]').fill('9689769664');

  // =========================
  // Select COD
  // =========================
  const paymentSection = page.getByTestId('payment-method');

  await paymentSection.getByRole('button', { name: /Cash On Delivery/i }).click();

  // =========================
  // Proceed to COD
  // =========================
  await page.getByRole('button', { name: /Proceed to COD/i }).click();

  // =========================
  // Verify COD Modal
  // =========================
  const modal = page.getByTestId('payment-modal');

  await expect(modal).toBeVisible();

await expect(modal.getByText("Cash on Delivery", { exact: true })).toBeVisible();
await expect(modal.getByRole('button', { name: /Confirm Cash on Delivery Order/i, exact: true })).toBeVisible();

  // =========================
  // Confirm COD Order
  // =========================
  await modal.getByRole('button', { 
    name: /Confirm Cash on Delivery Order/i 
  }).click();

await expect(page.getByText(/Order Confirmed/i)).toBeVisible();   

  // =========================
  // Verify Order Confirmation Page
  // =========================
  const orderPage = page.getByTestId('order-confirmation-page');

  await expect(orderPage).toBeVisible();

  await expect(page.getByText(/Order Placed Successfully/i)).toBeVisible();

  // =========================
  // Verify Toast Message
  // =========================
  await expect(page.getByText(/Order Confirmed/i)).toBeVisible();

  await context.close();
});
