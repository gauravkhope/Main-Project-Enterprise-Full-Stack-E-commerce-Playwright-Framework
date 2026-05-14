import { test } from '../../../../core/fixtures/base.fixture';
import { SearchAssertions } from '../../../../validation/ui/common/searchAssertions';

test.describe('Search Feature', () => {

  test('Search UI visible', async ({ searchFlow, search }) => {
    await searchFlow.openHome();
    await SearchAssertions.expectSearchVisible(search);
  });

  test('Partial typing shows suggestions', async ({ searchFlow, search }) => {
    await searchFlow.openHome();

    await searchFlow.typePartial('sam');

    await SearchAssertions.expectDropdownVisible(search);
    await SearchAssertions.expectSuggestionsContain(search, 'sam');
  });

  test('Continue typing updates suggestions', async ({ searchFlow, search }) => {
    await searchFlow.openHome();

    await searchFlow.typePartial('sam');
    await searchFlow.continueTyping('sun');

    await SearchAssertions.expectSuggestionsContain(search, 'samsun');
  });

  test('Click suggestion navigates to product page', async ({ searchFlow, search, page }) => {
    await searchFlow.openHome();

    await searchFlow.typePartial('appl');

    await SearchAssertions.expectDropdownVisible(search);

    const texts = await search.getSuggestionTexts();
    const first = texts[0];

    await searchFlow.clickFirstSuggestion();

  await SearchAssertions.expectNavigationResult(page, first!);
  });

  test('Search with full keyword', async ({ searchFlow, search }) => {
    await searchFlow.openHome();

    await searchFlow.searchWithKeyword('Apple');

    await SearchAssertions.expectResultsVisible(search);
  });

  test('Invalid search shows no results', async ({ searchFlow, search, page }) => {
    await searchFlow.openHome();

    await searchFlow.searchWithKeyword('zzzzzzzz12345');

    await SearchAssertions.expectNoResults(page);
  });

  test('Dropdown hides when input cleared', async ({ searchFlow, search }) => {
    await searchFlow.openHome();

    await searchFlow.typePartial('app');
    await SearchAssertions.expectDropdownVisible(search);

    await searchFlow.clearInput();

    await SearchAssertions.expectDropdownHidden(search);
  });

  test('Rapid typing does not break dropdown', async ({ searchFlow, search }) => {
    await searchFlow.openHome();

    await searchFlow.rapidType('Apple macbook pro');

    await SearchAssertions.expectDropdownVisible(search);
  });

  test('Stress test - rapid type & clear (10 iterations)', async ({ searchFlow, search }) => {
    await searchFlow.openHome();

    for (let i = 0; i < 10; i++) {
      await searchFlow.typeWithDelay('samsung');

      await SearchAssertions.expectDropdownVisible(search);

      await searchFlow.clearInput();

      await SearchAssertions.expectDropdownHidden(search);
    }
  });

});