import {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';

export class RequestManager {
  static async get(
    request: APIRequestContext,
    endpoint: string,
    headers: Record<string, string> = {}
  ): Promise<APIResponse> {
    return request.get(endpoint, {
      headers,

      timeout: 30000,
    });
  }

  static async post(
    request: APIRequestContext,
    endpoint: string,
    payload: unknown,
    headers: Record<string, string> = {}
  ): Promise<APIResponse> {
    return request.post(endpoint, {
      data: payload,

      headers,

      timeout: 30000,
    });
  }

  static async put(
    request: APIRequestContext,
    endpoint: string,
    payload: unknown,
    headers: Record<string, string> = {}
  ): Promise<APIResponse> {
    return request.put(endpoint, {
      data: payload,

      headers,

      timeout: 30000,
    });
  }

  static async delete(
    request: APIRequestContext,
    endpoint: string,
    headers: Record<string, string> = {}
  ): Promise<APIResponse> {
    return request.delete(endpoint, {
      headers,

      timeout: 30000,
    });
  }
}