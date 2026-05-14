import {
  test,
  expect,
} from '../../../../core/fixtures/api.fixture';;

import { LoginBuilder }
from '../../../../data/builders/auth/login.builder';

import {
  LoginSchema,
  InvalidLoginSchema,
  MissingCredentialsSchema,
}
from '../../../../api/schemas/auth/login.schema';

import { SchemaValidator }
from '../../../../api/validators/schema-validator';

import { AuthValidator }
from '../../../../api/validators/business/auth.validator';

test.describe('AUTH LOGIN API', () => {

  test(
    'TC-AUTH-LOGIN-001 – Login with Valid Email and Password',
    async ({ authService }) => {

      const payload =
        new LoginBuilder().build();

      const response =
        await authService.login(
          payload
        );

      expect(
        response.status()
      ).toBe(200);

      const body =
        await response.json();

      SchemaValidator.validate(
        LoginSchema,
        body
      );

      AuthValidator.validateLogin(
        body
      );
    }
  );

  test(
    'TC-AUTH-LOGIN-002 – Login with Invalid Password',
    async ({ authService }) => {

      const payload =
        new LoginBuilder()
          .withPassword(
            'WrongPassword123'
          )
          .build();

      const response =
        await authService.login(
          payload
        );

      expect(
        response.status()
      ).toBe(401);

      const body =
        await response.json();

      SchemaValidator.validate(
        InvalidLoginSchema,
        body
      );

      AuthValidator
        .validateInvalidLogin(
          body
        );
    }
  );
  test(
  'TC-AUTH-LOGIN-003 – Login with Invalid Email',
  async ({ authService }) => {

    const payload =
      new LoginBuilder()
        .withEmail(
          'invalid@gmail.com'
        )
        .build();

    const response =
      await authService.login(
        payload
      );

    expect(
      response.status()
    ).toBe(401);

    const body =
      await response.json();

    SchemaValidator.validate(
      InvalidLoginSchema,
      body
    );

    AuthValidator
      .validateInvalidLogin(
        body
      );
  }
);

test(
  'TC-AUTH-LOGIN-004 – Login with Missing Email Field',
  async ({ authService }) => {

    const payload =
      new LoginBuilder()
        .withEmail('')
        .build();

    const response =
      await authService.login(
        payload
      );

    expect(
      response.status()
    ).toBe(400);

    const body =
      await response.json();

    SchemaValidator.validate(
      MissingCredentialsSchema,
      body
    );

    AuthValidator
      .validateMissingCredentials(
        body
      );
  }
);
test(
  'TC-AUTH-LOGIN-005 – Login with Missing Password Field',
  async ({ authService }) => {

    const payload =
      new LoginBuilder()
        .withPassword('')
        .build();

    const response =
      await authService.login(
        payload
      );

    expect(
      response.status()
    ).toBe(400);

    const body =
      await response.json();

    SchemaValidator.validate(
      MissingCredentialsSchema,
      body
    );

    AuthValidator
      .validateMissingCredentials(
        body
      );
  }
);
test(
  'TC-AUTH-LOGIN-006 – Login with Empty Payload',
  async ({ authService }) => {

    const response =
      await authService.login({
        email: '',
        password: '',
      });

    expect(
      response.status()
    ).toBe(400);

    const body =
      await response.json();

    SchemaValidator.validate(
      MissingCredentialsSchema,
      body
    );

    AuthValidator
      .validateMissingCredentials(
        body
      );
  }
);
test(
  'TC-AUTH-LOGIN-007 – Login with Multiple Invalid Attempts Leading to Account Block',
  async ({ authService }) => {

    const payload =
      new LoginBuilder()
        .withPassword(
          'WrongPassword123'
        )
        .build();

    // Attempt 1
    const response1 =
      await authService.login(
        payload
      );

    expect(
      response1.status()
    ).toBe(401);

    const body1 =
      await response1.json();

    expect(
      body1.remainingAttempts
    ).toBe(2);

    // Attempt 2
    const response2 =
      await authService.login(
        payload
      );

    expect(
      response2.status()
    ).toBe(401);

    const body2 =
      await response2.json();

    expect(
      body2.remainingAttempts
    ).toBe(1);

    // Attempt 3
    const response3 =
      await authService.login(
        payload
      );

    expect(
      response3.status()
    ).toBe(401);

    const body3 =
      await response3.json();

    expect(
      body3.remainingAttempts
    ).toBe(0);

    // Attempt 4 → Account Blocked
    const response4 =
      await authService.login(
        payload
      );

    expect(
      response4.status()
    ).toBe(429);

    const body4 =
      await response4.json();

    expect(body4.message)
      .toBe(
        'Too many failed attempts. Try again after 10 minutes.'
      );

    expect(
      body4.remainingAttempts
    ).toBe(0);
  }
);
});