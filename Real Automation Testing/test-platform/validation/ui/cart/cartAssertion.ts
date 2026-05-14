import { expect, type Locator } from '@playwright/test';

export class CartAssertions {

  static async expectHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  static async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  static async expectText(locator: Locator, text: RegExp | string): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  static async expectCartCount(locator: Locator, value: string): Promise<void> {
    await expect(locator).toHaveText(value);
  }

  static async expectToast(toast: Locator, message: string | RegExp): Promise<void> {
    await expect(toast).toBeVisible();
    await expect(toast).toHaveText(message);
  }
}