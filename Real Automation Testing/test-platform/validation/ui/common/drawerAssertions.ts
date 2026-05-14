import { expect , Page } from '@playwright/test';
import { DrawerComponent } from '../../../ui/components/drawer.component';

export class DrawerAssertions {

  static async expectDrawerHidden(drawer: DrawerComponent) {
    await expect(drawer.subDrawer).toHaveCount(0);
  }

  static async expectDrawerVisible(drawer: DrawerComponent) {
    await expect(drawer.subDrawer).toBeVisible();
  }

  static async expectLoginVisible(drawer: DrawerComponent) {
    await expect(drawer.loginOption).toBeVisible();
  }

  static async expectOrdersVisible(drawer: DrawerComponent) {
    await expect(drawer.orders).toBeVisible();
  }

  static async expectNavigation(page : Page, url: RegExp | string) {
    await expect(page).toHaveURL(url);
  }
}