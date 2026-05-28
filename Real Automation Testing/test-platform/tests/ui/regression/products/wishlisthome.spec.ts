import { test, expect } from '@playwright/test';
import { WishlistPage } from '../../../../ui/pages/products/wishlist.page';
import { WishlistFlow } from '../../../../ui/flows/products/wishlist.flow';
import { WishlistAssertions } from '../../../../validation/ui/products/wishlist.assertions';

test.describe('Wishlist Feature', () => {

  let pageObj: WishlistPage;
  let flow: WishlistFlow;

  test.beforeEach(async ({ page }) => {
    pageObj = new WishlistPage(page);
    flow = new WishlistFlow(pageObj);

    await flow.openHomeProducts();
    await pageObj.page.evaluate(() => {
  const pageHeight = document.body.scrollHeight;
  const scrollPosition = pageHeight * 0.3;

  window.scrollTo(0, scrollPosition);
});
  });

  // ==============================
  // 1️⃣ TOGGLE TEST
  // ==============================
  test.skip('Wishlist toggle validation', async () => {

    const productName = "Galaxy S25";

    const product = pageObj.getHomeProductCardByName(productName);
    const heart = pageObj.getHeartIcon(product);

    const classBefore = await heart.getAttribute("class");

    const currentCount = (await pageObj.wishlistCount.isVisible())
      ? parseInt((await pageObj.wishlistCount.textContent()) ?? "0")
      : 0;

    if (!classBefore?.includes("fill-[url(#heartGradient)]")) {

      await heart.click();

      await WishlistAssertions.expectHeartFilled(heart);
      await WishlistAssertions.expectNavbarActive(pageObj.navbarWishlist);
      await WishlistAssertions.expectCount(pageObj.wishlistCount, currentCount + 1);

      await WishlistAssertions.expectToast(
        pageObj.toast,
        new RegExp(`${productName} added to wishlist!`, "i")
      );

    } else {

      await heart.click();

      await WishlistAssertions.expectHeartNotFilled(heart);
      await WishlistAssertions.expectNavbarInactive(pageObj.navbarWishlist);
      await WishlistAssertions.expectCountZero(pageObj.wishlistCount);

      await WishlistAssertions.expectToast(
        pageObj.toast,
        new RegExp(`${productName} removed from wishlist!`, "i")
      );
    }
  });

  // ==============================
  // 2️⃣ SINGLE PRODUCT FLOW
  // ==============================
  test('verify product added to wishlist is displayed in wishlist page', async () => {

    const productName = "Galaxy S25";

    await flow.addToWishlistHome(productName);
    await flow.openWishlist();

    await WishlistAssertions.expectWishlistItemVisible(pageObj.wishlistItems, productName);

    const item = pageObj.wishlistItems.first();

    await flow.removeFromWishlist(item);

    await WishlistAssertions.expectWishlistCount(pageObj.wishlistItems, 0);
  });

  // ==============================
  // 3️⃣ MULTIPLE PRODUCTS
  // ==============================
  test.only('verify multiple products can be added and removed', async () => {

    const productNames = [
      "Galaxy S25",
      "iphone 17",
      "iphone 16 Pro Max",
      "Galaxy Fold 7",
      "MacBook Pro M4 16 inch"
    ];

    for (const name of productNames) {
      await flow.addToWishlistHome(name);
    }

    await flow.openWishlist();

    await WishlistAssertions.expectWishlistCount(
      pageObj.wishlistItems,
      productNames.length
    );

    await flow.clearWishlist();

    await WishlistAssertions.expectWishlistCount(pageObj.wishlistItems, 0);
    await WishlistAssertions.expectEmptyWishlist(pageObj.emptyMessage());
  });

});