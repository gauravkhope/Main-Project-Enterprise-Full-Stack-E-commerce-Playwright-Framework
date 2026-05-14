/// <reference types="node" />

import * as fs from 'fs';
import * as path from 'path';

export const authStoragePath = path.resolve(
  process.cwd(),
  'test-platform',
  'core',
  'auth',
  'storage',
  'checkout-auth.json'
);

export function ensureAuthStorageDir(): void {
  fs.mkdirSync(path.dirname(authStoragePath), { recursive: true });
}

export function hasUsableAuthStorage(): boolean {
  if (!fs.existsSync(authStoragePath)) {
    return false;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(authStoragePath, 'utf-8'));
    return Array.isArray(parsed.cookies) && Array.isArray(parsed.origins);
  } catch {
    return false;
  }
}

export function resetAuthStorage(): void {
  ensureAuthStorageDir();
  fs.writeFileSync(authStoragePath, JSON.stringify({}, null, 2));
}