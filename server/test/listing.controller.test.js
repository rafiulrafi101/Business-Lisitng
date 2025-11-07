const request = require('supertest');
const app = require('../src/app');
const Listing = require('../src/models/Listing');
const User = require('../src/models/User');

describe('GET /api/listings', () => {
  test('returns listings with pagination', async () => {
    const owner = await User.create({
      name: 'Carol',
      email: 'carol@example.com',
      passwordHash: 'hashed',
    });

    await Listing.create({
      owner: owner._id,
      name: 'Test Listing',
      category: 'Haircut',
      location: { city: 'Metro', area: 'Center' },
      shortDescription: 'Great services nearby.',
      description: 'Full description of the great services provided.',
      phone: '555-7890',
      hours: 'Daily 10am-8pm',
      imageUrl: 'https://example.com/photo.jpg',
    });

    const response = await request(app).get('/api/listings').expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.results.length).toBeGreaterThan(0);
    expect(response.body.data.pagination.total).toBeGreaterThan(0);
  });
});
