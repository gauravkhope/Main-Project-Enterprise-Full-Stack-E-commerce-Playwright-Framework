import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '../tests/api',   // run tests from test-platform/tests/api

  fullyParallel: true,
  workers: 4, // run tests sequentially to avoid state conflicts  

  retries: 1,

  globalTeardown: '../core/auth/globalTeardown.ts',

  use: {
    baseURL: 'http://smartshop-api-xd4o.onrender.com', // API backend on port 5000
    headless: true,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
