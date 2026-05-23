import { test } from '@playwright/test';
import { CartPage } from '../../../../ui/pages/cart/cart.page';
import { CartFlow } from '../../../../ui/flows/cart/cart.flow';
import { CartAssertions } from '../../../../validation/ui/cart/cartAssertion';

const productName = "H&M A-line Skirt Model 2 Variant 2";

test.describe("Add to Cart - Product Card Behavior", () => {

  let pageObj: CartPage;
  let flow: CartFlow;

  test.beforeEach(async ({ page }) => {
    pageObj = new CartPage(page);
    flow = new CartFlow(pageObj);

    await flow.openProducts();
  });

  // 1️⃣ Hover behavior 
  test("Add to Cart button hover behavior", async () => {
    const product = pageObj.getProductCardByName(productName);
    const addBtn = pageObj.getAddButton(product);

    await CartAssertions.expectHidden(addBtn);

    await flow.hoverProduct(product);

    await CartAssertions.expectVisible(addBtn);
  });

  // 2️⃣ Add product 
  test("Add product to cart", async () => {
    const product = pageObj.getProductCardByName(productName);

    await flow.hoverProduct(product);

    const addBtn = pageObj.getAddButton(product);
    await CartAssertions.expectText(addBtn, /add to cart/i);

    await flow.clickAdd(product);

    await CartAssertions.expectToast(
      pageObj.toast,
      new RegExp(`${productName} added to cart!`, "i")
    );

    await CartAssertions.expectCartCount(pageObj.cartCount, "1");
  });

  // 3️⃣ Button changes 
  test("Button text changes to In Cart", async () => {
    const product = pageObj.getProductCardByName(productName);
    const btn = pageObj.getCartButton(product);

    await flow.hoverProduct(product);
    await flow.clickCartButton(product);

    await flow.hoverProduct(product);

    await CartAssertions.expectText(btn, /in cart/i);
  });

  // 4️⃣ Quantity increase 
  test("Quantity increases when clicking In Cart", async () => {
    const product = pageObj.getProductCardByName(productName);

    await flow.hoverProduct(product);
    await flow.clickCartButton(product);

    await flow.hoverProduct(product);
    await flow.clickCartButton(product);

    await CartAssertions.expectToast(
      pageObj.toast.first(),
      new RegExp(`Increased quantity of ${productName}`, "i")
    );

    await CartAssertions.expectCartCount(pageObj.cartCount, "2");
  });

  // 5️⃣ Multiple clicks 
  test("Multiple quantity increase", async () => {
    const product = pageObj.getProductCardByName(productName);

    for (let i = 0; i < 3; i++) {
      await flow.hoverProduct(product);
      await flow.clickCartButton(product);
    }

    await CartAssertions.expectCartCount(pageObj.cartCount, "3");
  });

  // 6️⃣ Multiple products 
  test("Add multiple products to cart", async () => {
    const cards = pageObj.productCards;

    for (let i = 0; i < 2; i++) {
      const card = cards.nth(i);

      await flow.hoverProduct(card);
      await flow.clickCartButton(card);
    }

    await CartAssertions.expectCartCount(pageObj.cartCount, "2");
  });

});