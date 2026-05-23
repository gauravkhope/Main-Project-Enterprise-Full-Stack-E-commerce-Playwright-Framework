import { test } from '../../../core/fixtures/base.fixture';
import users from '../../../data/static/users.json';
import { LoginAssertions } from '../../../validation/ui/auth/loginAssertions';

 test('complete user journey', async ({ loginFlow, loginPage , page }) => {
    const user = users.validUser;

    await loginFlow.login(user.email, user.password);

    await LoginAssertions.expectLoginSuccess(loginPage);
 const productName = "Galaxy S25 ultra";

 const productCard =  page.getByTestId("trending-product-card").filter({
        has: page.getByRole("heading", { name: productName , exact: true}),
  })
  await productCard.click();
  await page.getByRole("button", { name: "Add to Wishlist" }).click();
  await page.getByTestId("navbar-wishlist").click();
  await page.waitForTimeout(2000);
})