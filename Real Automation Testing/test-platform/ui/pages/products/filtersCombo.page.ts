import { Page } from '@playwright/test';

export class FiltersComboPage {
  constructor(public page: Page) {}

  get filtersBtn() {
    return this.page.getByTestId('filters-toggle');
  }

  get brandSection() {
    return this.page.getByTestId('filter-brands');
  }

  get priceSection() {
    return this.page.getByTestId('filter-price');
  }

  get activeFilters() {
    return this.page.getByTestId('active-filters');
  }

  get chips() {
    return this.page.getByTestId('active-filter-chip');
  }

  get products() {
    return this.page.getByTestId('product-card');
  }

  get paginationNext() {
    return this.page
      .getByTestId('pagination-controls')
      .getByRole('button', { name: 'Next' });
  }

  get productGrid() {
    return this.page.getByTestId('product-grid');
  }

  minInput() {
    return this.priceSection.getByPlaceholder('Min');
  }

  maxInput() {
    return this.priceSection.getByPlaceholder('Max');
  }

  getBrandCheckbox(name: string) {
    return this.brandSection.getByLabel(name);
  }

  getAllBrandCheckboxes() {
    return this.brandSection.locator('input[type="checkbox"]');
  }
}