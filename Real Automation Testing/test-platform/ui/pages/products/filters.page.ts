import { Page, Locator } from '@playwright/test';

export class FiltersPage {
  filtersBtn: Locator;
  panel: Locator;
  brands: Locator;
  price: Locator;
  clearBtn: Locator;

  activeFilters: Locator;
  chips: Locator;

  products: Locator;

  paginationNext: Locator;
  paginationNumbers: Locator;

  constructor(public page: Page) {
    this.filtersBtn = this.page.getByTestId('filters-toggle');
    this.panel = this.page.getByTestId('filters-panel');
    this.brands = this.page.getByTestId('filter-brands');
    this.price = this.page.getByTestId('filter-price');
    this.clearBtn = this.page.getByTestId('clear-filters');

    this.activeFilters = this.page.getByTestId('active-filters');
    this.chips = this.page.getByTestId('active-filter-chip');

    this.products = this.page.getByTestId('product-card');

    this.paginationNext = this.page.locator("//button[normalize-space()='Next']");
    this.paginationNumbers = this.page.getByTestId('pagination-numbers');
  }

  minInput(): Locator {
    return this.price.getByPlaceholder('Min');
  }

  maxInput(): Locator {
    return this.price.getByPlaceholder('Max');
  }

  slider(): Locator {
    return this.price.locator('input[type="range"]');
  }

  getBrandCheckbox(name: string): Locator {
    return this.brands.getByLabel(name);
  }

  getBrandCount(name: string): Locator {
    return this.page.getByTestId(`brand-count-${name}`);
  }
}