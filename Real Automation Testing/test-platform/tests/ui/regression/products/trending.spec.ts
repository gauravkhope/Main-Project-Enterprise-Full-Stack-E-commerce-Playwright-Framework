import { test } from '../../../../core/fixtures/base.fixture';
import { TrendingAssertions } from '../../../../validation/ui/products/trendingAssertions';

test.describe('Trending Products', () => {

  test('Section visible', async ({ trendingFlow, trending }) => {
    await trendingFlow.openHome();
    await TrendingAssertions.expectSectionVisible(trending);
  });

  test('Products render correctly', async ({ trendingFlow, trending }) => {
    await trendingFlow.openHome();
    await TrendingAssertions.expectProductsExist(trending);
    await TrendingAssertions.expectProductDetails(trending);
  });

  test('Navigation works', async ({ trendingFlow, page }) => {
    await trendingFlow.openHome();
    await trendingFlow.openFirstProduct();
    await TrendingAssertions.expectNavigation(page);
  });

  test('Carousel next/prev works', async ({ trendingFlow, trending }) => {
    await trendingFlow.openHome();

    await trendingFlow.goNext();
    await TrendingAssertions.expectProductsExist(trending);

    await trendingFlow.goPrev();
    await TrendingAssertions.expectProductsExist(trending);
  });

  test.skip('Slide visibility logic', async ({ trendingFlow, trending }) => {
    await trendingFlow.openHome();

    await TrendingAssertions.expectSlideVisibleRange(trending, 0, 5);

    await trendingFlow.goNext();
    await TrendingAssertions.expectSlideVisibleRange(trending, 5, 10);

    await trendingFlow.goNext();
    await TrendingAssertions.expectSlideVisibleRange(trending, 10, 15);
  });

  test('Auto slide changes', async ({ trendingFlow, trending }) => {
    await trendingFlow.openHome();

    const first = await trending.getProductTitle(0);

    await new Promise(r => setTimeout(r, 3800));

    await TrendingAssertions.expectSlideChanged(trending, first!, 4);
  });

});