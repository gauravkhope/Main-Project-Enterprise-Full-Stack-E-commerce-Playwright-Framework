import { test } from '@playwright/test';
import { FiltersComboPage } from '../../../../ui/pages/products/filtersCombo.page';
import { FiltersComboFlow } from '../../../../ui/flows/products/filtersCombo.flow';
import { FiltersComboAssertions } from '../../../../validation/ui/products/filtersCombo.assertions';

test.describe('Products - Combo Filters', () => {

  let pageObj: FiltersComboPage;
  let flow: FiltersComboFlow;

  test.beforeEach(async ({ page }) => {
    pageObj = new FiltersComboPage(page);
    flow = new FiltersComboFlow(pageObj);

    await flow.openProducts();
  });

  // ==========================================
  // 1️⃣ BRAND + PRICE + PAGINATION
  // ==========================================
  test('Apple + Samsung with price range across all pages', async () => {

    const brands = ['Apple', 'Samsung'];
    const min = 50000;
    const max = 200000;

    await flow.openFilters();

    await flow.applyBrands(brands);
    await flow.applyPrice(min, max);

    await FiltersComboAssertions.expectFiltersVisible(pageObj.activeFilters);

    for (const b of brands) {
      await FiltersComboAssertions.expectChip(pageObj.chips, b);
    }

    while (true) {

      await FiltersComboAssertions.expectProductsValid(
        pageObj.products,
        brands,
        min,
        max
      );

      if (await pageObj.paginationNext.isDisabled()) break;

      await flow.goNextPage();
    }
  });

  // ==========================================
  // 2️⃣ STRESS TEST
  // ==========================================
  test('Stress: Rapid brand toggle', async () => {

    await flow.openFilters();

    const checkboxes = pageObj.getAllBrandCheckboxes();
    const total = await checkboxes.count();

    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * total);
      await checkboxes.nth(randomIndex).click();
    }

    await FiltersComboAssertions.expectGridVisible(pageObj.productGrid);
  });

});