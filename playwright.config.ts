import { defineConfig, devices } from '@playwright/test';

if (!process.env.CI) {
  require('dotenv').config();
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60000,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['allure-playwright'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 
      'https://thinking-tester-contact-list.herokuapp.com',
    headless: process.env.CI ? true : false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    navigationTimeout: 60000,
  },

  projects: [
  {
    name: 'setup',
    testMatch: /.*\.setup\.ts/,
  },
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/user.json',
    },
    dependencies: ['setup'],
  },
  {
    name: 'api',
    testMatch: /.*\.api\.spec\.ts/,
  },
],
});