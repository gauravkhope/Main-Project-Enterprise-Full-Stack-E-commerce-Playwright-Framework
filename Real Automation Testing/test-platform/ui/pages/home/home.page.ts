import { Page, Locator } from '@playwright/test';
import { UIActions } from '../../../core/wrappers/uiActions';

export class HomePage {
  readonly page: Page;

  readonly carousel: Locator;
  readonly image: Locator;
  readonly heading: Locator;
  readonly dots: Locator;
  readonly activeDot: Locator;

  constructor(page: Page) {
    this.page = page;

    this.carousel = page.locator('#hero-carousel');
    this.image = this.carousel.locator('img:visible').first();
    this.heading = this.carousel.locator('h2:visible').first();
    this.dots = page.getByTestId('hero-carousel-dots').locator('button');
    this.activeDot = page.locator(
      '[data-testid="hero-carousel-dots"] button.bg-blue-500'
    );
  }

  async navigate() {
    await this.page.goto('/');
  }

  async clickDot(index: number) {
    await UIActions.click(this.dots.nth(index), `Dot ${index}`);
  }

  async getCurrentImageAlt() {
    return await this.image.getAttribute('alt');
  }
}