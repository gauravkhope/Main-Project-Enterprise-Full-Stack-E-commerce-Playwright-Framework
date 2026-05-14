import { DrawerComponent } from '../../components/drawer.component';

export class DrawerFlow {
  constructor(private drawer: DrawerComponent) {}

  async open() {
    await this.drawer.openDrawer();
  }

  async close() {
    await this.drawer.closeDrawer();
  }

  async goToHome() {
    await this.drawer.clickHome();
    await this.drawer.page.waitForURL('/');
  }

  async goToLogin() {
    await this.drawer.clickLogin();
  }

  async openProfileMenu() {
    await this.drawer.toggleProfile();
  }

  async goToOrders() {
    await this.drawer.clickOrders();
  }

  async goToProfile() {
    await this.drawer.clickViewProfile();
  }

  async goToNotifications() {
    await this.drawer.clickNotifications();
  }

  async goToCoupons() {
    await this.drawer.clickCoupons();
  }
}