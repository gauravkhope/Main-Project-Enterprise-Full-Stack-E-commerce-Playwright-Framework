import { defineConfig } from '@playwright/test';
import { ENV } from './environment';

export default defineConfig({
  testDir: '../tests/ui',

  fullyParallel: false,

  workers: ENV.workers,

  retries: ENV.retries,

  outputDir: '../artifacts/test-results',

  reporter: [
    [
      'html',
      {
        outputFolder: '../artifacts/html-report',
        open: 'never',
      },
    ],
    ['list'],
  ],

  globalTeardown: '../core/auth/globalTeardown.ts',

  use: {
    baseURL: ENV.baseUrl,

    headless: ENV.headless,

    trace: 'on',

    screenshot: 'only-on-failure',

    video: 'on',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});