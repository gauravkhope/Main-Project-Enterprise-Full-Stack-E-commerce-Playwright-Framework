import { expect, Page } from '@playwright/test';
import { NavbarComponent } from '../../../ui/components/navbar.component';

export class NavbarAssertions {

  static async expectNavbarVisible(navbar: NavbarComponent) {
    await expect(navbar.navbar).toBeVisible();
  }

  static async expectSearchVisible(navbar: NavbarComponent) {
    await expect(navbar.searchInput).toBeVisible();
    await expect(navbar.searchButton).toBeVisible();
  }

  static async expectIconsVisible(navbar: NavbarComponent) {
    await expect(navbar.wishlist).toBeVisible();
    await expect(navbar.cart).toBeVisible();
  }

  static async expectNavigationToCart(page: Page) {
    await expect(page).toHaveURL(/cart/);
  }

  static async expectNavigationToWishlist(page: Page) {
    await expect(page).toHaveURL(/wishlist/);
  }
}