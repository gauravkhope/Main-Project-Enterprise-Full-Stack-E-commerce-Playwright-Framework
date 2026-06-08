import { resetAuthStorage } from './authStorage.ts';

async function globalTeardown() {
  resetAuthStorage();
  console.log('Test execution completed');
  console.log('Reset login storage content after suite completion');
}

export default globalTeardown;
