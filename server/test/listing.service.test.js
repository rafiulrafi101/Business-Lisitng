const mongoose = require('mongoose');
const listingService = require('../src/services/listing.service');
const Listing = require('../src/models/Listing');
const User = require('../src/models/User');
const ApiError = require('../src/utils/ApiError');

const baseListing = (overrides = {}) => ({
  name: 'Sample Listing',
  category: 'Haircut',
  location: { city: 'Metro City', area: 'Downtown' },
  shortDescription: 'Quality services for everyone',
  description: 'We provide exceptional services for all your needs.',
  phone: '555-1234',
  hours: 'Mon-Fri 9am-5pm',
  imageUrl: 'https://example.com/image.jpg',
  ...overrides,
});

describe('listing.service', () => {
  let owner;

  beforeEach(async () => {
    owner = await User.create({
      name: 'Owner',
      email: `owner-${Date.now()}@example.com`,
      passwordHash: 'hashed',
    });
  });

  test('getListings returns paginated results with sorting', async () => {
    await Listing.create([
      { owner: owner._id, ...baseListing({ name: 'Alpha' }) },
      { owner: owner._id, ...baseListing({ name: 'Charlie', category: 'Fashion' }) },
      { owner: owner._id, ...baseListing({ name: 'Bravo', category: 'Laundry' }) },
    ]);

    const result = await listingService.getListings({ sort: 'az', page: 1, limit: 2 });

    expect(result.results).toHaveLength(2);
    expect(result.results[0].name).toBe('Alpha');
    expect(result.pagination.total).toBe(3);
    expect(result.pagination.totalPages).toBe(2);
  });

  test('updateListing enforces owner permissions', async () => {
    const listing = await Listing.create({ owner: owner._id, ...baseListing() });
    const otherUser = {
      id: new mongoose.Types.ObjectId().toString(),
      role: 'user',
    };

    await expect(
      listingService.updateListing(listing._id.toString(), { name: 'Updated' }, otherUser),
    ).rejects.toBeInstanceOf(ApiError);

    const updated = await listingService.updateListing(
      listing._id.toString(),
      { name: 'Updated Name' },
      { id: owner._id.toString(), role: 'user' },
    );

    expect(updated.name).toBe('Updated Name');
  });
});
