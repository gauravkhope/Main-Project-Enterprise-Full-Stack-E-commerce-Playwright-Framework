import { APIRequestContext } from '@playwright/test';
import { Logger } from '../../../core/utils/logger';
import { BaseClient } from '../../client/base-client';
import { AUTH_ENDPOINTS }
from '../../endpoints/auth.endpoints';

export class AuthService extends BaseClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

 async login(payload: {
  email: string;
  password: string;
}) {

  Logger.request(
    'POST',
    '/api/auth/login',
    payload
  );

  const response = await this.post(
    AUTH_ENDPOINTS.LOGIN ,
    payload
  );

  await Logger.response(response);

  return response;
}

  async register(payload: {
    name: string;
    email: string;
    password: string;
  }) {
    return this.post(
      '/api/auth/register',
      payload
    );
  }

  async forgotPassword(
  payload: {
    email: string;
  }
) {

  Logger.request(
    'POST',
    AUTH_ENDPOINTS.FORGOT_PASSWORD,
    payload
  );

  const response =
    await this.post(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      payload
    );

  await Logger.response(
    response
  );

  return response;
}

}