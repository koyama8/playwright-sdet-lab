import { test as base } from 'playwright-bdd';
import { AuthenticationPage } from '../pages/authentication.page';
import { MoviesPage } from '../pages/movies.page';
import type { MovieTestData } from '../data/factories/movies.factory';

type ContextoFilmes = {
  filme?: MovieTestData;
};

type WebFixtures = {
  authenticationPage: AuthenticationPage;
  moviesPage: MoviesPage;
  contextoFilmes: ContextoFilmes;
};

export const test = base.extend<WebFixtures>({
  authenticationPage: async ({ page }, use) => {
    await use(new AuthenticationPage(page));
  },
  moviesPage: async ({ page }, use) => {
    await use(new MoviesPage(page));
  },
  contextoFilmes: async ({}, use) => {
    await use({});
  },
});
