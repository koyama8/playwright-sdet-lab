import { test as base } from 'playwright-bdd';
import { AuthenticationPage } from '../pages/authentication.page';
import { MoviesPage } from '../pages/movies.page';
import { PeoplePage } from '../pages/people.page';
import type { MovieTestData } from '../data/factories/movies.factory';

type ContextoFilmes = {
  filme?: MovieTestData;
};

type WebFixtures = {
  authenticationPage: AuthenticationPage;
  moviesPage: MoviesPage;
  peoplePage: PeoplePage;
  contextoFilmes: ContextoFilmes;
};

export const test = base.extend<WebFixtures>({
  authenticationPage: async ({ page }, use) => {
    await use(new AuthenticationPage(page));
  },
  moviesPage: async ({ page }, use) => {
    await use(new MoviesPage(page));
  },
  peoplePage: async ({ page }, use) => {
    await use(new PeoplePage(page));
  },
  contextoFilmes: async ({}, use) => {
    await use({});
  },
});
