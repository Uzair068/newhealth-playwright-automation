// auth setup file login once and save session

import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate as healthcare user', async ({ page }) => {
  // Ensure directory exists
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // await page.goto('/');
  await page.goto('/', {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});
  await page.getByPlaceholder('Email').fill(process.env.USER_EMAIL!);
  await page.getByPlaceholder('Password').fill(process.env.USER_PASSWORD!);
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page).toHaveURL(/contactList/);
  await page.context().storageState({ path: authFile });
  console.log('✅ Auth session saved');
});