const request2 = require('supertest');
const app2 = require('../src/app');

jest.mock('../src/modules/auth/auth.service');
const authService = require('../src/modules/auth/auth.service');

describe('POST /api/v1/auth/login', () => {
  it('should return token and user', async () => {
    authService.login.mockResolvedValue({ token: 'fake-token', user: { id: 1, email: 'test@t.com' } });
    const res = await request2(app2).post('/api/v1/auth/login').send({ email: 'test@t.com', password: 'x' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token', 'fake-token');
    expect(res.body).toHaveProperty('user');
  });
});