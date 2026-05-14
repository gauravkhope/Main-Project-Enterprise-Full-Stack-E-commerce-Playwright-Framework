import { test, expect } from '@playwright/test';
import { FiltersPage } from '../../../../ui/pages/products/filters.page';
import { FiltersFlow } from '../../../../ui/flows/products/filters.flow';
import { FiltersAssertions } from '../../../../validation/ui/products/filters.assertions';
import { fixedBrands } from '../../../../data/brands/fixedBrands';
import { getRandomBrandIndex, getUniqueRandomIndexes, randomMultiConfig } from '../../../../data/brands/randomBrands';
import { priceData } from '../../../../data/price/priceData';

test.describe('Filters Section', () => {

  let pageObj: FiltersPage;
  let flow: FiltersFlow;

  test.beforeEach(async ({ page }) => {
    pageObj = new FiltersPage(page);
    flow = new FiltersFlow(pageObj);

    await flow.openProducts();
  });

  // 1
  test('Filters button is visible', async () => {// Temporary wait to ensure page stability. Consider replacing with a more robust solution.
    await FiltersAssertions.expectVisible(pageObj.filtersBtn);
  });

  // 2
  test('Filters panel opens and closes correctly', async () => {
    await flow.openFilters();

    await FiltersAssertions.expectVisible(pageObj.panel);
    await FiltersAssertions.expectVisible(pageObj.brands);
    await FiltersAssertions.expectVisible(pageObj.price);

    await flow.toggleFilters();
    await expect(pageObj.panel).not.toBeVisible();
  });

  // 3
  test('Apply single brand filter', async () => {
    await flow.openFilters();

    const brand = fixedBrands.single;
    await pageObj.getBrandCheckbox(brand).check();

    await FiltersAssertions.expectBrand(pageObj.products, brand);
  });

  // 4
  test('Pagination validation', async () => {
    await flow.openFilters();

    const brand = "Generic";
    await pageObj.getBrandCheckbox(brand).first().check();

    const products = pageObj.products;
    await FiltersAssertions.expectProductsVisible(products);

    for (let i = 0; i < 3; i++) {
      if (await pageObj.paginationNext.isVisible()) {
        await flow.goToNextPage();
      }
    }
  });

  // 5
  test('Apply Apple + Samsung filter', async () => {
    await flow.openFilters();

    const { first, second } = fixedBrands.multi;

    await pageObj.getBrandCheckbox(first).check();
    await pageObj.getBrandCheckbox(second).check();

    await FiltersAssertions.expectMultiBrand(pageObj.products, [first, second]);
  });

  // 6
  test('Remove Apple filter', async () => {
    await flow.openFilters();

    const { first, second } = fixedBrands.multi;

    await pageObj.getBrandCheckbox(first).check();
    await pageObj.getBrandCheckbox(second).check();

    const chips = pageObj.chips;
    await chips.filter({ hasText: first }).getByRole('button').click();

    await FiltersAssertions.expectBrand(pageObj.products, second);
  });

  // 7
  test('Clear all filters', async () => {
    await flow.openFilters();

    await pageObj.getBrandCheckbox('Apple').check();
    await pageObj.getBrandCheckbox('Samsung').check();

    await pageObj.page.getByRole('button', { name: 'Clear All Filters' }).click();

    await expect(pageObj.activeFilters).toHaveCount(0);
  });

  // 8
  test('Random single brand', async () => {
    await flow.openFilters();

    const labels = pageObj.brands.locator('label');
    const index = getRandomBrandIndex(await labels.count());

    const label = labels.nth(index);
    const brand = await label.locator('span').first().innerText();

    await label.locator('input').check();

    await FiltersAssertions.expectBrand(pageObj.products, brand);
  });

  // 9
  test('Random multi brand', async () => {
    await flow.openFilters();

    const labels = pageObj.brands.locator('label');
    const total = await labels.count();

    const indexes = getUniqueRandomIndexes(total, randomMultiConfig.selectionCount);

    const selected: string[] = [];

    for (const i of indexes) {
      const label = labels.nth(i);
      const name = await label.locator('span').first().innerText();

      selected.push(name);
      await label.locator('input').check();
    }

    await FiltersAssertions.expectMultiBrand(pageObj.products, selected);
  });

  // 10
  test('Price range filter', async () => {
    await flow.openFilters();

    await pageObj.minInput().fill(String(priceData.min));
    await pageObj.maxInput().fill(String(priceData.max));
    await pageObj.maxInput().blur();

    await FiltersAssertions.expectPriceRange(pageObj.products, priceData.min, priceData.max);
  });

  // 11
  test('Slider filter', async () => {
    await flow.openFilters();

    await pageObj.slider().fill(String(priceData.sliderMax));
    await pageObj.slider().dispatchEvent('input');
    await pageObj.slider().dispatchEvent('change');

    const updated = parseInt(await pageObj.maxInput().inputValue());

    await FiltersAssertions.expectPriceMax(pageObj.products, updated);
  });

});

