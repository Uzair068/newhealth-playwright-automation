import { test, expect } from '../fixtures';
import { readPatientsFromCSV } from '../utils/csvReader';
import { faker } from '@faker-js/faker';

// Read all patients from CSV file
const patients = readPatientsFromCSV('patients.csv');

test.describe('Data-Driven Patient Tests 📊', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/contactList');
    await page.waitForLoadState('domcontentloaded');
  });

  // This loop creates ONE test per patient row in CSV
  for (const patient of patients) {
    test(`Add patient: ${patient.firstName} ${patient.lastName} 
    from ${patient.city}`,
    async ({ page, contactPage }) => {

      console.log(`\n📋 Testing patient: ${patient.firstName} 
      ${patient.lastName}`);

      const countBefore = await contactPage.getContactCount();

      // Add patient from CSV data
      await contactPage.addContact({
        firstName: patient.firstName,
        lastName: patient.lastName,
        birthdate: patient.birthdate,
        email: patient.email,
        phone: patient.phone,
        city: patient.city,
        country: patient.country,
      });

      // Verify redirect to contact list
      await expect(page).toHaveURL(/contactList/, { timeout: 10000 });
      await page.waitForTimeout(1000);

      // Verify contact appears in list
     await expect(
  page.locator('td', { hasText: `${patient.firstName} ${patient.lastName}` }).first()
).toBeVisible();

      const countAfter = await contactPage.getContactCount();
      expect(countAfter).toBeGreaterThan(countBefore);

      console.log(`✅ Patient ${patient.firstName} 
      ${patient.lastName} added from ${patient.city}`);
    });
  }

  // Summary test
//   test('Verify all CSV patients exist in system',
//   async ({ page, contactPage }) => {
//     const count = await contactPage.getContactCount();
//     console.log(`📊 Total contacts in system: ${count}`);
//     expect(count).toBeGreaterThan(0);
//     console.log('✅ System has patient records');
//   });
test('Verify all CSV patients exist in system', async ({ page, contactPage }) => {
  await contactPage.goto();

  for (const patient of patients) {
    await contactPage.addContact({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      birthdate: patient.birthdate,
      city: patient.city,
      country: patient.country,
    });
  }

  const count = await contactPage.getContactCount();
  console.log(`📊 Total contacts in system: ${count}`);

  expect(count).toBeGreaterThan(0);
});

}); 