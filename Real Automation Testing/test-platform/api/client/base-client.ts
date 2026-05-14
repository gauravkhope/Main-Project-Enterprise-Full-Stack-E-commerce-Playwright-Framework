import {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';

import { RequestManager }
from './request-manager';

export class BaseClient {
  protected request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  protected async get(
    endpoint: string,
    headers: Record<string, string> = {}
  ): Promise<APIResponse> {

    return RequestManager.get(
      this.request,
      endpoint,
      headers
    );
  }

  protected async post(
    endpoint: string,
    payload: unknown,
    headers: Record<string, string> = {}
  ): Promise<APIResponse> {

    return RequestManager.post(
      this.request,
      endpoint,
      payload,
      headers
    );
  }

  protected async put(
    endpoint: string,
    payload: unknown,
    headers: Record<string, string> = {}
  ): Promise<APIResponse> {

    return RequestManager.put(
      this.request,
      endpoint,
      payload,
      headers
    );
  }

  protected async delete(
    endpoint: string,
    headers: Record<string, string> = {}
  ): Promise<APIResponse> {

    return RequestManager.delete(
      this.request,
      endpoint,
      headers
    );
  }
}