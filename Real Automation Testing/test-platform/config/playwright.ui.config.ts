import { defineConfig } from '@playwright/test';
import { ENV } from './environment';

export default defineConfig({
  testDir: '../tests/ui',

  fullyParallel: false,

  workers: ENV.workers,

  retries: ENV.retries,

  reporter: [
    ['html'],
    ['list'],
  ],

  globalTeardown: '../core/auth/globalTeardown.ts',

  use: {
    baseURL: ENV.baseUrl,

    headless: ENV.headless,

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',
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