import { test } from '../../../core/fixtures/base.fixture';
import { NavbarAssertions } from '../../../validation/ui/common/navbarAssertions';

test.describe('Navbar Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Navbar visible', async ({ navbar }) => {
    await NavbarAssertions.expectNavbarVisible(navbar);
  });

  test('Search visible', async ({ navbar }) => {
    await NavbarAssertions.expectSearchVisible(navbar);
  });

  test('Icons visible', async ({ navbar }) => {
    await NavbarAssertions.expectIconsVisible(navbar);
  });

  test('Navigate to cart', async ({ navbarFlow, page }) => {
    await navbarFlow.goToCart();
    await NavbarAssertions.expectNavigationToCart(page);
  });

  test('Navigate to wishlist', async ({ navbarFlow, page }) => {
    await navbarFlow.goToWishlist();
    await NavbarAssertions.expectNavigationToWishlist(page);
  });

});