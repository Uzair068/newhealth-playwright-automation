import { Page, Locator, expect } from '@playwright/test';

export class ContactPage {
  readonly page: Page;
  readonly addContactButton: Locator;
  readonly contactListItems: Locator;
  readonly logoutButton: Locator;

  // Add contact form
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly birthdateInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;

  readonly street1Input: Locator;
  readonly stateProvinceInput: Locator;
  readonly postalCodeInput: Locator;

  readonly cityInput: Locator;
  readonly countryInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addContactButton = page.getByRole('button', { name: 'Add a New Contact' });
    this.contactListItems = page.locator('tr.contactTableBodyRow');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });

    // Form fields
    this.firstNameInput = page.locator('[id="firstName"]');
    this.lastNameInput = page.locator('[id="lastName"]');
    this.birthdateInput = page.locator('[id="birthdate"]');
    this.emailInput = page.locator('[id="email"]');
    this.phoneInput = page.locator('[id="phone"]');

    this.street1Input = page.locator('[id="street1"]');
    this.stateProvinceInput = page.locator('[id="stateProvince"]');
    this.postalCodeInput = page.locator('[id="postalCode"]');

    this.cityInput = page.locator('[id="city"]');
    this.countryInput = page.locator('[id="country"]');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async goto() {
    await this.page.goto('/contactList');
  }

  async addContact(contact: {
    firstName: string;
    lastName: string;
    birthdate?: string;
    email?: string;
    phone?: string;
    street1?: string;
    stateProvince?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  }) {
    console.log('Contact passed to addContact:', contact);

    // 🔧 Clean up duplicates before adding
    if (contact.email) {
      await this.deleteDuplicateContacts(contact.email);
    }

    await this.addContactButton.click();
    await this.page.waitForURL(/addContact/);

    await this.firstNameInput.fill(contact.firstName);
    await this.lastNameInput.fill(contact.lastName);
    if (contact.birthdate) await this.birthdateInput.fill(contact.birthdate);
    if (contact.email) await this.emailInput.fill(contact.email);
    if (contact.phone) await this.phoneInput.fill(contact.phone);

    if (contact.street1) await this.street1Input.fill(contact.street1);
    if (contact.stateProvince) await this.stateProvinceInput.fill(contact.stateProvince);
    if (contact.postalCode) await this.postalCodeInput.fill(contact.postalCode);

    if (contact.city) await this.cityInput.fill(contact.city);
    if (contact.country) await this.countryInput.fill(contact.country);

    await this.submitButton.click();

    // ✅ Verify by unique email
    await expect(
      this.page.locator('tr.contactTableBodyRow').filter({ hasText: contact.email })
    ).toBeVisible({ timeout: 10000 });
  }

  async getContactCount(): Promise<number> {
    return await this.contactListItems.count();
  }

  async clickContact(firstName: string) {
    await this.contactListItems.filter({ hasText: firstName }).click();
  }

  async logout() {
    await this.logoutButton.click();
    await expect(this.page).toHaveURL('/');
  }

  // 🔧 NEW: helper to delete duplicates by email
  async deleteDuplicateContacts(email: string) {
    const rows = this.contactListItems.filter({ hasText: email });
    const count = await rows.count();

    for (let i = 1; i < count; i++) {
      await rows.nth(i).click(); // open duplicate
      await this.page.getByRole('button', { name: 'Delete Contact' }).click();
      await this.page.getByRole('button', { name: 'Confirm' }).click();
      await this.page.waitForURL(/contactList/);
    }
  }
}
