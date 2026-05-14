import { expect, Page, Locator } from '@playwright/test';

export class CategoryAssertions {

  static async expectSectionVisible(section: Locator) {
    await expect(section).toBeVisible();
  }

  static async expectCategoryCount(blocks: Locator, count: number) {
    await expect(blocks).toHaveCount(count);
  }

  static async expectCategoryVisible(category: Locator) {
    await expect(category).toBeVisible();
  }

  static async expectProductsCount(products: Locator, count: number) {
    await expect(products).toHaveCount(count);
  }

  static async expectNavigation(page: Page, name: string) {
    await expect(page).toHaveURL(new RegExp(name, 'i'));
    await expect(
      page.getByRole('heading', { name })
    ).toBeVisible();
  }

  static async expectProductCard(product: Locator) {
    await expect(product).toBeVisible();

    const image = product.locator('img');
    await expect(image).toBeVisible();
    const alt = await image.getAttribute('alt');
    await expect(alt).not.toBeNull();

    await expect(product.locator('h3')).toBeVisible();
    await expect(product.locator('p')).toContainText('₹');

    await product.hover();

    await expect(
      product.getByRole('button', { name: /add to cart/i })
    ).toBeVisible();
  }

  static async expectProductLink(category: Locator) {
    const link = category.locator('a').first();
    const href = await link.getAttribute('href');
    await expect(href).not.toBeNull();
  }

  static async expectPagination(products: Locator, loadMore: Locator, noMoreText: Locator) {
    let prev = await products.count();

    while (await loadMore.isVisible()) {

      await loadMore.click();

      const current = await products.count();

      if (current === prev) break;

      expect(current).toBeGreaterThanOrEqual(prev);

      prev = current;
    }

    await expect(noMoreText).toBeVisible();
  }
}