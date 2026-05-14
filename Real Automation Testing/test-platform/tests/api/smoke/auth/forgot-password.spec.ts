import {
  test,
  expect,
} from '../../../../core/fixtures/api.fixture';

import { ENV }
from '../../../../core/utils/env';

import {
    ForgotPasswordInvalidEmailSchema,
  ForgotPasswordMissingEmailSchema,
  ForgotPasswordSchema,
} from '../../../../api/schemas/auth/forgot-password.schema';

import { SchemaValidator }
from '../../../../api/validators/schema-validator';

import { AuthValidator }
from '../../../../api/validators/business/auth.validator';

test.describe(
  'FORGOT PASSWORD API',
  () => {

    test(
      'TC-AUTH-FORGOT-001 – Request Password Reset with Valid Email',
      async ({ authService }) => {

        const response =
          await authService
            .forgotPassword({
              email:
                ENV.EMAIL,
            });

        expect(
          response.status()
        ).toBe(200);

        const body =
          await response.json();

        SchemaValidator.validate(
          ForgotPasswordSchema,
          body
        );

        AuthValidator
          .validateForgotPassword(
            body
          );
      }
    );

    test(
  'TC-AUTH-FORGOT-002 – Request Password Reset with Invalid Email Format',
  async ({ authService }) => {

    const response =
      await authService
        .forgotPassword({
          email:
            'invalid@gmail.com',
        });

    expect(
      response.status()
    ).toBe(404);

    const body =
      await response.json();

    SchemaValidator.validate(
      ForgotPasswordInvalidEmailSchema,
      body
    );

    AuthValidator
      .validateForgotPasswordInvalidEmail(
        body
      );
  }
);
test(
  'TC-AUTH-FORGOT-003 – Request Password Reset with Missing Email Field',
  async ({ authService }) => {

    const response =
      await authService
        .forgotPassword({
          email: '',
        });

    expect(
      response.status()
    ).toBe(400);

    const body =
      await response.json();

    SchemaValidator.validate(
      ForgotPasswordMissingEmailSchema,
      body
    );

    AuthValidator
      .validateForgotPasswordMissingEmail(
        body
      );
  }
);
  }
);