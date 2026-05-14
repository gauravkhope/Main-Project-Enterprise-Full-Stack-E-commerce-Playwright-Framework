import { test, expect } from '@playwright/test';

test.describe('Searchbar - Basic Validation', () => {

  test('Verify search input and button are visible', async ({ page }) => {
    await page.goto('/'); // adjust base URL if needed

    const searchInput = page.getByTestId('navbar-search-input');
    const searchButton = page.getByTestId('navbar-search-button');

    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();

    await expect(searchButton).toBeVisible();
    await expect(searchButton).toBeEnabled();
  });

});

test('Continue typing from partial to full keyword', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.getByTestId('navbar-search-input');
  const dropdown = page.getByTestId('search-suggestion-dropdown');
  const suggestions = page.getByTestId('search-suggestion-item');

  // 🔹 Step 1: Type partial keyword
  const partialKeyword = 'sam';
  await searchInput.fill(partialKeyword);

  await expect(dropdown).toBeVisible();
  await expect(suggestions.first()).toBeVisible();

  // Verify first 3 contain "sam"
  let texts = await suggestions.locator('span').allTextContents();
  let firstThree = texts.slice(0, 3);

  for (const text of firstThree) {
    expect(text.toLowerCase()).toContain(partialKeyword);
    console.log(`Suggestion: "${text}" contains "${partialKeyword}"`);
  }

  // 🔹 Step 2: Continue typing remaining characters ("sun")
  await searchInput.type('sun');  // 👈 continues from "sam" → "samsun"

  const fullKeyword = 'samsun';

  // Wait until first suggestion contains full keyword (case insensitive)
  await expect(
    suggestions.first().locator('span')
  ).toContainText(new RegExp(fullKeyword, 'i'));

  // Verify first 3 contain "apple"
  texts = await suggestions.locator('span').allTextContents();
  firstThree = texts.slice(0, 3);

  for (const text of firstThree) {
    expect(text.toLowerCase()).toContain(fullKeyword);
  }
});



  test('Click first suggestion and verify product page', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByTestId('navbar-search-input');
    const dropdown = page.getByTestId('search-suggestion-dropdown');
    const suggestions = page.getByTestId('search-suggestion-item');

    // 🔹 Step 1: Type keyword
    await searchInput.fill('app');

    // 🔹 Step 2: Wait for dropdown
    await expect(dropdown).toBeVisible();
    await expect(suggestions.first()).toBeVisible();

    // 🔹 Step 3: Capture first suggestion text
    const firstSuggestionText = await suggestions
      .first()
      .locator('span')
      .textContent();

    // 🔹 Step 4: Click first suggestion
    await suggestions.first().click();

    // 🔹 Step 5: Verify product page contains same name
   await expect(
  page.getByText(firstSuggestionText ?? '', { exact: false })
).toBeVisible();

 // ✅ brandname chip visible
   await expect(
    page.getByTestId('active-filter-chip')
  ).toContainText(firstSuggestionText ?? '');

// ✅ search results header contains same name
     await expect(
    page.getByTestId('search-results-header').locator('span')
  ).toContainText(firstSuggestionText ?? '');

  await expect(
    page.getByTestId('product-card').first().getByTestId('product-title')
  ).toContainText(firstSuggestionText ?? '');

  });


  test('Enter full keyword and click search button', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByTestId('navbar-search-input');
    const searchButton = page.getByTestId('navbar-search-button');

    const fullKeyword = 'Apple';

    // 🔹 Step 1: Enter full keyword
    await searchInput.fill(fullKeyword);

    // 🔹 Step 2: Click search button
    await searchButton.click();
    await page.waitForLoadState('networkidle');
    // 🔹 Step 3: Verify URL contains query
    await expect(page).toHaveURL(new RegExp(fullKeyword, 'i'));

    // 🔹 Step 4: Verify search results header contains same name
         await expect(
    page.getByTestId('search-results-header').locator('span')
  ).toContainText(fullKeyword);  
   
    // 🔹 Step 5: Verify product page contains same name

    const products = page.getByTestId('product-card');
  const count = await products.count();

  expect(count).toBeGreaterThan(0);

 for (let i = 0; i < count; i++) {
  const product = products.nth(i);

  const productText = await product
    .getByTestId('product-title')
    .innerText();

  if (productText.toLowerCase().includes(fullKeyword.toLowerCase())) {
    // ✅ product matched, continue to next product
    continue;
  }

  const brandText = await product
    .getByTestId('product-brand')
    .innerText();

  expect(
    brandText.toLowerCase().includes(fullKeyword.toLowerCase())
  ).toBeTruthy();
}
  });


  test('Search with invalid keyword shows no results', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.getByTestId('navbar-search-input');
  const searchButton = page.getByTestId('navbar-search-button');

  const invalidKeyword = 'zzzzzzzz12345';

  await searchInput.fill(invalidKeyword);
  await searchButton.click();

  const products = page.getByTestId('product-card');

  // 🔹 Verify no product cards
  await expect(products).toHaveCount(0);

  // 🔹 Verify no results message
  await expect(
    page.getByText('No products found', { exact: false })
  ).toBeVisible();
});

test('Verify dropdown hides when input is cleared', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.getByTestId('navbar-search-input');
  const dropdown = page.getByTestId('search-suggestion-dropdown');

  // 🔹 Type keyword
  await searchInput.fill('app');

  // Wait for dropdown to appear
  await expect(dropdown).toBeVisible();

  // 🔹 Clear input
  await searchInput.clear();

  // 🔹 Verify dropdown disappears
  await expect(dropdown).toBeHidden();
});

test('Verify rapid typing does not break dropdown', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.getByTestId('navbar-search-input');
  const dropdown = page.getByTestId('search-suggestion-dropdown');
  const suggestions = page.getByTestId('search-suggestion-item');

  // 🔹 Rapid typing simulation
  await searchInput.type('Apple macbook pro', { delay: 20 });

  // 🔹 Verify dropdown still visible
  await expect(dropdown).toBeVisible();

  // 🔹 Verify suggestions still exist
  await expect(suggestions.first()).toBeVisible();

  // 🔹 Ensure no crash (at least one suggestion)
  const count = await suggestions.count();
  expect(count).toBeGreaterThan(0);
});


test('Rapid type and clear dropdown stability - 20 iterations', async ({ page }) => {
  await page.setDefaultTimeout(50000); 
  await page.goto('/');
  const searchInput = page.getByTestId('navbar-search-input');
  const dropdown = page.getByTestId('search-suggestion-dropdown');

  const keyword = 'samsung';

  for (let i = 1; i <= 20; i++) {
    console.log(`Iteration: ${i}`);

    // 🔹 Rapid typing
    await searchInput.fill(''); // ensure clean state
    await searchInput.type(keyword, { delay: 10 });

    // 🔹 Verify dropdown appears
    await expect(dropdown).toBeVisible();

    // 🔹 Clear input
    await searchInput.clear();

    // 🔹 Verify dropdown disappears
    await expect(dropdown).toBeHidden();
  }
});