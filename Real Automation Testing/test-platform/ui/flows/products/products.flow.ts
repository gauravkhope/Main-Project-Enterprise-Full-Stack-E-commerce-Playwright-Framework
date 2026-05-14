import { ProductsPage } from '../../pages/products/products.page';

export class ProductsFlow {
  constructor(private productsPage: ProductsPage) {}

  async openProductsPage() {
    await this.productsPage.navigate();
    await this.productsPage.waitForProductsToLoad();
  }
}