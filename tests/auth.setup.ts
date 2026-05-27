import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate as healthcare user', async ({ page }) => {
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Fallback to hardcoded for CI if secrets not loaded
  const email = process.env.USER_EMAIL || 
    'uzair.healthcare@gmail.com';
  const password = process.env.USER_PASSWORD || 
    'Test@1234';

  console.log('Logging in with:', email);

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page).toHaveURL(/contactList/, { timeout: 15000 });
  await page.context().storageState({ path: authFile });
  console.log('✅ Auth session saved');
});