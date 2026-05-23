import { Page } from '@playwright/test';

export async function performLogin(page: Page): Promise<void> {
  await page.goto('/');

  await page.getByTestId('navbar-hamburger').click();
  await page.getByTestId('side-drawer').getByText('Log In').click();

  await page.getByPlaceholder('you@example.com')
    .fill((globalThis as any).process?.env?.CHECKOUT_USER_EMAIL || 'gauravkhope31@gmail.com');

  await page.locator('#password')
    .fill((globalThis as any).process?.env?.CHECKOUT_USER_PASSWORD || 'Gaurav31');

  await page.getByText('Remember me').check();

  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.waitForURL('/');
}
