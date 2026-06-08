import { defineConfig } from '@playwright/test';
import { ENV } from './environment';

export default defineConfig({
  testDir: '../tests/api',

  fullyParallel: true,

  workers: ENV.workers,

  retries: ENV.retries,

  reporter: [
    ['html'],
    ['list'],
  ],

  globalTeardown: '../core/auth/globalTeardown.ts',

  use: {
    baseURL: ENV.apiUrl,

    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'api',
    },
  ],
});