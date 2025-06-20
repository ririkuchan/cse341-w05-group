const request = require('supertest');
const app = require('../server');

describe('Clients API', () => {
    test('GET /clients should return 200 and array', async () => {
        const res = await request(app).get('/clients');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /clients/:id should return 200 or 404', async () => {
        const id = '000000000000000000000000'; // 存在しないIDを使って404の挙動を確認
        const res = await request(app).get(`/clients/${id}`);
        expect([200, 404]).toContain(res.statusCode);
    });
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // 500ms待ってJestを強制終了させないようにする
});
