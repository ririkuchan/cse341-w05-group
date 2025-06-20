const request = require('supertest');
const app = require('../server');
const db = require('../data/database');

beforeAll(done => db.initDb(err => done(err)));

describe('Clients API', () => {
    test('GET /clients should return 200 and array', async () => {
        const res = await request(app).get('/clients');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /clients/:id should return 200 or 404', async () => {
        const id = '000000000000000000000000';
        const res = await request(app).get(`/clients/${id}`);
        expect([200, 404]).toContain(res.statusCode);
    });
});
