const request = require('supertest');
const app = require('../server');
const db = require('../data/database');

beforeAll(done => db.initDb(err => done(err)));

describe('Tasks API', () => {
    test('GET /tasks should return 200 and array', async () => {
        const res = await request(app).get('/tasks');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /tasks/:id should return 200 or 404', async () => {
        const id = '000000000000000000000000';
        const res = await request(app).get(`/tasks/${id}`);
        expect([200, 404]).toContain(res.statusCode);
    });
});
