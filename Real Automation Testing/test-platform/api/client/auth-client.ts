import {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';

import { BaseClient } from './base-client';

import { TokenManager } from '../../core/utils/token-manager';

export class AuthClient extends BaseClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  protected async authorizedGet(
    endpoint: string
  ): Promise<APIResponse> {
    const token =
      await TokenManager.getToken(
        this.request
      );

    return this.request.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  protected async authorizedPost(
    endpoint: string,
    payload: unknown
  ): Promise<APIResponse> {
    const token =
      await TokenManager.getToken(
        this.request
      );

    return this.request.post(endpoint, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  protected async authorizedPut(
    endpoint: string,
    payload: unknown
  ): Promise<APIResponse> {
    const token =
      await TokenManager.getToken(
        this.request
      );

    return this.request.put(endpoint, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  protected async authorizedDelete(
    endpoint: string
  ): Promise<APIResponse> {
    const token =
      await TokenManager.getToken(
        this.request
      );

    return this.request.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}