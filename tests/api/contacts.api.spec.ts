import { test, expect } from '@playwright/test';

const BASE = 'https://thinking-tester-contact-list.herokuapp.com';
let token: string;
let contactId: string;

test.describe('Healthcare API Tests 🔌', () => {

  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${BASE}/users/login`, {
      data: {
        email: process.env.USER_EMAIL || 'uzair.healthcare@gmail.com',
        password: process.env.USER_PASSWORD || 'Test@1234',
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    token = body.token;
    console.log('✅ API token received');
  });

  test('TC001: GET all contacts returns list', async ({ request }) => {
    const response = await request.get(`${BASE}/contacts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    console.log(`✅ Got ${body.length} contacts from API`);
  });

  test('TC002: POST create new contact via API', async ({ request }) => {
    const response = await request.post(`${BASE}/contacts`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        firstName: 'API',
        lastName: 'Patient',
        birthdate: '1990-01-01',
        email: `api.patient.${Date.now()}@test.com`,
        phone: '9001234567',
        street1: '123 API Street',
        city: 'Hyderabad',
        country: 'India',
        postalCode: '500001',
      }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body._id).toBeTruthy();
    contactId = body._id;
    console.log('✅ Contact created via API. ID:', contactId);
  });

  test('TC003: GET single contact by ID', async ({ request }) => {
    const response = await request.get(`${BASE}/contacts/${contactId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstName).toBe('API');
    console.log('✅ Single contact fetched:', body.firstName);
  });

  test('TC004: PATCH update contact via API', async ({ request }) => {
    const response = await request.patch(
      `${BASE}/contacts/${contactId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { firstName: 'Updated' }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstName).toBe('Updated');
    console.log('✅ Contact updated via API');
  });

  test('TC005: DELETE contact via API', async ({ request }) => {
    const response = await request.delete(
      `${BASE}/contacts/${contactId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).toBe(200);
    console.log('✅ Contact deleted via API');
  });

  test('TC006: GET deleted contact returns 404', async ({ request }) => {
    const response = await request.get(
      `${BASE}/contacts/${contactId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).toBe(404);
    console.log('✅ Deleted contact returns 404');
  });

  test('TC007: Unauthorized request returns 401', async ({ request }) => {
    const response = await request.get(`${BASE}/contacts`, {
      headers: { Authorization: 'Bearer invalidtoken' }
    });
    expect(response.status()).toBe(401);
    console.log('✅ Unauthorized returns 401');
  });

});