import { test, expect, Page } from "@playwright/test";

const productName = "H&M A-line Skirt Model 2 Variant 2";

function getProductCard(page: Page) {
    return page.getByTestId("product-card").filter({
        has: page.getByTestId("product-title").filter({ hasText: productName }),
    });
}

function getCartCount(page: Page) {
    return page.getByTestId("navbar-cart").locator("span");
}

test.describe("Add to Cart - Product Card Behavior", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/products");
    });

    test("Add to Cart button hover behavior", async ({ page }) => {
        const productCard = getProductCard(page);
        const addBtn = productCard.getByRole("button", { name: /add to cart/i });

        await expect(addBtn).toBeHidden();
        await productCard.hover();
        await expect(addBtn).toBeVisible();
    });

    test("Add product to cart", async ({ page }) => {
        const productCard = getProductCard(page);
        const addBtn = productCard.getByRole("button", { name: /add to cart/i });
        const cartCount = getCartCount(page);

        await productCard.hover();
        await expect(addBtn).toHaveText(/add to cart/i);
        await addBtn.click();

        const toast = page.getByRole("status");
        await expect(toast).toBeVisible();
        await expect(toast).toHaveText(
            new RegExp(`${productName} added to cart!`, "i"),
        );
        await expect(cartCount).toHaveText("1");
    });

    test("Button text changes to In Cart", async ({ page }) => {
        const productCard = getProductCard(page);
        const cartBtn = productCard.getByRole("button").last();

        await productCard.hover();
        await cartBtn.click();
        await productCard.hover();
        await expect(cartBtn).toHaveText(/in cart/i);
    });

    test("Quantity increases when clicking In Cart", async ({ page }) => {
        const productCard = getProductCard(page);
        const cartBtn = productCard.getByRole("button").last();
        const cartCount = getCartCount(page);

        await productCard.hover();
        await cartBtn.click();
        await productCard.hover();
        await cartBtn.click();

        const toast = page.getByRole("status").first();
        await expect(toast).toBeVisible();
        await expect(toast).toHaveText(
            new RegExp(`Increased quantity of ${productName}`, "i"),
        );
        await expect(cartCount).toHaveText("2");
    });

    test("Multiple quantity increase", async ({ page }) => {
        const productCard = getProductCard(page);
        const cartBtn = productCard.getByRole("button").last();
        const cartCount = getCartCount(page);

        for (let i = 0; i < 3; i++) {
            await productCard.hover();
            await cartBtn.click();
        }
        await expect(cartCount).toHaveText("3");
    });

    test("Add multiple products to cart", async ({ page }) => {
        const productCards = page.getByTestId("product-card");
        const cartCount = getCartCount(page);

        for (let i = 0; i < 2; i++) {
            await productCards.nth(i).hover();
            await productCards.nth(i).getByRole("button").last().click();
        }
        await expect(cartCount).toHaveText("2");
    });
});
