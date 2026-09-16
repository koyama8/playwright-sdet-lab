import {
  type APIRequestContext,
  type APIResponse,
  type Page,
} from '@playwright/test';
import { pwApi } from 'pw-api-plugin';

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly page: Page,
  ) {}

  async fetch(
    url: string,
    options?: Parameters<APIRequestContext['fetch']>[1],
  ): Promise<APIResponse> {
    return pwApi.fetch(
      { request: this.request, page: this.page },
      url,
      options,
    );
  }
}
