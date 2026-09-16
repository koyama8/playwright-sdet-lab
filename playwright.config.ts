import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const baseURL = process.env.WEB_BASE_URL ?? 'http://localhost:3100';
const requestedSlowMo = Number.parseInt(process.env.PW_SLOW_MO ?? '0', 10);
const slowMo = Number.isFinite(requestedSlowMo) ? requestedSlowMo : 0;
const bddTestDir = defineBddConfig({
  features: ['tests/web/features/**/*.feature', 'tests/api/features/**/*.feature'],
  steps: [
    'tests/web/steps/**/*.ts',
    'tests/web/fixtures/**/*.ts',
    'tests/api/steps/**/*.ts',
    'tests/api/fixtures/**/*.ts',
    'tests/shared/fixtures/**/*.ts',
  ],
  outputDir: '.features-gen',
  missingSteps: 'fail-on-run',
});

export default defineConfig({
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL,
    launchOptions: { slowMo },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'on' : 'retain-on-failure',
  },
  projects: [
    {
      name: 'bdd-chromium',
      testDir: bddTestDir,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'smoke-chromium',
      testDir: './tests/smoke',
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
