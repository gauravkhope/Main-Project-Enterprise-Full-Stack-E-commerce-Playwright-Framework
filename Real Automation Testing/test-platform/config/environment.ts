import dotenv from 'dotenv';

const environment = process.env.TEST_ENV || 'local';

dotenv.config({
  path: `config/env/${environment}.env`,
});

export const ENV = {
  environment: process.env.ENV || 'local',

  baseUrl: process.env.BASE_URL || '',

  apiUrl: process.env.API_URL || '',

  username: process.env.USERNAME || '',

  password: process.env.PASSWORD || '',

  headless: process.env.HEADLESS === 'true',

  workers: Number(process.env.WORKERS || 1),

  retries: Number(process.env.RETRIES || 1),
};