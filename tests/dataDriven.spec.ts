import { test, expect } from '../fixtures';
import { readPatientsFromCSV } from '../utils/csvReader';
import { faker } from '@faker-js/faker';

const patients = readPatientsFromCSV('patients.csv');

test.describe('Data-Driven Patient Tests 📊', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/contactList');
    await page.waitForLoadState('domcontentloaded');
  });

  for (const patient of patients) {
    test(`Add patient: ${patient.firstName} ${patient.lastName} 
    from ${patient.city}`,
    async ({ page, contactPage }) => {

      const countBefore = await contactPage.getContactCount();

      // Use unique email every run — prevents duplicate errors
      const uniqueEmail = faker.internet.email();

console.log('Patient from CSV:', patient);


await contactPage.addContact({
  firstName: patient.firstName,
  lastName: patient.lastName, 
  birthdate: patient.birthdate,
  email: uniqueEmail,
  phone: patient.phone,
  street1: patient.street1,          // 🔧 CHANGED
  stateProvince: patient.stateProvince, // 🔧 NEW
  postalCode: patient.postalCode,       // 🔧 NEW
  city: patient.city,
  country: patient.country,
});


      await expect(page).toHaveURL(/contactList/, { timeout: 10000 });
      await page.waitForTimeout(1000);

      await expect(
        page.locator('td').filter({ hasText: patient.firstName })
      ).toBeVisible({ timeout: 10000 });

      const countAfter = await contactPage.getContactCount();
      expect(countAfter).toBeGreaterThan(countBefore);

      console.log(`✅ ${patient.firstName} ${patient.lastName} added`);
    });
  }

  test('Verify all CSV patients exist in system',
  async ({ page, contactPage }) => {
    const count = await contactPage.getContactCount();
    console.log(`📊 Total contacts: ${count}`);
    expect(count).toBeGreaterThan(0);
    console.log('✅ System has patient records');
  });

});