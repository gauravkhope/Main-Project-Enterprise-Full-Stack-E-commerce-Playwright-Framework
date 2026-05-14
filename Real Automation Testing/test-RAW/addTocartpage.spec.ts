import { test, expect } from "@playwright/test";

test("Add product → verify in cart → remove → cart empty", async ({ page }) => {

    const productName = "H&M A-line Skirt Model 2 Variant 2";

    // ---------- Step 1: Go to Products Page ----------
    await page.goto("/products");

    // ---------- Step 2: Find Product Card ----------
    const productCard = page
        .getByTestId("product-card")
        .filter({
            has: page.getByTestId("product-title").filter({ hasText: productName })
        });

    const productTitle = productCard.getByTestId("product-title");
    const productPrice = productCard.getByTestId("product-price");
    const productImage = productCard.locator("img");

    // store values for validation
    const expectedTitle = await productTitle.textContent();
    const expectedPrice = await productPrice.textContent();

    // ---------- Step 3: Add to Cart ----------
    await productCard.hover();

    const addToCartBtn = productCard.getByRole("button", { name: /add to cart/i });
    await addToCartBtn.click();

    // ---------- Step 4: Open Cart Page ----------
    await page.getByTestId("navbar-cart").click();

    // ---------- Step 5: Validate Product in Cart ----------

    const cartProuctCard = page.getByTestId("cart-productcard").first();
    const cartProductTitle = cartProuctCard.locator("a");
    const cartProductPrice = cartProuctCard.locator("p").nth(-2);
    const cartProductImage = cartProuctCard.locator("img");

    // Title validation
    await expect(cartProductTitle).toHaveText(expectedTitle!);

    // Price validation
    await expect(cartProductPrice).toHaveText(expectedPrice!);

    // Image visible
    await expect(cartProductImage).toBeVisible();

    // Quantity = 1
    await expect(page.getByTestId("cart-count-title")).toHaveText("Shopping Cart (1)");

    // ---------- Step 6: Order Summary Validation ----------

    await expect(page.getByText(/order summary/i)).toBeVisible();
    await expect(page.getByTestId("cart-order-summary")).toBeVisible();

    // ---------- Step 7: Remove Product ----------
    await page.getByRole("button", { name: /Remove/i }).click();

    // ---------- Step 8: Verify Cart Empty ----------

    await expect(cartProuctCard).toHaveCount(0);

    // optional empty state check
    await expect(page.getByText(/Your cart is empty/i)).toBeVisible();

    await expect(page.getByRole("link", { name: /continue shopping/i })).toBeVisible();

    // navbar count = 0
    await expect(page.getByTestId("navbar-cart").locator("span")).toHaveCount(0);

});


test("Add 2 products → verify count and total calculation", async ({ page }) => {

    await page.goto("/products");

    // ---------- Helper to extract numeric price ----------
    const getPriceValue = (priceText: string) => {
        return Number(priceText.replace(/[₹,]/g, "").trim());
    };

    // ---------- Step 1: Select two products ----------
    const productCards = page.getByTestId("product-card");

    const product1 = productCards.nth(0);
    const product2 = productCards.nth(1);

    // ---------- Step 2: Get their prices ----------
    const price1Text = await product1.getByTestId("product-price").textContent();
    const price2Text = await product2.getByTestId("product-price").textContent();

    if (!price1Text || !price2Text) throw new Error("Price not found");

    const price1 = getPriceValue(price1Text);
    const price2 = getPriceValue(price2Text);

    // ---------- Step 3: Add both products ----------
    await product1.hover();
    await product1.getByRole("button", { name: /add to cart/i }).click();

    await product2.hover();
    await product2.getByRole("button", { name: /add to cart/i }).click();

    // ---------- Step 4: Open cart ----------
    await page.getByTestId("navbar-cart").click();
    await page.waitForTimeout(3000)

    // ---------- Step 5: Verify 2 products in cart ----------
    const cartProuctCard = page.getByTestId("cart-productcard")
    const cartItems = page.getByTestId("cart-count-title");
    const cartItemCount = await cartProuctCard.count();
    await expect(cartItems).toHaveText(`Shopping Cart (${cartItemCount})`);

    // ---------- Step 6: Verify navbar count ----------
    const cartCount = page.getByTestId("navbar-cart").locator("span");
    await expect(cartCount).toHaveText("2");

    // ---------- Step 7: Verify subtotal calculation ----------
    const expectedSubtotal = price1 + price2;

    const subTotalText = page
        .getByTestId("cart-subtotal").locator("span").first()
    await expect(subTotalText).toHaveText(`Subtotal (${cartItemCount} items)  × Qty (1)`);

    const subTotalPrice = await page
        .getByTestId("cart-subtotal").locator("span").last().textContent();

    if (!subTotalPrice) throw new Error("Subtotal not found");

    const actualSubtotal = getPriceValue(subTotalPrice);

    expect(actualSubtotal).toBe(expectedSubtotal);

    // ---------- Step 8: Verify total calculation ----------
    const totalText = await page
        .getByTestId("cart-total").locator("span").last()
        .textContent();
    console.log("Total Text:", totalText);

    if (!totalText) throw new Error("Total not found");

    const actualTotal = getPriceValue(totalText);

    // Optional: if discount exists (5%)
    const discountText = await page
        .getByTestId("cart-discount").locator("span").last()
        .textContent();

    let expectedTotal = expectedSubtotal;

    if (discountText) {
        const discountValue = Math.abs(getPriceValue(discountText));
        const expectedDiscount = Math.floor(expectedSubtotal * 0.05);
        expect(discountValue).toBe(expectedDiscount);
        expectedTotal = expectedSubtotal - discountValue;
    }

    expect(actualTotal).toBe(expectedTotal);

    // ---------- Step 9: Verify total format ----------
    const totalFormatRegex = /^₹[\d,]+$/;
    expect(totalText).toMatch(totalFormatRegex);

});


test("Dynamic quantity increase → verify total calculation", async ({ page }) => {

    await page.goto("/products");

    // ---------- Helper ----------
    const getPriceValue = (text: string) =>
        Number(text.replace(/[₹,]/g, "").trim());

    // ---------- Step 1: Select product ----------
    const productCard = page.getByTestId("product-card").first();

    const priceText = await productCard
        .getByTestId("product-price")
        .textContent();

    if (!priceText) throw new Error("Price not found");

    const price = getPriceValue(priceText);

    // ---------- Step 2: Add to cart ----------
    await productCard.hover();
    await productCard.getByRole("button", { name: /add to cart/i }).click();

    // ---------- Step 3: Open cart ----------
    await page.getByTestId("navbar-cart").click();
    await page.waitForTimeout(3000)
    const cartProuctCard = page.getByTestId("cart-productcard")
    const cartItemCount = await cartProuctCard.count();
    const cartqtypanel = cartProuctCard.getByTestId("cart-quantity-controls");
    await expect(cartqtypanel).toBeVisible();
    const qtyValue = cartqtypanel.locator("span");
    const increaseBtn = cartqtypanel.getByRole("button").last();
    const decreaseBtn = cartqtypanel.getByRole("button").first();

    // ---------- Step 4: Increase quantity dynamically ----------
    const targetQty = 4;

    for (let i = 1; i < targetQty + 2; i++) {
        await increaseBtn.click();
    }
    for (let i = 1; i < 3; i++) {
        await decreaseBtn.click();
    }
    // ---------- Step 5: Verify quantity ----------
    await expect(qtyValue).toHaveText(String(targetQty));

    // ---------- Step 6: Verify subtotal ----------
    const expectedSubtotal = price * targetQty;

    const subTotalText = page
        .getByTestId("cart-subtotal").locator("span").first()
    await expect(subTotalText).toHaveText(`Subtotal (${cartItemCount} items) × Qty (${targetQty})`);


    const subTotalPrice = await page
        .getByTestId("cart-subtotal").locator("span").last().textContent();

    if (!subTotalPrice) throw new Error("Subtotal not found");

    const actualSubtotal = getPriceValue(subTotalPrice);

    expect(actualSubtotal).toBe(expectedSubtotal);

    // ---------- Step 7: Verify total ----------
    const totalText = await page
        .getByTestId("cart-total").locator("span").last()
        .textContent();
    console.log("Total Text:", totalText);

    if (!totalText) throw new Error("Total not found");

    const actualTotal = getPriceValue(totalText);

    // Optional: if discount exists (5%)
    const discountText = await page
        .getByTestId("cart-discount").locator("span").last()
        .textContent();

    let expectedTotal = expectedSubtotal;

    if (discountText) {
        const discountValue = Math.abs(getPriceValue(discountText));
        const expectedDiscount = Math.floor(expectedSubtotal * 0.05);
        expect(discountValue).toBe(expectedDiscount);
        expectedTotal = expectedSubtotal - discountValue;
    }

    expect(actualTotal).toBe(expectedTotal);


});

test("Delivery charge ₹99 for product under ₹499 ", async ({ page }) => {

    await page.goto('/products');

    // ---------- Helper ----------
    const getPriceValue = (text: string) =>
        Number(text.replace(/[₹,]/g, '').trim());

    // ---------- Step 1: Apply Price Filter (< ₹499) ----------
    await page.getByTestId('filters-toggle').click();

    const priceSection = page.getByTestId('filter-price');

    const minInput = priceSection.getByPlaceholder('Min');
    const maxInput = priceSection.getByPlaceholder('Max');

    const minValue = 0;
    const maxValue = 499;

    await minInput.fill('');
    await minInput.fill(String(minValue));

    await maxInput.fill('');
    await maxInput.fill(String(maxValue));

    await maxInput.blur();

    // ---------- Step 2: Validate Filter Applied ----------
    await expect(page.getByTestId('active-filters')).toBeVisible();

    const products = page.getByTestId('product-card');
    const count = await products.count();

    if (count === 0) {
        throw new Error("No products found under ₹499");
    }

    // ---------- Step 3: Validate all filtered products ----------
    for (let i = 0; i < count / 4; i++) {

        const priceText = await products
            .nth(i)
            .getByTestId('product-price')
            .innerText();

        const price = getPriceValue(priceText);

        expect(price).toBeGreaterThanOrEqual(minValue);
        expect(price).toBeLessThanOrEqual(maxValue);
    }

    // ---------- Step 4: Select Product ----------
    const selectedProduct = products.first();

    const priceText = await selectedProduct
        .getByTestId('product-price')
        .textContent();

    if (!priceText) throw new Error("Price not found");

    const productPrice = getPriceValue(priceText);

    // ---------- Step 5: Add to Cart ----------
    await selectedProduct.hover();
    await selectedProduct.getByRole('button', { name: 'Add to Cart' }).click();

    // ---------- Step 6: Open Cart ----------
    await page.getByTestId('navbar-cart').click();

    // ---------- Step 7: Verify Delivery Charge ----------
    const cartdeliverycharge = page.getByTestId('cart-delivery-charges');
    const deliveryChargeText = await cartdeliverycharge.locator('span').first().textContent();
    await expect(deliveryChargeText).toContain('Delivery Charges');
    const cartdeliveryamt = await cartdeliverycharge.locator('span').last().textContent();

    expect(cartdeliveryamt).toContain('99');

    // ---------- Step 8: Verify Subtotal ----------
    const subtotalamt = await page
        .getByTestId('cart-subtotal').locator('span').last()
        .textContent();

    if (!subtotalamt) throw new Error("Subtotal missing");

    const subtotal = getPriceValue(subtotalamt);

    expect(subtotal).toBe(productPrice);

    // ---------- Step 9: Verify Total Calculation ----------
    const totalText = await page
        .getByTestId('cart-total').locator('span').last()
        .textContent();

    if (!totalText) throw new Error("Total missing");

    const total = getPriceValue(totalText);

    const discountText = await page
        .getByTestId('cart-discount').locator('span').last()
        .textContent();

    let expectedTotal = subtotal + 99;

    if (discountText) {
        const discount = Math.abs(getPriceValue(discountText));
        expectedTotal = subtotal - discount + 99;
    }

    expect(total).toBe(expectedTotal);

});


test("Clear cart and verify empty state", async ({ page }) => {

    await page.goto("/products");
    await page.waitForTimeout(3000)
    const productCards = page.getByTestId("product-card");

    // ---------- Step 1: Add multiple products ----------
    const count = await productCards.count();

    if (count < 2) {
        throw new Error("Not enough products to test");
    }

    // Add first product
    await productCards.nth(2).hover();
    await productCards.nth(2).getByRole("button", { name: /add to cart/i }).click();

    // Add second product
    await productCards.nth(6).hover();
    await productCards.nth(6).getByRole("button", { name: /add to cart/i }).click();

    // Add third product
    await productCards.nth(12).hover();
    await productCards.nth(12).getByRole("button", { name: /add to cart/i }).click();

    // ---------- Step 2: Open cart ----------
    await page.getByTestId("navbar-cart").click();

    const carttitle = page.getByTestId("cart-count-title");

    // verify items added
    await expect(carttitle).toHaveText("Shopping Cart (3)");

    // ---------- Step 3: Click Clear Cart ----------
    const clearCartBtn = page.getByRole("button", { name: /clear cart/i }).last();

    await clearCartBtn.click();

    // ---------- Step 4: Verify cart empty ----------
    const cartProuctCard = page.getByTestId("cart-productcard");
    await expect(cartProuctCard).toHaveCount(0);

    // ---------- Step 5: Verify empty state UI ----------
    await expect(page.getByText(/Your cart is empty/i)).toBeVisible();

    // ---------- Step 6: Verify navbar cart reset ----------
    const cartCount = page.getByTestId("navbar-cart").locator("span");

    await expect(cartCount).toHaveCount(0);

});

test("Quantity decrease validation with min limit message", async ({ page }) => {

    await page.goto("/products");

    const productCard = page.getByTestId("product-card").first();

    // ---------- Add to cart ----------
    await productCard.hover();
    await productCard.getByRole("button", { name: /add to cart/i }).click();

    await page.getByTestId("navbar-cart").click();

    const increaseBtn = page.getByTestId("cart-quantity-controls").locator("button").last();
    const decreaseBtn = page.getByTestId("cart-quantity-controls").locator("button").first();
    const qtyValue = page.getByTestId("cart-quantity-controls").locator("span");

    // ---------- Step 1: Increase to 6 ----------
    for (let i = 1; i < 6; i++) {
        await increaseBtn.click();
    }

    await expect(qtyValue).toHaveText("6");

    // ---------- Step 2: Decrease until 1 ----------
    for (let i = 6; i > 1; i--) {
        await decreaseBtn.click();
    }
    await expect(qtyValue).toHaveText("1");


    // ---------- Step 3: Click decrease again ----------
    await decreaseBtn.click();

    // ---------- Step 4: Verify error message ----------
    await expect(
        page.getByText(/at least 1 qty is required/i)
    ).toBeVisible();

});

test("Continue shopping button navigation", async ({ page }) => {

    await page.goto("/cart");

    await page.getByRole("link", { name: /continue shopping/i }).click();

    await expect(page).toHaveURL(/products/);
    await expect(page.getByTestId("product-card").first()).toBeVisible();

});

test("Large quantity (36 items) validation with Rapid Click", async ({ page }) => {

    await page.goto("/products");

    // ---------- Helper ----------
    const getPriceValue = (text: string) =>
        Number(text.replace(/[₹,]/g, "").trim());

    const productCard = page.getByTestId("product-card").first();
    const productcardPrice = await productCard.getByTestId("product-price").textContent();

    if (!productcardPrice) throw new Error("Price not found");

    await productCard.hover();
    await productCard.getByRole("button", { name: /add to cart/i }).click();

    await page.getByTestId("navbar-cart").click();

    const increaseBtn = page.getByTestId("cart-quantity-controls").locator("button").last();
    const qtyValue = page.getByTestId("cart-quantity-controls").locator("span");
    let qtyvaluecount = 36;
    for (let i = 1; i < qtyvaluecount; i++) {
        await increaseBtn.click();
    }

    await expect(qtyValue).toHaveText(qtyvaluecount.toString());

    const cartTotal = getPriceValue(productcardPrice) * qtyvaluecount;
    const expectedTotal = cartTotal - Math.floor(cartTotal * 0.05);
    const actualTotalText = await page.getByTestId("cart-total").locator("span").last().textContent();

    expect(actualTotalText).toBe(`₹${expectedTotal.toLocaleString()}`);

});


test("Remove one product from multiple and verify cart + Cart Persistence", async ({ page }) => {
    await page.goto("/products");

    // ---------- Helper ----------
    const getPriceValue = (text: string) =>
        Number(text.replace(/[₹,]/g, "").trim());

    // ---------- Step 1: Select two products ----------
    const productCards = page.getByTestId("product-card");
    const product1 = productCards.nth(0);
    const product1name = await product1.getByTestId("product-title").textContent();
    if (!product1name) throw new Error("Product 1 name not found");
    const product2 = productCards.nth(1);

    // Get product2 price (we will keep this)
    const priceText1 = await product1
        .getByTestId("product-price")
        .textContent();
    const priceText2 = await product2
        .getByTestId("product-price")
        .textContent();

    const productTotalPrice = getPriceValue(priceText1!) + getPriceValue(priceText2!);

    // ---------- Step 2: Add both products ----------
    await product1.hover();
    await product1.getByRole("button", { name: /add to cart/i }).click();

    await product2.hover();
    await product2.getByRole("button", { name: /add to cart/i }).click();

    // ---------- Step 3: Open cart ----------
    await page.getByTestId("navbar-cart").click();

    //verify total before removal
    const acttotalamtBefore = await page
        .getByTestId("cart-total").locator("span").last()
        .textContent();
    const expectedTotalBefore = productTotalPrice - Math.floor(productTotalPrice * 0.05);
    expect(acttotalamtBefore).toBe(`₹${expectedTotalBefore.toLocaleString()}`);

    const cartProuctCard = page.getByTestId("cart-productcard");
    await expect(cartProuctCard.getByRole("link", { name: product1name })).toBeVisible();
    
    // ---------- Step 4: Remove first product ----------
    const removeButtons = cartProuctCard.getByRole("button", { name: /Remove/i });
    await removeButtons.first().click();

    // ---------- Step 5: Verify only 1 product remains ----------
    await expect(cartProuctCard).toHaveCount(1);
    await expect(cartProuctCard.getByRole("link", { name: product1name })).not.toBeVisible();

    // ---------- Step 6: Verify total updated ----------
    const acttotalamtAfter = await page
        .getByTestId("cart-total").locator("span").last()
        .textContent();

    const expectedTotalAfter = getPriceValue(priceText2!) - Math.floor(getPriceValue(priceText2!) * 0.05);
    expect(acttotalamtAfter).toBe(`₹${expectedTotalAfter.toLocaleString()}`);

    // ---------- Step 7: Verify navbar count ----------
    const cartCount = page.getByTestId("navbar-cart").locator("span");
    await expect(cartCount).toHaveText("1");

    // ---------- Step 8: Refresh page ----------
    await page.reload();

    // ---------- Step 9: Verify persistence ----------
    await expect(cartProuctCard).toHaveCount(1);

    const refreshedSubtotalText = await page
        .getByTestId("cart-total").locator("span").last()
        .textContent();

    expect(refreshedSubtotalText).toBe(`₹${expectedTotalAfter.toLocaleString()}`);

});


