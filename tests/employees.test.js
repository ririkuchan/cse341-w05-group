const request = require('supertest');
const app = require('../server');
const { initDbPromise } = require('../data/database');

beforeAll(() => initDbPromise());

describe('Employees API', () => {
    test('GET /employees should return 200 and array', async () => {
        const res = await request(app).get('/employees');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /employees/:id should return 200 or 404', async () => {
        const id = '000000000000000000000000';
        const res = await request(app).get(`/employees/${id}`);
        expect([200, 404]).toContain(res.statusCode);
    });
});
