// import { test, expect, Locator } from '@playwright/test';

// test.describe('Navbar - Hamburger Drawer', () => {

//   let hamburger: Locator;
//   let drawer: Locator;

//   test.beforeEach(async ({ page }) => {
//     await page.goto('/');

//     hamburger = page.getByTestId('navbar-hamburger');
//     drawer = page.getByTestId('side-drawer');
//   });

//   // ===============================
//   // 🔹 Drawer Visibility
//   // ===============================

//   test('Drawer is NOT visible by default', async () => {
//     await expect(drawer).toHaveCount(0); 
//   });

//   test('Drawer opens when hamburger is clicked', async () => {
//     await hamburger.click();
//     await expect(drawer).toBeVisible();
//   });

//   test('Drawer closes when close button is clicked', async () => {
//     await hamburger.click();

//     const closeBtn = drawer.getByTestId('drawer-close');
//     await closeBtn.click();

//     await expect(drawer).toHaveCount(0);
//   });

//   // ===============================
//   // 🔹 Navigation Items
//   // ===============================

//   test('Click HOME navigates to homepage', async ({ page }) => {
//     await hamburger.click();

//     await drawer.getByTestId('drawer-home').click();

//     await expect(page).toHaveURL('/');
//   });

//   // ===============================
//   // 🔹 Profile Dropdown (Authenticated Only)
//   // ===============================

//   test.describe('Profile Dropdown', () => {

//     test.beforeEach(async ({ page }) => {
//       await hamburger.click();
//        await page.getByText("Log In").click();
//         await page.getByPlaceholder("you@example.com").fill("gauravkhope31@gmail.com");
//   await page.locator("//input[@id='password']").fill("SmartShopGAURAV31");

//   await page.getByLabel("Remember me").check();
//  await page.getByRole("button", { name: "Sign In" }).click();
//     });

//     test('Profile dropdown expands and collapses', async ({ page }) => {

//       const profileToggle = drawer.getByTestId('drawer-profile-toggle');

//       await profileToggle.click();
//       await expect(
//         drawer.getByTestId('drawer-orders')
//       ).toBeVisible();

//       // Collapse
//       await profileToggle.click();

//       await expect(
//         drawer.getByTestId('drawer-orders')
//       ).toHaveCount(0);
//     });

//     test('Navigate to Orders page', async ({ page }) => {

//       await drawer.getByTestId('drawer-profile-toggle').click();
//       await drawer.getByTestId('drawer-orders').click();

//       await expect(page).toHaveURL(/orders/);
//     });

//     test('Navigate to View Profile page', async ({ page }) => {

//       await drawer.getByTestId('drawer-profile-toggle').click();
//       await drawer.getByTestId('drawer-view-profile').click();

//       await expect(page).toHaveURL(/my-profile\/view-profile/);
//     });

//     test('Navigate to Notifications page', async ({ page }) => {

//       await drawer.getByTestId('drawer-profile-toggle').click();
//       await drawer.getByTestId('drawer-notifications').click();

//       await expect(page).toHaveURL(/notifications/);
//     });

//     test('Navigate to Coupons page', async ({ page }) => {

//       await drawer.getByTestId('drawer-profile-toggle').click();
//       await drawer.getByTestId('drawer-coupons').click();

//       await expect(page).toHaveURL(/coupons/);
//     });

//   });

// });


import { test, expect, Locator } from '@playwright/test';

test.describe('Navbar - Hamburger Drawer', () => {

  let hamburger: Locator;
  let drawer: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    hamburger = page.getByTestId('navbar-hamburger');
    drawer = page.getByTestId('side-drawer');
  });

  // ==========================================
  // 🔹 Drawer Visibility (Guest)
  // ==========================================

  test('Drawer is NOT visible by default', async () => {
    await expect(drawer).toHaveCount(0);
  });

  test('Drawer opens when hamburger is clicked', async () => {
    await hamburger.click();
    await expect(drawer).toBeVisible();
  });

  test('Drawer closes when close button is clicked', async ({ page }) => {
    await hamburger.click();

    const closeBtn = page.getByTestId('drawer-close');
    await closeBtn.click();

    await expect(drawer).toHaveCount(0);
  });

  // ==========================================
  // 🔹 Guest Navigation
  // ==========================================

  test('Guest sees Login option', async ({ page }) => {
    await hamburger.click();
    await expect(page.getByText('LOG IN')).toBeVisible();
  });

  test('Click HOME navigates to homepage', async ({ page }) => {
    await hamburger.click();
    await page.getByTestId('drawer-home').click();
    await expect(page).toHaveURL('/');
  });

  // ==========================================
  // 🔹 Profile Dropdown (Authenticated)
  // ==========================================

  test.describe('Profile Dropdown (After Login)', () => {

    test.beforeEach(async ({ page }) => {

      // Open drawer
      await page.getByTestId('navbar-hamburger').click();

      // Go to login
      await page.getByText('LOG IN').click();

      // Fill login form
      await page.getByPlaceholder('you@example.com')
        .fill('gauravkhope31@gmail.com');

      await page.getByLabel('Password')
        .fill('SmartShopGAURAV31');

      await page.getByLabel('Remember me').check();

      // Wait for navigation
      await Promise.all([
        page.waitForNavigation(),
        page.getByRole('button', { name: 'Sign In' }).click()
      ]);

      await expect(page).toHaveURL('/');

      // Re-open drawer AFTER login
      await page.getByTestId('navbar-hamburger').click();

      // Ensure profile toggle exists
      await expect(
        page.getByTestId('drawer-profile-toggle')
      ).toBeVisible();

    });

    test('Profile dropdown expands and collapses', async ({ page }) => {

      const profileToggle = page.getByTestId('drawer-profile-toggle');

      await profileToggle.click();

      await expect(
        page.getByTestId('drawer-orders')
      ).toBeVisible();

      // Collapse
      await profileToggle.click();

      await expect(
        page.getByTestId('drawer-orders')
      ).toHaveCount(0);
    });

    test('Navigate to Orders page', async ({ page }) => {

      await page.getByTestId('drawer-profile-toggle').click();
      await page.getByTestId('drawer-orders').click();

      await expect(page).toHaveURL(/orders/);
    });

    test('Navigate to View Profile page', async ({ page }) => {

      await page.getByTestId('drawer-profile-toggle').click();
      await page.getByTestId('drawer-view-profile').click();

      await expect(page).toHaveURL(/my-profile\/view-profile/);
    });

    test('Navigate to Notifications page', async ({ page }) => {

      await page.getByTestId('drawer-profile-toggle').click();
      await page.getByTestId('drawer-notifications').click();

      await expect(page).toHaveURL(/notifications/);
    });

    test('Navigate to Coupons page', async ({ page }) => {

      await page.getByTestId('drawer-profile-toggle').click();
      await page.getByTestId('drawer-coupons').click();

      await expect(page).toHaveURL(/coupons/);
    });

  });

});
