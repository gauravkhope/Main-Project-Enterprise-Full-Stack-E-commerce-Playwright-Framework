import { test, expect } from "@playwright/test";

// User trying to login with empty credentials should see error message
test("User cannot login with empty credentials", async ({ page }) => {
  await page.goto("/");

  // 1. Open hamburger menu
  await page.locator("#hamburger-menu").click();

  // 2. Click login option
  await page.getByText("Log In").click();

  // 3. Fill credentials
  await page.getByPlaceholder("you@example.com").fill("");
  await page.locator("//input[@id='password']").fill("");

  await page.getByLabel("Remember me").check();

  // 4. Submit login
  await page.getByRole("button", { name: "Sign In" }).click();

  // 5. verify validation messages
  const form = page.locator("form");
  await expect(form.getByText("Email is required")).toBeVisible();
  await expect(form.getByText("Password is required")).toBeVisible();
});



// User trying to login with both wrong credentials should see error message
test("User cannot login with invalid credentials", async ({ page }) => {
  await page.goto("/");

  // 1. Open hamburger menu
  await page.locator("#hamburger-menu").click();

  // 2. Click login option
  await page.getByText("Log In").click();

  // 3. Fill credentials
  await page.getByPlaceholder("you@example.com").fill("test@example.com");
  await page.locator("//input[@id='password']").fill("password123");

  await page.getByLabel("Remember me").check();

  // 4. Submit login
  await page.getByRole("button", { name: "Sign In" }).click();

  // 5. Verify error message
  const loginErrorToast = page.getByRole("status");
  await expect(loginErrorToast).toBeVisible();
  await expect(loginErrorToast).toHaveText(/invalid email or password/i);
});



// User trying to login with invalid password should see error message
test("User cannot login with invalid password", async ({ page }) => {
  await page.goto("/");

  // 1. Open hamburger menu
  await page.locator("#hamburger-menu").click();

  // 2. Click login option
  await page.getByText("Log In").click();

  // 3. Fill credentials
  await page.getByPlaceholder("you@example.com").fill("gauravkhope31@gmail.com");

     // 12 digit random password generator
  function generatePassword(length = 12) {
    const chars =
      "abcdefghijklmnopqrstuvwxyzQWERTYUIOPASDFGHJKLZXCVBNM0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `Pass_${result}`;
  }
  const randomPassword = generatePassword();
  await page.locator("#password").fill(randomPassword);
  console.log("Generated random password:", randomPassword);
  await page.locator("//button[@class='absolute inset-y-0 right-0 pr-3 flex items-center']//*[name()='svg']").click();

  await page.getByLabel("Remember me").check();

  // 4. Submit login
  await page.getByRole("button", { name: "Sign In" }).click();

  // 5. Verify error message
  const loginErrorToast = page.getByRole("status");
  await expect(loginErrorToast).toBeVisible();
  await expect(loginErrorToast).toHaveText(/invalid email or password/i);
});



// User trying to login with right credentials should see welcome message
test("User can login with valid credentials", async ({ page }) => {
  await page.goto("/");

  // 1. Open hamburger menu
  await page.locator("#hamburger-menu").click();

  // 2. Click login option
  await page.getByText("Log In").click();

  // 3. Fill credentials
  await page.getByPlaceholder("you@example.com").fill("gauravkhope31@gmail.com");
  await page.locator("//input[@id='password']").fill("SmartShopGAURAV31");

  await page.getByLabel("Remember me").check();

  // 4. Submit login
  await page.getByRole("button", { name: "Sign In" }).click();

  // 5. Verify success message
  const welcomeMessage = page.getByRole("status");
  await expect(welcomeMessage).toBeVisible();
  await expect(welcomeMessage).toHaveText(/Welcome back, GAURAV!/i);
});
