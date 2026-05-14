import { test, expect } from '@playwright/test';

test.describe('Filters Section', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('Filters button is visible', async ({ page }) => {
    const filtersBtn = page.getByTestId('filters-toggle');
    await expect(filtersBtn).toBeVisible();
  });

  test('Filters panel opens and closes correctly', async ({ page }) => {
    const filtersBtn = page.getByTestId('filters-toggle');
    await filtersBtn.click();

    const panel = page.getByTestId('filters-panel');
    const brands = page.getByTestId('filter-brands');
    const price = page.getByTestId('filter-price');
    const clearBtn = page.getByTestId('clear-filters');

    await expect(panel).toBeVisible();
    await expect(brands).toBeVisible();
    await expect(price).toBeVisible();
    await expect(clearBtn).toBeVisible();

      // panel closes when clicking filters button again
    await filtersBtn.click();
    await expect(panel).not.toBeVisible(); 

  });


  test('Apply brandname brand filter and verify results', async ({ page }) => {

  // Open Filters
  await page.getByTestId('filters-toggle').click();

  // Check Any brand 
  const brandname = "Apple";
  await page.getByTestId('filter-brands')
    .getByLabel(brandname)
    .check();

  // Get total products of that brand
    const totalitems = await page.getByTestId(`brand-count-${brandname}`).textContent();
    const totalProducts = parseInt (totalitems?.match(/\d+/)?.[0] || "0");
  
    
  // ✅ Active Filters visible
  const activeFilters = page.getByTestId('active-filters');
  await expect(activeFilters).toBeVisible();

  // ✅ brandname chip visible
  await expect(
    page.getByTestId('active-filter-chip')
  ).toContainText(brandname);

  // ✅ Product grid visible
  const products = page.getByTestId('product-card');
  await expect(products.first()).toBeVisible();

  // ✅ Verify all visible products contain {brandname} brand
  const count = await products.count();
  for (let i = 0; i < count; i++) {
    await expect(
      products.nth(i).getByTestId('product-brand')
    ).toHaveText(brandname);
  }

  await page.getByTestId('pagination-numbers').getByRole('button').last().click();
  await expect(products.first()).toBeVisible();
   
});
 
 test('Verify pagination' , async ({ page }) => {

  // Open Filters
  await page.getByTestId('filters-toggle').click();

  // Check Any brand 
  const brandname = "Generic";
  await page.getByTestId('filter-brands')
    .getByLabel(brandname).first()
    .check();

  // Get total products of that brand
    const totalitems = await page.getByTestId(`brand-count-${(brandname)}`).textContent();
    const totalProducts = parseInt (totalitems?.match(/\d+/)?.[0] || "0");
  
    

  // ✅ Product grid visible
  const products = page.getByTestId('product-card');
await expect(products.first()).toBeVisible();

const totalPages = Math.ceil(totalProducts / 20);

for (let pageIndex = 1; pageIndex < totalPages; pageIndex++) {
  const nextBtn = page.locator("//button[normalize-space()='Next']");

  await expect(nextBtn).toBeEnabled();

  await Promise.all([
    page.waitForLoadState('networkidle'),
    nextBtn.click()
  ]);

  await expect(products.first()).toBeVisible();
}
})

});


test('Apply Apple + Samsung filter and verify results', async ({ page }) => {

  await page.goto('/products');

  const brandOne = 'Apple';
  const brandTwo = 'Samsung';

  // Open filters
  await page.getByTestId('filters-toggle').click();

  const brandSection = page.getByTestId('filter-brands');

  // Select both brands
  await brandSection.getByLabel(brandOne).check();
  await brandSection.getByLabel(brandTwo).check();

  // Validate active filter section visible
  await expect(page.getByTestId('active-filters')).toBeVisible();

  // Validate 2 chips appear
  const chips = page.getByTestId('active-filter-chip');
  await expect(chips).toHaveCount(2);

  await expect(chips.filter({ hasText: brandOne })).toBeVisible();
  await expect(chips.filter({ hasText: brandTwo })).toBeVisible();

  // Validate grid
  const products = page.getByTestId('product-card');
  const count = await products.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const brandText = await products
      .nth(i)
      .getByTestId('product-brand')
      .innerText();

    expect([brandOne, brandTwo]).toContain(brandText);
  }

});

test('Remove Apple filter and verify only Samsung remains', async ({ page }) => {

  await page.goto('/products');

  const brandOne = 'Apple';
  const brandTwo = 'Samsung';

  // Open filters
  await page.getByTestId('filters-toggle').click();

  const brandSection = page.getByTestId('filter-brands');

  // Select both
  await brandSection.getByLabel(brandOne).check();
  await brandSection.getByLabel(brandTwo).check();

  const chips = page.getByTestId('active-filter-chip');

  // Ensure both chips visible
  await expect(chips).toHaveCount(2);

  // 🔥 Remove Apple chip
  const appleChip = chips.filter({ hasText: brandOne });

  await appleChip.getByRole('button').click();

  // Validate only 1 chip remains
  await expect(chips).toHaveCount(1);
  await expect(chips.filter({ hasText: brandTwo })).toBeVisible();

  // Validate grid now only Samsung
  const products = page.getByTestId('product-card');
  const count = await products.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await expect(
      products.nth(i).getByTestId('product-brand')
    ).toHaveText(brandTwo);
  }

});

test('Clear All resets filters and product grid', async ({ page }) => {

  await page.goto('/products');

  const brandOne = 'Apple';
  const brandTwo = 'Samsung';

  // Open filters
  await page.getByTestId('filters-toggle').click();

  const brandSection = page.getByTestId('filter-brands');

  // Select two brands
  await brandSection.getByLabel(brandOne).check();
  await brandSection.getByLabel(brandTwo).check();

  // Ensure filters applied
  await expect(page.getByTestId('active-filters')).toBeVisible();
  await expect(page.getByTestId('active-filter-chip')).toHaveCount(2);

  // 🔥 Click Clear All
  await page.getByRole('button', { name: 'Clear All Filters' , exact:true }).click();

  // ✅ Active filters section disappears
  await expect(page.getByTestId('active-filters')).toHaveCount(0);

  // ✅ Checkboxes are unchecked
  await expect(
    brandSection.getByLabel(brandOne)
  ).not.toBeChecked();

  await expect(
    brandSection.getByLabel(brandTwo)
  ).not.toBeChecked();

  // ✅ Grid resets (more than 0 products)
  const products = page.getByTestId('product-card');
  const count = await products.count();

  expect(count).toBeGreaterThan(0);

});

test('Random brand selection and verification', async ({ page }) => {

  await page.goto('/products');

  // Open filters
  await page.getByTestId('filters-toggle').click();

  const brandSection = page.getByTestId('filter-brands');

  // Get all brand labels dynamically
  const brandLabels = brandSection.locator('label');

  const totalBrands = await brandLabels.count();
  expect(totalBrands).toBeGreaterThan(0);

  // 🔥 Pick random index
  const randomIndex = Math.floor(Math.random() * totalBrands);

  const randomBrandLabel = brandLabels.nth(randomIndex);

  // Extract brand name (text inside label)
  const randomBrandName = await randomBrandLabel
    .locator('span')
    .first()
    .innerText();

  console.log('Selected brand:', randomBrandName);

  // Check the checkbox
  await randomBrandLabel.locator('input[type="checkbox"]').check();

  // ✅ Active filter visible
  await expect(page.getByTestId('active-filters')).toBeVisible();

  // ✅ Chip contains selected brand
  await expect(
    page.getByTestId('active-filter-chip')
  ).toContainText(randomBrandName);

  // ✅ Grid validation
  const products = page.getByTestId('product-card');
  const count = await products.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await expect(
      products.nth(i).getByTestId('product-brand')
    ).toHaveText(randomBrandName);
  }

});


test('User-defined random multi brand selection (manual unique logic)', async ({ page }) => {

  await page.goto('/products');
  await page.getByTestId('filters-toggle').click();

  const brandSection = page.getByTestId('filter-brands');
  const brandLabels = brandSection.locator('label');

  const totalBrands = await brandLabels.count();

  // 🔥 USER decides how many brands to select
  const timesToSelect = 6; // Change this value to select more or fewer brands

  const selectedIndexes: number[] = [];
  const selectedBrandNames: string[] = [];

  while (selectedIndexes.length < timesToSelect) {

    const randomIndex = Math.floor(Math.random() * totalBrands);

    // 🔹 Check uniqueness
    if (!selectedIndexes.includes(randomIndex)) {

      selectedIndexes.push(randomIndex);

      const label = brandLabels.nth(randomIndex);
      const brandName = await label.locator('span').first().innerText();

      selectedBrandNames.push(brandName);

      await label.locator('input[type="checkbox"]').check();
    }
  }

  // ✅ Validate chips count
  const chips = page.getByTestId('active-filter-chip');
  await expect(chips).toHaveCount(timesToSelect);

  // ✅ Validate chip names
  for (const name of selectedBrandNames) {
    await expect(chips.filter({ hasText: name })).toBeVisible();
  }

  // ✅ Validate grid contains only selected brands
  const products = page.getByTestId('product-card');
  const productCount = await products.count();

  expect(productCount).toBeGreaterThan(0);

  for (let i = 0; i < productCount; i++) {
    const brandText = await products
      .nth(i)
      .getByTestId('product-brand')
      .innerText();

    expect(selectedBrandNames).toContain(brandText);
  }

});