import { test as setup } from '@playwright/test';
import { performLogin } from './loginHelper';
import { authStoragePath, ensureAuthStorageDir } from './authStorage.ts';

setup('login and save state for checkout suite', async ({ page }) => {
  ensureAuthStorageDir();
  await performLogin(page);
  await page.context().storageState({
    path: authStoragePath
  });
});