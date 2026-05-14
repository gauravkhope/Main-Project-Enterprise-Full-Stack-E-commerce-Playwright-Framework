import { test as base } from '@playwright/test';

import { AuthService } from '../../api/services/auth/auth.service';

import { UserService } from '../../api/services/users/user.service';

type ApiFixtures = {
  authService: AuthService;

  userService: UserService;
};

export const test = base.extend<ApiFixtures>({
  authService: async (
    { request },
    use
  ) => {
    await use(
      new AuthService(request)
    );
  },

  userService: async (
    { request },
    use
  ) => {
    await use(
      new UserService(request)
    );
  },
});

export { expect } from '@playwright/test';