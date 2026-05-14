import { expect } from '@playwright/test';

export class AuthValidator {
  static validateLogin(
    body: any
  ) {

    expect(body.message)
      .toBe('Login successful');

    expect(body.token)
      .toBeTruthy();

    expect(body.user.email)
      .toContain('@');

    expect(body.user.role)
      .toBe('CUSTOMER');
  }

  static validateInvalidLogin(
    body: any
  ) {
    expect(body.message)
      .toBe(
        'Invalid email or password'
      );

    expect(
      body.remainingAttempts
    ).toBeGreaterThanOrEqual(0);
  }

  static validateMissingCredentials(
  body: any
) {

  expect(body.message)
    .toBe(
      'Email and password are required'
    );
}

static validateForgotPassword(
  body: any
) {

  expect(body.message)
    .toBe(
      'If an account exists, you will receive a code.'
    );
}

static validateForgotPasswordInvalidEmail(
  body: any
) {

  expect(body.message)
    .toBe(
      'This EMail not Registered . Please Register First...'
    );
}
static validateForgotPasswordMissingEmail(
  body: any
) {

  expect(body.message)
    .toBe(
      'Email is required'
    );
}
}

