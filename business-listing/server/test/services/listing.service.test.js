const User = require('../../src/models/User');
const Listing = require('../../src/models/Listing');
const { createListing, getListings } = require('../../src/services/listing.service');

describe('Listing Service', () => {
  let owner;

  beforeEach(async () => {
    await User.deleteMany({});
    await Listing.deleteMany({});
    owner = await User.create({
      name: 'Owner',
      email: 'owner@example.com',
      passwordHash: await User.hashPassword('password123'),
    });
  });

  it('creates a listing for the owner', async () => {
    const listing = await createListing(owner.id, {
      name: 'Fresh Fade Barbers',
      category: 'Haircut',
      location: { city: 'Metro City', area: 'Central' },
      shortDescription: 'Modern cuts with classic service.',
      description: 'Offering fades, trims, and shaves with experienced barbers.',
      phone: '123-456-7890',
      hours: 'Mon-Fri 9am-5pm',
    });

    expect(listing.name).toBe('Fresh Fade Barbers');
    expect(listing.owner.toString()).toBe(owner.id.toString());
  });

  it('returns listings with pagination and filtering', async () => {
    await Promise.all(
      ['Fresh Fade Barbers', 'Central Laundry'].map((name, index) =>
        createListing(owner.id, {
          name,
          category: index === 0 ? 'Haircut' : 'Laundry',
          location: { city: 'Metro City', area: index === 0 ? 'Central' : 'West' },
          shortDescription: `${name} short description`,
          description: `${name} full description for customers.`,
        }),
      ),
    );

    const result = await getListings({
      category: 'Haircut',
      page: 1,
      limit: 10,
    });

    expect(result.pagination.total).toBe(1);
    expect(result.listings).toHaveLength(1);
    expect(result.listings[0].name).toBe('Fresh Fade Barbers');
  });
});
