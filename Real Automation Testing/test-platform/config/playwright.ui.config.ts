import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '../tests/ui',   // run tests from test-platform/tests/ui

  fullyParallel: true,
  workers: 1, // run tests sequentially to avoid state conflicts  

  retries: 1,

  globalTeardown: '../core/auth/globalTeardown.ts',

  use: {
    baseURL: 'https://smartshop-one.vercel.app/', // change if needed
    headless: false,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});