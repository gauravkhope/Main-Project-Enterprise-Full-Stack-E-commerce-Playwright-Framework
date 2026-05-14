import { test, expect } from '../../../../core/fixtures/base.fixture';
import { CategoryAssertions } from '../../../../validation/ui/products/categoryAssertions';

test.describe('Category Section', () => {

  // ==========================================
  // 1️⃣ ORDER-INDEPENDENT
  // ==========================================
  test('Validate Category Section Completely (Order Independent)', async ({
    categoryFlow,
    categoryPage,
    page
  }) => {

    test.setTimeout(3 * 60 * 1000);

    await categoryFlow.openHome();
    await categoryFlow.scrollToCategory();

    const expectedCategories = [
      "Mobiles",
      "Laptops",
      "Footwear",
      "Clothes",
      "Appliances",
    ];

    await CategoryAssertions.expectSectionVisible(categoryPage.section);
    await CategoryAssertions.expectCategoryCount(categoryPage.categoryBlocks, expectedCategories.length);

    for (const categoryName of expectedCategories) {

      const category = categoryPage.getCategoryByName(categoryName);

      await CategoryAssertions.expectCategoryVisible(category);

      const products = categoryPage.getProducts(category);

      await CategoryAssertions.expectProductsCount(products, 5);

      const count = await products.count();

      for (let i = 0; i < count; i++) {
        const product = products.nth(i);
        await product.scrollIntoViewIfNeeded();
        await CategoryAssertions.expectProductCard(product);
      }

      await categoryFlow.openCategory(category);

      await page.waitForURL(new RegExp(categoryName, 'i'));

      await CategoryAssertions.expectNavigation(page, categoryName);

      await categoryFlow.goBack();
    }
  });

  // ==========================================
  // 2️⃣ ORDER-BASED
  // ==========================================
  test('Alternate Validate Category Section Completely', async ({
    categoryFlow,
    categoryPage,
    page
  }) => {

    await categoryFlow.openHome();

    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );

    const expectedCategories = [
      "Mobiles",
      "Laptops",
      "Appliances",
      "Clothes",
      "Footwear",
    ];

    await CategoryAssertions.expectSectionVisible(categoryPage.section);
    await CategoryAssertions.expectCategoryCount(categoryPage.categoryBlocks, expectedCategories.length);

    for (let i = 0; i < expectedCategories.length; i++) {

      const category = categoryPage.categoryBlocks.nth(i);

      await CategoryAssertions.expectCategoryVisible(category);

      await expect(category.locator('h2'))
        .toContainText(expectedCategories[i]);

      const products = categoryPage.getProducts(category);

      await CategoryAssertions.expectProductsCount(products, 5);

      for (let j = 0; j < 5; j++) {

        const product = products.nth(j);

        await product.scrollIntoViewIfNeeded();

        await CategoryAssertions.expectProductCard(product);

        await CategoryAssertions.expectProductLink(category);
      }
    }
  });

  // ==========================================
  // 3️⃣ PAGINATION
  // ==========================================
  test('Category → Pagination', async ({
    categoryFlow,
    categoryPage
  }) => {

    await categoryFlow.openHome();

    const firstCategory = categoryPage.categoryBlocks.first();

    await categoryFlow.openCategory(firstCategory);

    const products = categoryPage.products;
    const loadMore = categoryPage.getLoadMoreButton();
    const noMoreText = categoryPage.getNoMoreText();

    await CategoryAssertions.expectPagination(products, loadMore, noMoreText);
  });

});