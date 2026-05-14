import { FiltersPage } from '../../pages/products/filters.page';

export class FiltersFlow {
  constructor(private filtersPage: FiltersPage) {}

  async openProducts() {
    await this.filtersPage.page.goto('/products');
  }

  async openFilters() {
    await this.filtersPage.filtersBtn.click();
  }

  async toggleFilters() {
    await this.filtersPage.filtersBtn.click();
  }

  async goToNextPage() {
    await Promise.all([
      this.filtersPage.page.waitForLoadState('networkidle'),
      this.filtersPage.paginationNext.click()
    ]);
  }
}