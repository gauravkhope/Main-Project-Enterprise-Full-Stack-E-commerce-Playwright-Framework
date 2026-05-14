import { test, expect } from "@playwright/test";

test("Validate Category Section Completely (Order Independent)", async ({page}) => {
  test.setTimeout(3 * 60 * 1000);
  await page.goto("/");
  await page.locator("#categories-section").scrollIntoViewIfNeeded();
  
  const expectedCategories = [
    "Mobiles",
    "Laptops",
    "Footwear",
    "Clothes",
    "Appliances",
  ];

  const categorySection = page.locator("#categories-section");
  const categoryBlocks = page.getByTestId("category-section-block");
  let productNumber = 5;

  // ==========================================
  // 1️⃣ Section Visible
  // ==========================================
  await expect(categorySection).toBeVisible();

  // ==========================================
  // 2️⃣ Total Category Count
  // ==========================================
  await expect(categoryBlocks).toHaveCount(expectedCategories.length);

  // ==========================================
  // 3️⃣ Validate Each Category (Order Independent)
  // ==========================================
  for (const categoryName of expectedCategories) {
    const category = categoryBlocks.filter({
      has: page.locator("h2", { hasText: categoryName }),
    });

    await expect(category).toBeVisible();

    // ==========================================
    // 4️⃣ Validate Products Inside Category
    // ==========================================
    const products = category.getByTestId("trending-product-card");
    await expect(products).toHaveCount(productNumber);

    const productCount = await products.count();

    for (let i = 0; i < productCount; i++) {
      const product = products.nth(i);

      // Product Visible
      await expect(product).toBeVisible();

      // Image Visible
      const image = product.locator("img");
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute("alt");

      // Product Name Visible
      await expect(product.locator("h3")).toBeVisible();

      // Product Price Visible
      await expect(product.locator("p")).toContainText("₹");

      // Hover → Add to Cart Appears
      await product.hover();
      await expect(
        product.getByRole("button", { name: /add to cart/i }),
      ).toBeVisible();
    }

    // ==========================================
    // 5️⃣ See All Link Validation
    // ==========================================
    const seeAllLink = category.getByRole("link", { name: /see all/i });

    await expect(seeAllLink).toBeVisible();
    await expect(seeAllLink).toHaveAttribute("href");

    await seeAllLink.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(new RegExp(categoryName, "i"));
    await expect(page.getByRole("heading", { name: categoryName })).toBeVisible();
    const productsOnPLP = page.getByTestId("trending-product-card");
    console.log(await productsOnPLP.count());
    await expect(productsOnPLP.first()).toBeVisible();
    await page.goBack();
  

  }
});



  test("#Alternate Validate Category Section Completely", async ({ page }) => {
 test.setTimeout(1.5 * 60 * 1000);
     await page.goto("/");
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2),
    );
    const categorySection = page.locator("section[id='categories-section']");
    const categories = page.getByTestId("category-section-block");

    // =====================================================
    // 1️⃣ Category section visible
    // =====================================================

    await expect(categorySection).toBeVisible();

    // =====================================================
    // 2️⃣ Category count (future scalable)
    // =====================================================

    const expectedCategories = [
      "Mobiles",
      "Laptops",
      "Appliances",
      "Clothes",
      "Footwear",
    ];

    await expect(categories).toHaveCount(expectedCategories.length);

    // =====================================================
    // 3️⃣ Validate Each Category Block
    // =====================================================

    for (let i = 0; i < expectedCategories.length; i++) {
      const category = categories.nth(i);

      // 🔹 Category visible
      await expect(category).toBeVisible();

      // 🔹 Category title correct
      const title = category.locator("h2");
      await expect(title).toHaveText(expectedCategories[i]);

      // 🔹 Each category has 5 products
      const products = category.getByTestId("trending-product-card");
      await expect(products).toHaveCount(5);

      // =====================================================
      // 4️⃣ Validate Each Product
      // =====================================================

      for (let j = 0; j < 5; j++) {
        const product = products.nth(j);

        // Product visible
        await expect(product).toBeVisible();

        // Product image visible
        const image = product.locator("img");
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute("alt");

        // Product name visible
        const name = product.locator("h3");
        await expect(name).toBeVisible();

        // Product price visible
        const price = product.locator("p");
        await expect(price).toContainText("₹");

        // Href link visible
        const link = categories.nth(i).locator("a").first();
        console.log(link);
        await expect(link).toHaveAttribute("href");
        await expect(link).toContainText("See All");
        // 🔥 Hover → Add to Cart visible
        await product.hover();

        await expect(
          product.getByRole("button", { name: /add to cart/i }),
        ).toBeVisible();
      }
    }
  });


  test('category section → click see all → validate product listing page', async ({ page }) => {
    await page.goto('/'); 
  const categoryBlocks = page.getByTestId("category-section-block");
    const firstCategory = categoryBlocks.first();
      const seeAllLink = firstCategory.getByRole("link", { name: /see all/i });

    await expect(seeAllLink).toBeVisible();
    await expect(seeAllLink).toHaveAttribute("href");

    await seeAllLink.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(new RegExp('mobiles', "i"));
    await expect(page.getByRole("heading", { name: 'Mobiles' })).toBeVisible();
    const products = page.getByTestId("trending-product-card");
    console.log(await products.count());
    const loadMoreButton = page.getByRole("button" , {name: /Load More/i});
    let previousCount = await products.count();
    while(await loadMoreButton.isVisible()){
      await loadMoreButton.click();
          console.log(await products.count());
          const currentCount = await products.count();
          expect(currentCount).toBeGreaterThan(previousCount);
          previousCount = currentCount;
      

    }

  const noMoreText = page.getByTestId("category-products-page").getByText("No more products.");
  await expect(noMoreText).toBeVisible();
  })





