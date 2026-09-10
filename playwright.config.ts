import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.WEB_BASE_URL ?? 'http://localhost:3100';
const requestedSlowMo = Number.parseInt(process.env.PW_SLOW_MO ?? '0', 10);
const slowMo = Number.isFinite(requestedSlowMo) ? requestedSlowMo : 0;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL,
    launchOptions: { slowMo },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run web:dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
