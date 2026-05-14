import { expect, Page } from '@playwright/test';
import { TrendingComponent } from '../../../ui/components/trending.component';

export class TrendingAssertions {

  static async expectSectionVisible(trending: TrendingComponent) {
    await expect(trending.section).toBeVisible();
  }

  static async expectProductsExist(trending: TrendingComponent) {
    const count = await trending.products.count();
    expect(count).toBeGreaterThan(0);
  }

  static async expectProductDetails(trending: TrendingComponent) {
    const count = await trending.products.count();

    for (let i = 0; i < count; i++) {
      const product = trending.products.nth(i);

      await expect(product.locator('h3')).toBeVisible();
      const price = product.locator('p');

      await expect(price).toBeVisible();

      const text = await price.textContent();
      expect(text).toMatch(/₹[\d,]+/);
    }
  }

  static async expectNavigation(page :Page) {
    await expect(page).toHaveURL(/home-product/);
  }

  static async expectSlideVisibleRange(trending: TrendingComponent, start: number, end: number) {
    const count = await trending.products.count();

    for (let i = 0; i < count; i++) {
      if (i >= start && i < end) {
        await expect(trending.products.nth(i)).toBeVisible();
      } else {
        await expect(trending.products.nth(i)).not.toBeInViewport();
      }
    }
  }

  static async expectSlideChanged(trending: TrendingComponent, prev: string, index: number) {
    const current = await trending.getProductTitle(index);
    expect(current).not.toBe(prev);
  }
}