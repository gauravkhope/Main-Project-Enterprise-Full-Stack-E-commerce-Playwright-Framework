import { resetAuthStorage } from './authStorage.ts';

async function globalTeardown() {
  resetAuthStorage();
  console.log('Reset login storage content after suite completion');
}

export default globalTeardown;
