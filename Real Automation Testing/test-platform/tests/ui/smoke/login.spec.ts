import { test } from '../../../core/fixtures/base.fixture';
import users from '../../../data/static/users.json';
import { UserFactory } from '../../../data/factories/userFactory';
import { LoginAssertions } from '../../../validation/ui/auth/loginAssertions';

test.describe('Login Tests', () => {

  test('Empty credentials validation', async ({ loginFlow, loginPage }) => {
    const user = users.emptyUser;

    await loginFlow.login(user.email, user.password);

    await LoginAssertions.expectEmptyValidation(loginPage);
  });

  test('Invalid credentials', async ({ loginFlow, loginPage }) => {
    const user = users.invalidUser;

    await loginFlow.login(user.email, user.password);

    await LoginAssertions.expectInvalidCredentials(loginPage);
  });

  test('Random invalid password', async ({ loginFlow, loginPage }) => {
    const user = UserFactory.generateInvalidUser();

    await loginFlow.login(user.email, user.password);

    await LoginAssertions.expectInvalidCredentials(loginPage);
  });

  test('Valid login', async ({ loginFlow, loginPage }) => {
    const user = users.validUser;

    await loginFlow.login(user.email, user.password);

    await LoginAssertions.expectLoginSuccess(loginPage);
  });

  test('Invalid email format', async ({ loginFlow, loginPage }) => {
  const user = users.invalidEmailFormat;

  await loginFlow.login(user.email, user.password);

  await LoginAssertions.expectInvalidEmailFormat(loginPage);
});

test('Only email empty', async ({ loginFlow, loginPage }) => {
  const user = users.onlyEmailEmpty;

  await loginFlow.login(user.email, user.password);

  await LoginAssertions.expectFieldValidation(loginPage, 'Email is required');
});

test('Only password empty', async ({ loginFlow, loginPage }) => {
  const user = users.onlyPasswordEmpty;

  await loginFlow.login(user.email, user.password);

  await LoginAssertions.expectFieldValidation(loginPage, 'Password is required');
});

test('Long input values', async ({ loginFlow, loginPage }) => {
  const user = users.longInputUser;

  await loginFlow.login(user.email, user.password);

  await LoginAssertions.expectInvalidCredentials(loginPage);
});

});


/*
==============================================================================

              LOGIN TESTS  WITHOUT FIXTURES 

==============================================================================



import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../ui/pages/login.page';
import { LoginFlow } from '../../../ui/flows/login.flow';
import users from '../../../data/static/users.json';
import { UserFactory } from '../../../data/factories/userFactory';

test.describe('Login Tests', () => {

 test('Empty credentials validation', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const loginFlow = new LoginFlow(loginPage);

  const user = users.emptyUser;

  await loginFlow.login(user.email, user.password);

  await expect(loginPage.form.getByText('Email is required')).toBeVisible();
  await expect(loginPage.form.getByText('Password is required')).toBeVisible();
});

  test('Invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const loginFlow = new LoginFlow(loginPage);

  const user = users.invalidUser;

  await loginFlow.login(user.email, user.password);

  await expect(loginPage.errorToast).toBeVisible();
});

test('Random invalid password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const loginFlow = new LoginFlow(loginPage);

  const user = UserFactory.generateInvalidUser();

  await loginFlow.login(user.email, user.password);

  await expect(loginPage.errorToast).toBeVisible();
});

test('Valid login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const loginFlow = new LoginFlow(loginPage);

  const user = users.validUser;

  await loginFlow.login(user.email, user.password);

  await expect(loginPage.errorToast).toBeVisible();
});

});

*/


//  Software Web Testing\Real Automation Testing\test-platform\tests\ui\smoke\login.spec.ts