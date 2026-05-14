import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test-RAW',

  fullyParallel: false,
  workers: 1,

  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    // headless: true,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

