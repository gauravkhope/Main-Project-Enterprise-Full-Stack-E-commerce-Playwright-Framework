import { Page, Locator } from '@playwright/test';
import { CategoryPage } from '../../pages/products/category.page';

export class CategoryFlow {
  constructor(
    private page: Page,
    private categoryPage: CategoryPage
  ) {}

  async openHome() {
    await this.page.goto('/');
  }

  async scrollToCategory() {
    await this.categoryPage.section.scrollIntoViewIfNeeded();
  }

  async openCategory(category: Locator) {
    await this.categoryPage.getSeeAll(category).click();
  }

  async goBack() {
    await this.page.goBack();
    await this.scrollToCategory();
  }
}