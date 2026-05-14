import {
  test,
  expect,
} from '../../../../core/fixtures/api.fixture';
import { UserValidator }
from '../../../../api/validators/business/user.validator';

import {
  UserProfileSchema,
} from '../../../../api/schemas/users/user.schema';

import { SchemaValidator }
from '../../../../api/validators/schema-validator';

test.describe(
  'USER PROFILE API',
  () => {
    test(
      'should fetch user profile successfully',
      async ({ userService }) => {

        const response =
          await userService.getProfile();

        expect(
          response.status()
        ).toBe(200);

        const body =
          await response.json();

        SchemaValidator.validate(
          UserProfileSchema,
          body
        );
        UserValidator.validateProfile(body);
      }
    );
  }
);