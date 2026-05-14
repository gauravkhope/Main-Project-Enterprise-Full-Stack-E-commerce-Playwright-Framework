import { LoginPage } from '../../pages/auth/login.page';

export class LoginFlow {
  constructor(private loginPage: LoginPage) {}

  async login(email: string, password: string) {
    await this.loginPage.navigate();
    await this.loginPage.openLogin();
    await this.loginPage.fillCredentials(email, password);
    await this.loginPage.toggleRememberMe();
    await this.loginPage.submit();
  }
}