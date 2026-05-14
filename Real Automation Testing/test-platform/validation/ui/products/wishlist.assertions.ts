import { expect, type Locator } from '@playwright/test';

export class WishlistAssertions {

  static async expectHeartFilled(icon: Locator): Promise<void> {
    await expect(icon).toHaveClass(/fill-\[url/);
  }

  static async expectHeartNotFilled(icon: Locator): Promise<void> {
    await expect(icon).not.toHaveClass(/fill-\[url/);
  }

  static async expectNavbarActive(navbar: Locator): Promise<void> {
    await expect(navbar.locator('svg')).toHaveClass(/fill-red-500/);
  }

  static async expectNavbarInactive(navbar: Locator): Promise<void> {
    await expect(navbar.locator('svg')).not.toHaveClass(/fill-red-500/);
  }

  static async expectCount(countLocator: Locator, value: number): Promise<void> {
    await expect(countLocator).toHaveText(String(value));
  }

  static async expectCountZero(countLocator: Locator): Promise<void> {
    await expect(countLocator).toHaveCount(0);
  }

  static async expectToast(toast: Locator, message: string | RegExp): Promise<void> {
    await expect(toast).toBeVisible();
    await expect(toast).toHaveText(message);
  }

  static async expectWishlistItemVisible(items: Locator, name: string): Promise<void> {
    await expect(items.first()).toBeVisible();
    await expect(items.first().locator('h3')).toHaveText(name);
  }

  static async expectWishlistCount(items: Locator, count: number): Promise<void> {
    await expect(items).toHaveCount(count);
  }

  static async expectEmptyWishlist(message: Locator): Promise<void> {
    await expect(message).toBeVisible();
  }
}