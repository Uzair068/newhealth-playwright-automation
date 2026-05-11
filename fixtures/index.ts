import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ContactPage } from '../pages/ContactPage';

type HealthcareFixtures = {
  loginPage: LoginPage;
  contactPage: ContactPage;
};

export const test = base.extend<HealthcareFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
});

export { expect } from '@playwright/test';