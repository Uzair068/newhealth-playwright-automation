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
  readonly addressInput: Locator;
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
    this.addressInput = page.locator('[id="street1"]');
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
  address?: string;
  city?: string;
  country?: string;
}) { await this.addContactButton.click();
  await this.page.waitForLoadState('domcontentloaded');

  await this.firstNameInput.fill(contact.firstName);
  await this.lastNameInput.fill(contact.lastName);
  if (contact.birthdate) await this.birthdateInput.fill(contact.birthdate);
  if (contact.email) await this.emailInput.fill(contact.email);
  if (contact.phone) await this.phoneInput.fill(contact.phone);
  if (contact.address) await this.addressInput.fill(contact.address);
  if (contact.city) await this.cityInput.fill(contact.city);
  if (contact.country) await this.countryInput.fill(contact.country);

  await this.submitButton.click();
  await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForTimeout(2000);
  }

  async getContactCount(): Promise<number> {
    return await this.contactListItems.count();
  }

  async clickContact(firstName: string) {
    await this.contactListItems
      .filter({ hasText: firstName })
      .click();
  }

  async logout() {
    await this.logoutButton.click();
    await expect(this.page).toHaveURL('/');
  }
}