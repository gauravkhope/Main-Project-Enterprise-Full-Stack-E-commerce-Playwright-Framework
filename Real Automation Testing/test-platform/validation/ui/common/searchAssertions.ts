import { expect, Page } from '@playwright/test';
import { SearchComponent } from '../../../ui/components/search.component';

export class SearchAssertions {

  static async expectSearchVisible(search: SearchComponent) {
    await expect(search.searchInput).toBeVisible();
    await expect(search.searchButton).toBeVisible();
  }

  static async expectDropdownVisible(search: SearchComponent) {
    await expect(search.dropdown).toBeVisible();
    await expect(search.suggestions.first()).toBeVisible();
  }

  static async expectSuggestionsContain(search: SearchComponent, keyword: string) {
    const texts = await search.getSuggestionTexts();
    const firstThree = texts.slice(0, 3);

    for (const text of firstThree) {
      expect(text.toLowerCase()).toContain(keyword.toLowerCase());
    }
  }

  static async expectResultsVisible(search: SearchComponent) {
    const productDetailsLinks = search.page.locator('a[href^="/details/"]');
    await expect(productDetailsLinks.first()).toBeVisible({ timeout: 15000 });

    const count = await productDetailsLinks.count();
    expect(count).toBeGreaterThan(0);
  }

  static async expectNoResults(page : Page) {
    await expect(page.getByText('No products found')).toBeVisible();
  }
  static async expectDropdownHidden(search: SearchComponent) {
  await expect(search.dropdown).toBeHidden();
}
static async expectNavigationResult(page: Page, text: string) {
  const resultsHeader = page.getByRole('heading', { name: /Search Results for:/i });

  await expect(resultsHeader).toBeVisible({ timeout: 15000 });
  await expect(resultsHeader).toContainText(text ?? '');

  await expect(
    page.getByTestId('navbar-search-input')
  ).toHaveValue(text ?? '');
}
}