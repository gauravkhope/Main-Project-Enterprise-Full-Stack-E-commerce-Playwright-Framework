import { test, expect } from "@playwright/test";
test("Wishlist toggle validation", async ({ page }) => {
  await page.goto("/products");
  const productName = "H&M A-line Skirt Model 2 Variant 2";
  const productName1 = "Zara Floral Dress Model 1 Variant 6";

  // const productCard1 = page
  //   .getByTestId("product-card")
  //   .filter({
  //     has: page.getByTestId("product-title").filter({ hasText: productName1 })
  //   });
  //   const heartIcon1 = productCard1.locator("button svg").first();
  //   await heartIcon1.click();

  // locate product card using title
  const productCard = page.getByTestId("product-card").filter({
    has: page.getByTestId("product-title").filter({ hasText: productName }),
  });

  const heartIcon = productCard.locator("button svg").first();

  const navbarWishlist = page.getByTestId("navbar-wishlist");

  const wishlistCount = navbarWishlist.locator("span");

  const classBefore = await heartIcon.getAttribute("class");

  const currentCount = (await wishlistCount.isVisible())
    ? ((await wishlistCount.textContent()) ?? "0")
    : "0";

  // STATE 1 → NOT ADDED
  if (!classBefore?.includes("fill-[url(#heartGradient)]")) {
    await heartIcon.click();

    // verify heart filled
    await expect(heartIcon).toHaveClass(/fill-\[url/);

    // verify navbar icon becomes red
    await expect(navbarWishlist.locator("svg")).toHaveClass(/fill-red-500/);

    // verify count = 1
    await expect(wishlistCount).toHaveText(`${parseInt(currentCount) + 1}`);

    // 5. Verify add message
    const whishlistAddToast = page.getByRole("status");
    await expect(whishlistAddToast).toBeVisible();
    await expect(whishlistAddToast).toHaveText(
      new RegExp(`${productName} added to wishlist! 💖`, "i"),
    );
  }

  // STATE 2 → ALREADY ADDED
  else {
    await heartIcon.click();

    // verify heart becomes normal
    await expect(heartIcon).not.toHaveClass(/fill-\[url/);

    // verify navbar icon reset
    await expect(navbarWishlist.locator("svg")).not.toHaveClass(/fill-red-500/);

    // verify count removed or 0
    await expect(wishlistCount).toHaveCount(0);

    // 5. Verify remove message
    const whishlistRemoveToast = page.getByRole("status");
    await expect(whishlistRemoveToast).toBeVisible();
    await expect(whishlistRemoveToast).toHaveText(
      new RegExp(`${productName} removed from wishlist! 💔`, "i"),
    );
  }
});

test("verify product added to wishlist is displayed in wishlist page", async ({
  page,
}) => {
  await page.goto("/products");
  const productName = "H&M A-line Skirt Model 2 Variant 2";
  const navbarWishlist = page.getByTestId("navbar-wishlist");
  const productCard = page.getByTestId("product-card").filter({
    has: page.getByTestId("product-title").filter({ hasText: productName }),
  });
  const heartIcon = productCard.locator("button svg").first();
  await heartIcon.click();
  await navbarWishlist.click();
  const wishlistItem = page.getByTestId("wishlistcard");
  await expect(wishlistItem.first()).toBeVisible();
  await expect(wishlistItem).toHaveCount(1);
  await expect(wishlistItem.first().locator("h3")).toHaveText(
    productName,
  );
  const buttons = wishlistItem.first().locator("button");
  await expect(buttons.filter({ hasText: "Move to Cart" })).toBeVisible();
  await expect(buttons.filter({ hasText: "Remove" })).toBeVisible();
  await buttons.filter({ hasText: "Remove" }).click();
  await expect(wishlistItem).toHaveCount(0);

});

  test("verify multiple products can be added to wishlist and Removed in wishlist page", async ({
    page,
  }) => {
    await page.goto("/products");
    const productNames = [
      "H&M A-line Skirt Model 2 Variant 2",
      "Mango Maxi Dress Model 4 Variant 4",
      "Allen Solly Formal Shirt Model 5 Variant 11",
      "Jack & Jones Bomber Jacket Model 4 Variant 10"
    ];
    for (const name of productNames) {
      const productCard = page
        .getByTestId("product-card")
        .filter({
          has: page.getByTestId("product-title").filter({ hasText: name })
        });
      const heartIcon = productCard.locator("button svg").first();
      await heartIcon.click();
    }
    const navbarWishlist = page.getByTestId("navbar-wishlist");
    await navbarWishlist.click();
    await page.waitForTimeout(2000); // Wait for 2 seconds or use "networkidle" if supported
    const wishlistItems = await page.getByTestId("wishlistcard").count();
    expect(wishlistItems).toBe(productNames.length);
    await page.getByTestId("clearwishlistbutton").click();
    await expect(page.getByTestId("wishlistcard")).toHaveCount(0);
    await expect(page.getByText("Your Wishlist is Empty")).toBeVisible();
  });

