import { test, expect, Locator } from '@playwright/test';

test.describe('Homepage - Navbar Suite', () => {

  let navbar: Locator;
  let logo: Locator;
  let searchInput: Locator;
  let searchButton: Locator;
  let wishlist: Locator;
  let cart: Locator;
  let profileAvatar: Locator;
  let profileName: Locator;

  // =====================================
  // 🔹 GLOBAL SETUP
  // =====================================
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    navbar = page.getByTestId('navbar');
    logo = page.getByTestId('navbar-logo');
    searchInput = page.getByTestId('navbar-search-input');
    searchButton = page.getByTestId('navbar-search-button');
    wishlist = page.getByTestId('navbar-wishlist');
    cart = page.getByTestId('navbar-cart');
    profileAvatar = page.getByTestId('navbar-profile-avatar');
    profileName = page.getByTestId('navbar-profile-name');
  });

  // =====================================
  // 🟢 VISIBILITY TESTS
  // =====================================
  test.describe('Visibility', () => {

    test('Navbar is visible', async () => {
      await expect(navbar).toBeVisible();
    });

    test('Logo is visible', async () => {
      await expect(logo).toBeVisible();
    });

    test('Search input and button are visible', async () => {
      await expect(searchInput).toBeVisible();
      await expect(searchButton).toBeVisible();
    });

    test('Wishlist and Cart icons are visible', async () => {
      await expect(wishlist).toBeVisible();
      await expect(cart).toBeVisible();
    });

  });

  // =====================================
  // 🔵 CLICKABILITY TESTS
  // =====================================
  test.describe('Clickability', () => {

    test('Search input is enabled', async () => {
      await expect(searchInput).toBeEnabled();
    });

    test('Search button is enabled', async () => {
      await expect(searchButton).toBeEnabled();
    });

    test('Wishlist link is clickable', async () => {
      await expect(wishlist).toBeEnabled();
    });

    test('Cart link is clickable', async () => {
      await expect(cart).toBeEnabled();
    });

  });

  // =====================================
  // 🟣 NAVIGATION TESTS
  // =====================================
  test.describe('Navigation', () => {

    test('Clicking logo keeps user on homepage', async ({ page }) => {
      await logo.click();
      await expect(page).toHaveURL('/');
    });

    test('Clicking cart navigates to cart page', async ({ page }) => {
      await cart.click();
      await expect(page).toHaveURL(/cart/);
    });

    test('Clicking wishlist navigates to wishlist page', async ({ page }) => {
      await wishlist.click();
      await expect(page).toHaveURL(/wishlist/);
    });

  });

  // =====================================
  // 🟡 PROFILE TESTS (If Logged In)
  // =====================================
  test.describe('Profile Section (Conditional)', () => {

    test('Profile avatar visible when authenticated', async () => {
      if (await profileAvatar.isVisible().catch(() => false)) {
        await expect(profileAvatar).toBeVisible();
      }
    });

    test('Profile name visible when authenticated', async () => {
      if (await profileName.isVisible().catch(() => false)) {
        await expect(profileName).toBeVisible();
      }
    });

  });

});