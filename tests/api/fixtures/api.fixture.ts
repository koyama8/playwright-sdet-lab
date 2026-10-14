import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { test as base } from 'playwright-bdd';
import { ApiClient } from '../clients/api.client';
import { AuthenticationClient } from '../clients/authentication/authentication.client';
import { MoviesClient } from '../clients/movies/movies.client';
import { PeopleClient } from '../clients/people/people.client';
import { SystemClient } from '../clients/system/system.client';
import { type CredenciaisAutenticacao } from '../data/payloads/authentication/authentication.payload';
import { type MovieApiTestData, type MovieUpdateApiTestData } from '../data/factories/movies/movies.factory';
import { type PersonApiTestData } from '../data/factories/people/people.factory';

type ContextoAutenticacao = {
  credenciais?: CredenciaisAutenticacao;
  tokenAcesso?: string;
  resposta?: APIResponse;
  corpoResposta?: unknown;
};

type ContextoMovies = {
  filme?: MovieApiTestData;
  dadosAtualizacao?: MovieUpdateApiTestData;
  filmeId?: string;
  resposta?: APIResponse;
  corpoResposta?: unknown;
};

type ContextoSystem = {
  resposta?: APIResponse;
  corpoResposta?: unknown;
};

type ContextoPeople = {
  pessoa?: PersonApiTestData;
  resposta?: APIResponse;
  corpoResposta?: unknown;
};

type ApiFixtures = {
  apiRequest: APIRequestContext;
  apiClient: ApiClient;
  authenticationClient: AuthenticationClient;
  moviesClient: MoviesClient;
  peopleClient: PeopleClient;
  systemClient: SystemClient;
  contextoAutenticacao: ContextoAutenticacao;
  contextoMovies: ContextoMovies;
  contextoPeople: ContextoPeople;
  contextoSystem: ContextoSystem;
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

  moviesClient: async ({ apiClient }, use) => {
    await use(new MoviesClient(apiClient));
  },

  peopleClient: async ({ apiClient }, use) => {
    await use(new PeopleClient(apiClient));
  },

  systemClient: async ({ apiClient }, use) => {
    await use(new SystemClient(apiClient));
  },

  contextoAutenticacao: async ({}, use) => {
    await use({});
  },

  contextoMovies: async ({}, use) => {
    await use({});
  },

  contextoPeople: async ({}, use) => {
    await use({});
  },

  contextoSystem: async ({}, use) => {
    await use({});
  },
});
