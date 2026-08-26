import request from 'supertest'; import { app } from '../src/app.js';
test('health endpoint returns structured JSON', async () => { const response = await request(app).get('/health').expect(200); expect(response.body).toEqual({ success: true, data: { status: 'ok' } }); });
test('unknown endpoints return structured errors', async () => { const response = await request(app).get('/missing').expect(404); expect(response.body.success).toBe(false); });
