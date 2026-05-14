import { Page, Locator } from '@playwright/test';
import { UIActions } from '../../core/wrappers/uiActions';

export class SearchComponent {
  readonly page: Page;

  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly dropdown: Locator;
  readonly suggestions: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = page.getByTestId('navbar-search-input');
    this.searchButton = page.getByTestId('navbar-search-button');
    this.dropdown = page.getByTestId('search-suggestion-dropdown');
    this.suggestions = page.getByTestId('search-suggestion-item');
    this.productCards = page.getByTestId('product-card');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async typeKeyword(keyword: string) {
    await UIActions.fill(this.searchInput, keyword, 'Search Input');
  }

  async clickSearch() {
    await UIActions.click(this.searchButton, 'Search Button');
  }

  async clearInput() {
    await this.searchInput.clear();
  }

  async clickFirstSuggestion() {
    await UIActions.click(this.suggestions.first(), 'First Suggestion');
  }

  async getSuggestionTexts() {
    return await this.suggestions.locator('span').allTextContents();
  }
}