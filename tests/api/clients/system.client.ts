import { APIResponse } from '@playwright/test';

import { ApiClient } from './api.client';

export class SystemClient {
  constructor(readonly apiClient: ApiClient) {}

  async restaurarMassa(tokenAcesso: string): Promise<APIResponse> {
    return this.apiClient.fetch('/api/test-support/reset', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenAcesso}`,
      },
    });
  }
}
