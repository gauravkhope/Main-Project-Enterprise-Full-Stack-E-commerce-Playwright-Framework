import { test } from '../../../core/fixtures/base.fixture';
import users from '../../../data/static/users.json';
import { LoginAssertions } from '../../../validation/ui/auth/loginAssertions';

 test('Valid login', async ({ loginFlow, loginPage }) => {
    const user = users.validUser;

    await loginFlow.login(user.email, user.password);

    await LoginAssertions.expectLoginSuccess(loginPage);
  });