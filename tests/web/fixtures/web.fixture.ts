import { test as base } from 'playwright-bdd';
import { AuthenticationPage } from '../pages/authentication.page';

type WebFixtures = {
  authenticationPage: AuthenticationPage;
};

export const test = base.extend<WebFixtures>({
  authenticationPage: async ({ page }, use) => {
    await use(new AuthenticationPage(page));
  },
});
