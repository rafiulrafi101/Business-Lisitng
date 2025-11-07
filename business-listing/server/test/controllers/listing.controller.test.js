const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Listing = require('../../src/models/Listing');

describe('Listing Controller', () => {
  let owner;

  beforeEach(async () => {
    await User.deleteMany({});
    await Listing.deleteMany({});
    owner = await User.create({
      name: 'Test Owner',
      email: 'owner@test.com',
      passwordHash: await User.hashPassword('password123'),
    });

    await Listing.create({
      owner: owner.id,
      name: 'Tech Fixers',
      category: 'Electronics',
      location: { city: 'Metro City', area: 'North' },
      shortDescription: 'Device repair experts.',
      description: 'Full service electronics repair for phones, laptops, and more.',
    });
  });

  it('retrieves listings via API', async () => {
    const response = await request(app).get('/api/listings').expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.listings).toHaveLength(1);
    expect(response.body.data.listings[0].name).toBe('Tech Fixers');
  });
});
