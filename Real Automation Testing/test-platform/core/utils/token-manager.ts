import { APIRequestContext } from '@playwright/test';

import { ENV } from './env';

export class TokenManager {
  private static token: string;

  static async getToken(
    request: APIRequestContext
  ): Promise<string> {
    if (this.token) {
      return this.token;
    }

    const response = await request.post(
      `${ENV.BASE_URL}/api/auth/login`,
      {
        data: {
          email: ENV.EMAIL,
          password: ENV.PASSWORD,
        },
      }
    );

    if (!response.ok()) {
      throw new Error(
        `Login failed: ${response.status()}`
      );
    }

    const body = await response.json();

    this.token = body.token;

    return this.token;
  }

  static clearToken(): void {
    this.token = '';
  }
}