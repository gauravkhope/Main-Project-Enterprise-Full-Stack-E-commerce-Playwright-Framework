import { test, expect } from '@playwright/test';

test.describe('@stress @chaos Product Filters Stress Suite', () => {

  // ============================================================
  // 🔹 RANDOM BRAND SELECT + CLEAR
  // ============================================================
  test(
    '36 cycles random brand select and clear',

    async ({ page }) => {

      test.setTimeout(3 * 60 * 1000);

      // ============================================================
      // 🔹 PRODUCTS PAGE
      // ============================================================
      await page.goto('/products');

      const filtersToggle =
        page.getByTestId('filters-toggle');

      const activeFilters =
        page.getByTestId('active-filters');

      const activeFilterChip =
        page.getByTestId('active-filter-chip');

      const productCards =
        page.getByTestId('product-card');

      const clearFiltersButton =
        page.getByRole('button', {
          name: 'Clear All Filters',
          exact: true
        });

      // ============================================================
      // 🔹 CYCLES
      // ============================================================
      for (
        let cycle = 1;
        cycle <= 36;
        cycle++
      ) {

        // =========================
        // 🔹 OPEN FILTERS
        // =========================
        await filtersToggle.click();

        const brandSection =
          page.getByTestId(
            'filter-brands'
          );

        const brandLabels =
          brandSection.locator('label');

        const totalBrands =
          await brandLabels.count();

        // =========================
        // 🔹 RANDOM BRAND
        // =========================
        const randomIndex =
          Math.floor(
            Math.random() *
            totalBrands
          );

        const randomBrand =
          brandLabels.nth(
            randomIndex
          );

        const randomBrandName =
          await randomBrand
            .locator('span')
            .first()
            .innerText();

        console.log(
          `Cycle ${cycle} → Selected Brand:`,
          randomBrandName
        );

        // =========================
        // 🔹 CHECK FILTER
        // =========================
        await randomBrand
          .locator(
            'input[type="checkbox"]'
          )
          .check();

        // =========================
        // 🔹 ACTIVE FILTER
        // =========================
        await expect(
          activeFilters
        ).toBeVisible();

        await expect(
          activeFilterChip
        ).toContainText(
          randomBrandName
        );

        // =========================
        // 🔹 PRODUCT GRID
        // =========================
        const count =
          await productCards.count();

        expect(count)
          .toBeGreaterThan(0);

        // =========================
        // 🔹 CLEAR FILTERS
        // =========================
        await clearFiltersButton
          .click();

        // =========================
        // 🔹 REOPEN FILTERS
        // =========================
        await filtersToggle.click();

        // =========================
        // 🔹 VALIDATE CLEARED
        // =========================
        await expect(
          activeFilters
        ).toHaveCount(0);

        console.log(
          `Cycle ${cycle} completed`
        );
      }
    }
  );

  // ============================================================
  // 🔹 CHAOS FILTER SPAM
  // ============================================================
  test(
    'Chaos random filter spam 50 cycles',

    async ({ page }) => {

      test.setTimeout(
        3 * 60 * 1000
      );

      // ============================================================
      // 🔹 FAIL ON CONSOLE ERROR
      // ============================================================
      page.on(
        'console',
        msg => {

          if (
            msg.type() === 'error'
          ) {

            throw new Error(
              `Console error: ${msg.text()}`
            );
          }
        }
      );

      // ============================================================
      // 🔹 PRODUCTS PAGE
      // ============================================================
      await page.goto('/products');

      const filtersToggle =
        page.getByTestId(
          'filters-toggle'
        );

      const clearFiltersButton =
        page.getByRole('button', {
          name: 'Clear All Filters',
          exact: true
        });

      const minPriceInput =
        page.getByPlaceholder('Min');

      const maxPriceInput =
        page.getByPlaceholder('Max');

      const productGrid =
        page.getByTestId(
          'product-grid'
        );

      // ============================================================
      // 🔹 CHAOS CYCLES
      // ============================================================
      for (
        let cycle = 1;
        cycle <= 50;
        cycle++
      ) {

        // =========================
        // 🔹 OPEN FILTERS
        // =========================
        await filtersToggle.click();

        const brands =
          page
            .getByTestId(
              'filter-brands'
            )
            .locator(
              'input[type="checkbox"]'
            );

        const totalBrands =
          await brands.count();

        // =========================
        // 🔹 RANDOM SELECTION COUNT
        // =========================
        const randomSelectionCount =
          Math.floor(
            Math.random() * 5
          ) + 1;

        // =========================
        // 🔹 RANDOM BRAND SPAM
        // =========================
        for (
          let i = 0;
          i < randomSelectionCount;
          i++
        ) {

          const randomIndex =
            Math.floor(
              Math.random() *
              totalBrands
            );

          await brands
            .nth(randomIndex)
            .click({
              force: true
            });
        }

        // =========================
        // 🔹 RANDOM PRICE CHAOS
        // =========================
        const randomMin =
          Math.floor(
            Math.random() * 50000
          );

        const randomMax =
          randomMin +
          Math.floor(
            Math.random() * 300000
          );

        await minPriceInput.fill(
          String(randomMin)
        );

        await maxPriceInput.fill(
          String(randomMax)
        );

        // =========================
        // 🔹 RAPID CLEAR
        // =========================
        await clearFiltersButton
          .click({
            force: true
          });

        // =========================
        // 🔹 REOPEN FILTERS
        // =========================
        await filtersToggle.click();

        console.log(
          `Chaos Cycle ${cycle} completed`
        );
      }

      // ============================================================
      // 🔹 FINAL GRID VALIDATION
      // ============================================================
      await expect(
        productGrid
      ).toBeVisible();
    }
  );

});