import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  readonly productCards: Locator;
  readonly cartIcon: Locator;
  readonly cartCount: Locator;
  readonly cartItems: Locator;
  readonly cartTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productCards = page.getByTestId('product-card');
    this.cartIcon = page.getByTestId('navbar-cart');
    this.cartCount = this.cartIcon.locator('span');

    this.cartItems = page.getByTestId('cart-productcard');
    this.cartTitle = page.getByTestId('cart-count-title');
  }

  getProductCardByName(name: string) {
    return this.productCards.filter({
      has: this.page.getByTestId('product-title').filter({ hasText: name })
    });
  }

  getAddBtn(product: Locator) {
    return product.getByRole('button', { name: /add to cart/i });
  }

  getPrice(product: Locator) {
    return product.getByTestId('product-price');
  }

  getTitle(product: Locator) {
    return product.getByTestId('product-title');
  }

  getCartTotal() {
    return this.page.getByTestId("cart-total").locator("span").last();
  }

  getSubtotal() {
    return this.page.getByTestId("cart-subtotal").locator("span").last();
  }
   getDiscount(price1:Number,price2:Number) {
    const total = (Number(price1) + Number(price2));
    const discount =Math.floor(total * 0.05);  // Assuming a 5% discount
    return discount;
   }
  getIncreaseBtn() {
    return this.page.getByTestId("cart-quantity-controls").locator("button").last();
  }

  getDecreaseBtn() {
    return this.page.getByTestId("cart-quantity-controls").locator("button").first();
  }

  getQty() {
    return this.page.getByTestId("cart-quantity-controls").locator("span");
  }

  getRemoveBtn() {
    return this.page.getByRole("button", { name: /remove/i });
  }

  clearCartBtn() {
    return this.page.getByRole("button", { name: /clear cart/i });
  }
}