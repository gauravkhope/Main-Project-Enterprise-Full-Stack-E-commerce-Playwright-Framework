import { test } from '../../../core/fixtures/base.fixture';
import { HomeAssertions } from '../../../validation/ui/home/homeAssertions';

test.describe('Homepage - Hero Carousel', () => {

  test('Carousel is visible', async ({ homeFlow, homePage }) => {
    await homeFlow.openHomePage();
    await HomeAssertions.expectCarouselVisible(homePage);
  });

  test('Initial slide content visible', async ({ homeFlow, homePage }) => {
    await homeFlow.openHomePage();
    await HomeAssertions.expectSlideContentVisible(homePage);
  });

  test('Slide auto rotates', async ({ homeFlow, homePage }) => {
    await homeFlow.openHomePage();

    const firstAlt = await homeFlow.getCurrentSlideAlt();

    await HomeAssertions.expectSlideChanged(homePage, firstAlt!);
  });

  test('Dot count is correct', async ({ homeFlow, homePage }) => {
    await homeFlow.openHomePage();
    await HomeAssertions.expectDotCount(homePage, 5);
  });

  test('Clicking dot changes slide', async ({ homeFlow, homePage }) => {
    await homeFlow.openHomePage();

    const firstAlt = await homeFlow.getCurrentSlideAlt();

    await homeFlow.clickCarouselDot(1);

    await HomeAssertions.expectSlideChanged(homePage, firstAlt!);
  });

  test('Only one active dot', async ({ homeFlow, homePage }) => {
    await homeFlow.openHomePage();
    await HomeAssertions.expectSingleActiveDot(homePage);
  });

});