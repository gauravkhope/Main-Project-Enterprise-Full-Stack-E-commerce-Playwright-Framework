import { NavbarComponent } from '../../components/navbar.component';

export class NavbarFlow {
  constructor(private navbar: NavbarComponent) {}

  async goToCart() {
    await this.navbar.clickCart();
  }

  async goToWishlist() {
    await this.navbar.clickWishlist();
  }

  async clickLogo() {
    await this.navbar.clickLogo();
  }
}