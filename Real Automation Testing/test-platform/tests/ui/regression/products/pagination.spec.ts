import {test , expect} from '@playwright/test';

test.only('Pagination functionality', async ({ page }) => {
  await page.goto('/products');
 for (let i = 3; i < 100; i ++) {

    await page.getByTestId('pagination-controls').getByRole('button', { name: `${i}` }).click();
    console.log(`Clicked on page ${i}`);
 }
});

test('page more functionality', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('category-section-block').first().getByRole('link', { name: /see all/i }).click();
  await page.waitForTimeout(2000);
  const productCards = page.getByTestId("trending-product-card");
   let productsCount = await productCards.count();
   console.log(`Initial products count: ${productsCount}`);
    expect(productsCount).toBeGreaterThan(20);
  const loadMoreButton = page.getByRole('button', { name: /load more/i });
  while (await loadMoreButton.isVisible()) {
    await loadMoreButton.click();
    await page.waitForTimeout(2000);
    const newProductsCount = await productCards.count();
    expect(newProductsCount).toBeGreaterThan(productsCount);
    productsCount = newProductsCount;
    console.log(`Loaded more products, new count: ${productsCount}`);
    console.log(`Clicked on Load More button`);
  }
  await expect(loadMoreButton).toBeHidden();
  await expect(page.getByText(/No more products./i)).toBeVisible();
});