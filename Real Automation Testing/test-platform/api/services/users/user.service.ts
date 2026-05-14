import { APIRequestContext } from '@playwright/test';

import { AuthClient } from '../../client/auth-client';

import { Logger } from '../../../core/utils/logger';
import { USER_ENDPOINTS }
from '../../endpoints/user.endpoints';

export class UserService extends AuthClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async getProfile() {
    Logger.request(
      'GET',
      USER_ENDPOINTS.PROFILE
    );

    const response =
      await this.authorizedGet(
        '/api/user/profile'
      );

    await Logger.response(response);

    return response;
  }
}