import { Page, Locator } from '@playwright/test';
import { UIActions } from '../../core/wrappers/uiActions';

export class DrawerComponent {
  readonly page: Page;

  readonly hamburger: Locator;
  readonly drawer: Locator;
  readonly closeBtn: Locator;

  // guest
  readonly loginOption: Locator;
  readonly homeLink: Locator;

  // profile
  readonly profileToggle: Locator;
  readonly subDrawer: Locator;
  readonly orders: Locator;
  readonly viewProfile: Locator;
  readonly notifications: Locator;
  readonly coupons: Locator;

  constructor(page: Page) {
    this.page = page;

    this.hamburger = page.getByTestId('navbar-hamburger');
    this.drawer = page.getByTestId('side-drawer');
    this.subDrawer = page.getByTestId('drawer-view-profile');
    this.closeBtn = page.getByTestId('drawer-close');

    this.loginOption = page.getByText('LOG IN');
    this.homeLink = page.getByTestId('drawer-home');

    this.profileToggle = page.getByTestId('drawer-profile-toggle');
    this.orders = page.getByTestId('drawer-orders');
    this.viewProfile = page.getByTestId('drawer-view-profile');
    this.notifications = page.getByTestId('drawer-notifications');
    this.coupons = page.getByTestId('drawer-coupons');
  }

  async openDrawer() {
    await UIActions.click(this.hamburger, 'Hamburger Menu');
  }

  async closeDrawer() {
    await UIActions.click(this.closeBtn, 'Drawer Close Button');
  }

  async clickHome() {
    await UIActions.click(this.homeLink, 'Home Link');
  }

  async clickLogin() {
    await UIActions.click(this.loginOption, 'Login Option');
  }

  async toggleProfile() {
    await UIActions.click(this.profileToggle, 'Profile Toggle');
  }

  async clickOrders() {
    await UIActions.click(this.orders, 'Orders');
  }

  async clickViewProfile() {
    await UIActions.click(this.viewProfile, 'View Profile');
  }

  async clickNotifications() {
    await UIActions.click(this.notifications, 'Notifications');
  }

  async clickCoupons() {
    await UIActions.click(this.coupons, 'Coupons');
  }
}