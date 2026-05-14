import { FiltersComboPage } from '../../pages/products/filtersCombo.page';

export class FiltersComboFlow {
  constructor(private pageObj: FiltersComboPage) {}

  async openProducts() {
    await this.pageObj.page.goto('/products');
  }

  async openFilters() {
    await this.pageObj.filtersBtn.click();
  }

  async applyBrands(brands: string[]) {
    for (const brand of brands) {
      await this.pageObj.getBrandCheckbox(brand).check();
    }
  }

  async applyPrice(min: number, max: number) {
    await this.pageObj.minInput().fill('');
    await this.pageObj.minInput().fill(String(min));

    await this.pageObj.maxInput().fill('');
    await this.pageObj.maxInput().fill(String(max));

    await this.pageObj.maxInput().blur();
  }

  async goNextPage() {
    await this.pageObj.paginationNext.click();
    await this.pageObj.page.waitForLoadState('networkidle');
  }
}