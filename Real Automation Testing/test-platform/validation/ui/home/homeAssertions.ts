import { expect } from '@playwright/test';
import { HomePage } from '../../../ui/pages/home/home.page';

export class HomeAssertions {

  static async expectCarouselVisible(homePage: HomePage) {
    await expect(homePage.carousel).toBeVisible();
  }

  static async expectSlideContentVisible(homePage: HomePage) {
    await expect(homePage.image).toBeVisible();
    await expect(homePage.heading).toBeVisible();
  }

  static async expectSlideChanged(homePage: HomePage, previousAlt: string) {
    await expect(homePage.image).not.toHaveAttribute('alt', previousAlt, {
      timeout: 8000,
    });
  }

  static async expectDotCount(homePage: HomePage, count: number) {
    await expect(homePage.dots).toHaveCount(count);
  }

  static async expectSingleActiveDot(homePage: HomePage) {
    await expect(homePage.activeDot).toHaveCount(1);
  }
}