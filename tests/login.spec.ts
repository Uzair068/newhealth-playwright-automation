import { test, expect } from '../fixtures';
import { faker } from '@faker-js/faker';

test.describe('Login Tests — Healthcare App 🏥', () => {

  test('TC001: valid login redirects to contact list', 
  async ({ page, loginPage }) => {
    // go to login page
    await loginPage.goto();

    // login with valid credentials
    await loginPage.login(
      process.env.USER_EMAIL!,
      process.env.USER_PASSWORD!
    );

    // confirm redirected to contact list
    await loginPage.expectLoginSuccess();
    console.log('✅ Valid login successful');
  });

  test('TC002: invalid password shows error', 
  async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(
      process.env.USER_EMAIL!,
      'wrongpassword123'
    );
    await loginPage.expectLoginError();
    console.log('✅ Invalid login rejected');
  });

  test('TC003: empty fields shows error',
  async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', '');
    await loginPage.expectLoginError();
    console.log('✅ Empty fields rejected');
  });

  test('TC004: unregistered email shows error',
  async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(
      faker.internet.email(),
      'Test@1234'
    );
    await loginPage.expectLoginError();
    console.log('✅ Unregistered email rejected');
  });

});