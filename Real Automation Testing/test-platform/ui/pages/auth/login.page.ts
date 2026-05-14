import { Page, Locator } from '@playwright/test';
import { UIActions } from '../../../core/wrappers/uiActions';

export class LoginPage {
  readonly page: Page;

  readonly hamburgerMenu: Locator;
  readonly sideDrawer: Locator;
  readonly loginButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly signInButton: Locator;
  readonly errorToast: Locator;
  readonly form: Locator;

  constructor(page: Page) {
    this.page = page;

    this.hamburgerMenu = page.getByTestId('navbar-hamburger');
    this.sideDrawer = page.getByTestId('side-drawer');
    this.loginButton = this.sideDrawer.getByText(/log in/i);
    this.emailInput = page.getByPlaceholder('you@example.com');
    this.passwordInput = page.getByLabel('Password');
    this.rememberMeCheckbox = page.getByText('Remember me');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.errorToast = page.getByRole('status');
    this.form = page.locator('form');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async openLogin() {
    await UIActions.click(this.hamburgerMenu, 'Hamburger Menu');
    await UIActions.click(this.loginButton, 'Login Button');
  }

  async fillCredentials(email: string, password: string) {
    await UIActions.fill(this.emailInput, email, 'Email Input');
    await UIActions.fill(this.passwordInput, password, 'Password Input');
  }

  async toggleRememberMe() {
    await UIActions.click(this.rememberMeCheckbox, 'Remember Me Checkbox');
  }

  async submit() {
    await UIActions.click(this.signInButton, 'Sign In Button');
  }
}