import { expect } from '@playwright/test';

export class UserValidator {
  static validateProfile(
    body: any
  ) {

    expect(body.user).toBeDefined();

    expect(body.user.id).toBeGreaterThan(0);

    expect(body.user.email)
      .toContain('@');

    expect(body.user.role)
      .toBe('CUSTOMER');
  }
}