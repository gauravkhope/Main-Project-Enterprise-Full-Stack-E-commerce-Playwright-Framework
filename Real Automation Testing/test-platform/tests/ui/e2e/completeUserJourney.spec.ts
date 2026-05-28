import { test } from "../../../core/fixtures/base.fixture";
import users from "../../../data/static/users.json";
import { LoginAssertions } from "../../../validation/ui/auth/loginAssertions";
// add custom fixtures
test("complete user journey", async ({
  loginFlow,
  loginPage,
  page,
  checkoutPage,
  checkoutFlow,
}) => {
  const user = users.validUser;

  // Login
  await loginFlow.login(user.email, user.password);

  await LoginAssertions.expectLoginSuccess(loginPage);

  // Select product
  const productName = "Galaxy S25 ultra";
  const productCard = page.getByTestId("trending-product-card").filter({
    has: page.getByRole("heading", { name: productName, exact: true }),});
  await productCard.click();

  //Add to Whishlist 
  await page.getByRole("button", { name: "Add to Wishlist" }).click();
  await page.waitForTimeout(1000)
  await page.getByTestId("navbar-wishlist").click();
   await page.waitForTimeout(1000)

  // Move to Cart
   await page.waitForTimeout(1000)
  await page.getByRole("button", { name: "Move to Cart" }).click();
  await page.getByTestId("navbar-cart").click();
   await page.waitForTimeout(1000)

  // click on proceed to checkout
   await page.waitForTimeout(1000)
  await page.getByRole("link", { name: "Proceed to Checkout" }).click();

   // Fill Shipping Details
  await checkoutPage.fillShipping();
   await page.waitForTimeout(1000)

  // Proceed to Payment and complete valid card payment
  await checkoutPage.proceedToPayment();
   await page.waitForTimeout(1000)
  await checkoutFlow.completeValidPayment();
  await page.waitForTimeout(2000);

  // click on Place Order
  await page.getByRole("button", { name: "Place Order" }).click();
  await page.waitForTimeout(2000);

  //click on view order details
  await page.getByRole("button", { name: "View Order Details" }).click();
   await page.waitForTimeout(1000)
  await page.getByRole("button", { name: "View Order Details" }).click();
  await page.waitForTimeout(2000);

  await page.close();

  // Test Case End 
  console.log("✅ Complete User Journey Test Case End");
  console.log("==============================================");
});
