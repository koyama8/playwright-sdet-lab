import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { test as base } from 'playwright-bdd';
import { ApiClient } from '../clients/api.client';
import { AuthenticationClient } from '../clients/authentication.client';
import { type CredenciaisAutenticacao } from '../data/payloads/authentication.payload';

type ContextoAutenticacao = {
  credenciais?: CredenciaisAutenticacao;
  resposta?: APIResponse;
  corpoResposta?: unknown;
};

type ApiFixtures = {
  apiRequest: APIRequestContext;
  apiClient: ApiClient;
  authenticationClient: AuthenticationClient;
  contextoAutenticacao: ContextoAutenticacao;
};

export const test = base.extend<ApiFixtures>({
  apiRequest: async ({ playwright }, use) => {
    const request = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL ?? 'http://localhost:3030/api',
    });

    await use(request);
    await request.dispose();
  },

  apiClient: async ({ apiRequest, page }, use) => {
    await use(new ApiClient(apiRequest, page));
  },

  authenticationClient: async ({ apiClient }, use) => {
    await use(new AuthenticationClient(apiClient));
  },

  contextoAutenticacao: async ({}, use) => {
    await use({});
  },
});
