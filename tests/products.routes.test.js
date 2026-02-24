const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/modules/products/products.service');
const service = require('../src/modules/products/products.service');

describe('GET /api/v1/products', () => {
  it('should return a list of products', async () => {
    service.list.mockResolvedValue([
      { id: 1, name: 'Sofa', price: 100 },
      { id: 2, name: 'Chair', price: 50 }
    ]);

    const res = await request(app).get('/api/v1/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('name', 'Sofa');
  });
});