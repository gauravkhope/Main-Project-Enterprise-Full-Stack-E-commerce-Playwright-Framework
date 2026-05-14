/// <reference types="node" />

import { test as base } from './base.fixture';
import { performLogin } from '../auth/loginHelper';
import { authStoragePath, ensureAuthStorageDir, hasUsableAuthStorage } from '../auth/authStorage.ts';

// Extend baseTest (VERY IMPORTANT)
export const test = base.extend({

  context: async ({ browser }, use) => {
    ensureAuthStorageDir();

    if (!hasUsableAuthStorage()) {
      const setupContext = await browser.newContext();
      const page = await setupContext.newPage();

      await performLogin(page);
      await setupContext.storageState({ path: authStoragePath });
      await setupContext.close();
    }

    const context = await browser.newContext({ storageState: authStoragePath });

    await use(context);
    await context.close();
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  }

});

export { expect } from '@playwright/test';