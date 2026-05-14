import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  BASE_URL: process.env.BASE_URL || 'http://localhost:5000',

  EMAIL: process.env.EMAIL || '',

  PASSWORD: process.env.PASSWORD || '',
};