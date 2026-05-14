import { test } from '../../../../core/fixtures/base.fixture';
import { ProductsAssertions } from '../../../../validation/ui/products/productsAssertions';

test.describe('Products Page', () => {

  test('Page loads', async ({ productsFlow, page }) => {
    await productsFlow.openProductsPage();
    await ProductsAssertions.expectPageLoaded(page);
  });

  test('Product grid visible', async ({ productsFlow, productsPage }) => {
    await productsFlow.openProductsPage();
    await ProductsAssertions.expectGridVisible(productsPage);
  });

  test('All product cards displayed', async ({ productsFlow, productsPage }) => {
    await productsFlow.openProductsPage();
    await ProductsAssertions.expectProductsDisplayed(productsPage);
  });

});