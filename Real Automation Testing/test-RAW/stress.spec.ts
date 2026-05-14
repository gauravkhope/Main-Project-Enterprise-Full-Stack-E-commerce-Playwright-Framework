import { test, expect } from "@playwright/test";

test("36 cycles random brand select + clear", async ({ page }) => {
  test.setTimeout(3 * 60 * 1000);

  await page.goto("/products");

  for (let cycle = 1; cycle <= 36; cycle++) {
    await page.getByTestId("filters-toggle").click();

    const brandSection = page.getByTestId("filter-brands");
    const brandLabels = brandSection.locator("label");

    const totalBrands = await brandLabels.count();
    // 🔥 Pick random index
    const randomIndex = Math.floor(Math.random() * totalBrands);

    const randomBrandLabel = brandLabels.nth(randomIndex);

    // Extract brand name (text inside label)
    const randomBrandName = await randomBrandLabel
      .locator("span")
      .first()
      .innerText();

    console.log("Selected brand:", randomBrandName);

    // Check the checkbox
    await randomBrandLabel.locator('input[type="checkbox"]').check();

    // ✅ Active filter visible
    await expect(page.getByTestId("active-filters")).toBeVisible();

    // ✅ Chip contains selected brand
    await expect(page.getByTestId("active-filter-chip")).toContainText(
      randomBrandName,
    );

    // ✅ Grid validation
    const products = page.getByTestId("product-card");
    const count = await products.count();

    expect(count).toBeGreaterThan(0);

    // ✅ Clear filters
    await page
      .getByRole("button", { name: "Clear All Filters", exact: true })
      .click();
    await page.getByTestId("filters-toggle").click();

    // Verify filters cleared
    const activeFilters = page.getByTestId("active-filters");
    await expect(activeFilters).toHaveCount(0);
  }
});


test.describe('@stress CHAOS Filters Mode', () => {

  test('Chaos random filter spam 50 cycles', async ({ page }) => {
  test.setTimeout(3 * 60 * 1000);

    page.on('console', msg => {
      if (msg.type() === 'error') {
        throw new Error(`Console error: ${msg.text()}`);
      }
    });

    await page.goto('/products');

    for (let cycle = 1; cycle <= 50; cycle++) {

      await page.getByTestId('filters-toggle').click();

      const brands = page
        .getByTestId('filter-brands')
        .locator('input[type="checkbox"]');

      const total = await brands.count();

      // Random number of selections (1 to 5)
      const randomSelectionCount =
        Math.floor(Math.random() * 5) + 1;

      for (let i = 0; i < randomSelectionCount; i++) {

        const randomIndex = Math.floor(Math.random() * total);

        // ⚡ No wait. No validation. Just spam.
        await brands.nth(randomIndex).click({ force: true });
      }

      // Random price chaos
      const randomMin = Math.floor(Math.random() * 50000);
      const randomMax =
        randomMin + Math.floor(Math.random() * 300000);

      await page.getByPlaceholder('Min').fill(String(randomMin));
      await page.getByPlaceholder('Max').fill(String(randomMax));


      // Rapid clear
      await page.getByRole("button", { name: "Clear All Filters", exact: true }).click({ force: true });
                await page.getByTestId("filters-toggle").click();


      console.log(`Chaos cycle ${cycle} completed`);
    }

    await expect(page.getByTestId('product-grid')).toBeVisible();

  });

});