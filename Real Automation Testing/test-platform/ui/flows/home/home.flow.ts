import { HomePage } from '../../pages/home/home.page';

export class HomeFlow {
  constructor(private homePage: HomePage) {}

  async openHomePage() {
    await this.homePage.navigate();
  }

  async clickCarouselDot(index: number) {
    await this.homePage.clickDot(index);
  }

  async getCurrentSlideAlt() {
    return await this.homePage.getCurrentImageAlt();
  }
}