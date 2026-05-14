import { test } from '@playwright/test';
import { CartPage } from '../../../../ui/pages/cart/cartPage.page';
import { CartFlow } from '../../../../ui/flows/cart/cartPage.flow';
import { CartAssertions } from '../../../../validation/ui/cart/cartPageAssertion';

test.describe('Cart Feature - Full Suite', () => {

  let pageObj: CartPage;
  let flow: CartFlow;

  test.beforeEach(async ({ page }) => {
    pageObj = new CartPage(page);
    flow = new CartFlow(pageObj);
    await flow.openProducts();
  });

  // 1️⃣ Add → verify → remove → empty
  test('Add product → verify → remove → empty', async () => {
    const name = "H&M A-line Skirt Model 2 Variant 2";

    const product = pageObj.getProductCardByName(name);

    const title = await pageObj.getTitle(product).textContent();
    const price = await pageObj.getPrice(product).textContent();

    await flow.addProduct(product);
    await flow.openCart();

    const item = pageObj.cartItems.first();

    await CartAssertions.expectText(item.locator('a'), title!);
    await CartAssertions.expectText(item.locator('p').nth(-2), price!);

    await pageObj.getRemoveBtn().click();
    await CartAssertions.expectCount(pageObj.cartItems, 0);
  });

  // 2️⃣ Add 2 → total calc
  test.only('Add 2 products → total calculation', async () => {
    const cards = pageObj.productCards;

    const p1 = cards.nth(0);
    const p2 = cards.nth(1);

    const price1 = CartAssertions.getPriceValue(await pageObj.getPrice(p1).textContent()??'0');
    const price2 = CartAssertions.getPriceValue(await pageObj.getPrice(p2).textContent()??'0');

    await flow.addProduct(p1);
    await flow.addProduct(p2);

    await flow.openCart();

    const totalText = await pageObj.getCartTotal().textContent();
    const actual = CartAssertions.getPriceValue(totalText!);
    const discount = pageObj.getDiscount(price1, price2);
    CartAssertions.expectNumber(actual,(price1 + price2) - discount);
  });

  // 3️⃣ Quantity increase
  test('Dynamic quantity increase', async () => {
    const product = pageObj.productCards.first();

    await flow.addProduct(product);
    await flow.openCart();

    for (let i = 0; i < 5; i++) {
      await pageObj.getIncreaseBtn().click();
    }

    await CartAssertions.expectText(pageObj.getQty(), "6");
  });

  // 4️⃣ Delivery charge
  test('Delivery charge under ₹499', async () => {
    // kept simple (same logic preserved)
    await pageObj.page.goto('/products');

    await pageObj.productCards.first().hover();
    await pageObj.productCards.first().getByRole('button', { name: /add to cart/i }).click();

    await flow.openCart();

    await CartAssertions.expectVisible(pageObj.page.getByTestId('cart-delivery-charges'));
  });

  // 5️⃣ Clear cart
  test('Clear cart', async () => {
    await flow.addMultiple([2, 6, 12]);
    await flow.openCart();

    await pageObj.clearCartBtn().first().click();

    await CartAssertions.expectCount(pageObj.cartItems, 0);
  });

  // 6️⃣ Decrease validation
  test('Min quantity validation', async () => {
    const product = pageObj.productCards.first();

    await flow.addProduct(product);
    await flow.openCart();

    await pageObj.getDecreaseBtn().click();

    await CartAssertions.expectVisible(
      pageObj.page.getByText(/at least 1 qty is required/i)
    );
  });

  // 7️⃣ Continue shopping
  test('Continue shopping navigation', async () => {
    await pageObj.page.goto('/cart');

    await pageObj.page.getByRole('link', { name: /continue shopping/i }).click();

    await CartAssertions.expectVisible(pageObj.productCards.first());
  });

  // 8️⃣ Large quantity
  test('Large quantity (36 items)', async () => {
    const product = pageObj.productCards.first();

    await flow.addProduct(product);
    await flow.openCart();

    for (let i = 1; i < 36; i++) {
      await pageObj.getIncreaseBtn().click();
    }

    await CartAssertions.expectText(pageObj.getQty(), "36");
  });

  // 9️⃣ Remove one + persistence
  test('Remove one item + persistence', async () => {
    await flow.addMultiple([0, 1]);
    await flow.openCart();

    await pageObj.getRemoveBtn().first().click();

    await CartAssertions.expectCount(pageObj.cartItems, 1);

    await pageObj.page.reload();

    await CartAssertions.expectCount(pageObj.cartItems, 1);
  });

});