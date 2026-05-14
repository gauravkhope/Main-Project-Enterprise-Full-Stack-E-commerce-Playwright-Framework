import { Page, Locator } from '@playwright/test';
import { UIActions } from '../../core/wrappers/uiActions';

export class NavbarComponent {
  readonly page: Page;

  readonly navbar: Locator;
  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly wishlist: Locator;
  readonly cart: Locator;
  readonly profileAvatar: Locator;
  readonly profileName: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navbar = page.getByTestId('navbar');
    this.logo = page.getByTestId('navbar-logo');
    this.searchInput = page.getByTestId('navbar-search-input');
    this.searchButton = page.getByTestId('navbar-search-button');
    this.wishlist = page.getByTestId('navbar-wishlist');
    this.cart = page.getByTestId('navbar-cart');
    this.profileAvatar = page.getByTestId('navbar-profile-avatar');
    this.profileName = page.getByTestId('navbar-profile-name');
  }

  async clickLogo() {
    await UIActions.click(this.logo, 'Navbar Logo');
  }

  async clickCart() {
    await UIActions.click(this.cart, 'Cart Icon');
  }

  async clickWishlist() {
    await UIActions.click(this.wishlist, 'Wishlist Icon');
  }
}