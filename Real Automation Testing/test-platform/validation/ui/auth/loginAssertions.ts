import { expect } from '@playwright/test';
import { LoginPage } from '../../../ui/pages/auth/login.page';

export class LoginAssertions {

  static async expectEmptyValidation(loginPage: LoginPage) {
    await expect(loginPage.form.getByText('Email is required')).toBeVisible();
    await expect(loginPage.form.getByText('Password is required')).toBeVisible();
  }

  static async expectInvalidCredentials(loginPage: LoginPage) {
    await expect(loginPage.errorToast).toBeVisible();
    await expect(loginPage.errorToast).toHaveText(/invalid email or password/i);
  }

  static async expectInvalidEmailFormat(loginPage: LoginPage) {
    await expect(loginPage.errorToast).toHaveCount(0);
    await expect(loginPage.signInButton).toBeVisible();
  }

  static async expectLoginSuccess(loginPage: LoginPage) {
    await expect(loginPage.errorToast).toBeVisible();
    await expect(loginPage.errorToast).toHaveText(/Welcome back/i);
  }

  static async expectFieldValidation(loginPage: LoginPage, message: string) {
  await expect(loginPage.form.getByText(message)).toBeVisible();
}

}