import { expect, type Locator } from '@playwright/test';

export class CartAssertions {

  static async expectText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  static async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  static async expectCount(locator: Locator, count: number): Promise<void> {
    await expect(locator).toHaveCount(count);
  }

  static expectNumber(actual: number, expected: number): void {
    expect(actual).toBe(expected);
  }

  static getPriceValue(text: string): number {
    return Number(text.replace(/[₹,]/g, '').trim());
  }
}