/* eslint-disable no-console */
const env = require('../src/config/env');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Listing = require('../src/models/Listing');
const Category = require('../src/models/Category');
const Location = require('../src/models/Location');
const Bookmark = require('../src/models/Bookmark');

const categories = [
  { key: 'Haircut', label: 'Haircut' },
  { key: 'Laundry', label: 'Laundry' },
  { key: 'Electronics', label: 'Electronics' },
  { key: 'Fashion', label: 'Fashion' },
  { key: 'Market', label: 'Market' },
];

const locations = [
  { city: 'Metro City', area: 'Downtown' },
  { city: 'Metro City', area: 'Riverside' },
  { city: 'Metro City', area: 'North End' },
  { city: 'Harbor Town', area: 'Old Port' },
  { city: 'Harbor Town', area: 'Lighthouse District' },
  { city: 'Greenfield', area: 'Uptown' },
  { city: 'Greenfield', area: 'Garden Quarter' },
];

const sampleListings = [
  {
    name: 'Downtown Cuts',
    category: 'Haircut',
    shortDescription: 'Experienced stylists for modern and classic cuts.',
    description:
      'Downtown Cuts offers a full range of barber and stylist services including fades, trims, coloring, and beard care. Walk-ins welcome and appointments available daily.',
    phone: '555-111-2040',
    hours: 'Mon-Sat 9am-7pm',
    imageUrl: 'https://placehold.co/600x400?text=Haircut',
  },
  {
    name: 'Sparkle Laundry',
    category: 'Laundry',
    shortDescription: '24-hour self-service laundromat with folding service.',
    description:
      'Sparkle Laundry keeps your clothes fresh and clean with eco-friendly washers and dryers. Drop-off wash and fold and same-day service available.',
    phone: '555-776-2041',
    hours: 'Open 24/7',
    imageUrl: 'https://placehold.co/600x400?text=Laundry',
  },
  {
    name: 'Tech Haven Repairs',
    category: 'Electronics',
    shortDescription: 'Fast fixes for phones, laptops, and consoles.',
    description:
      'Certified technicians ready to diagnose and repair cracked screens, battery issues, and hardware failures for all major brands. Free diagnostics.',
    phone: '555-445-2211',
    hours: 'Mon-Fri 10am-6pm',
    imageUrl: 'https://placehold.co/600x400?text=Electronics',
  },
  {
    name: 'Harbor Threads Boutique',
    category: 'Fashion',
    shortDescription: 'Hand-picked coastal styles and accessories.',
    description:
      'Harbor Threads sources limited-run apparel, jewelry, and accessories from local designers. Visit for seasonal collections and styling appointments.',
    phone: '555-203-7788',
    hours: 'Tue-Sun 11am-7pm',
    imageUrl: 'https://placehold.co/600x400?text=Fashion',
  },
  {
    name: 'Garden Fresh Market',
    category: 'Market',
    shortDescription: 'Organic produce and specialty grocery goods.',
    description:
      'Garden Fresh Market partners with nearby farms to offer organic produce, artisanal cheeses, and freshly baked breads. Weekly tasting events on Saturdays.',
    phone: '555-901-4455',
    hours: 'Daily 8am-8pm',
    imageUrl: 'https://placehold.co/600x400?text=Market',
  },
];

const generateListing = (base, override = {}) => ({
  ...base,
  ...override,
});

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB:', env.mongoUri);

    await Promise.all([
      User.deleteMany({}),
      Listing.deleteMany({}),
      Category.deleteMany({}),
      Location.deleteMany({}),
      Bookmark.deleteMany({}),
    ]);

    await Category.insertMany(categories);
    await Location.insertMany(locations);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@businesslisting.dev',
      passwordHash: await User.hashPassword('admin123'),
      role: 'admin',
    });

    const [user1, user2] = await User.create([
      {
        name: 'Jamie Rivera',
        email: 'jamie@example.com',
        passwordHash: await User.hashPassword('password123'),
      },
      {
        name: 'Taylor Brooks',
        email: 'taylor@example.com',
        passwordHash: await User.hashPassword('password123'),
      },
    ]);

    const owners = [admin, user1, user2];
    const listingsToCreate = [];

    for (let i = 0; i < 20; i += 1) {
      const baseListing = sampleListings[i % sampleListings.length];
      const location = locations[(i + 2) % locations.length];
      const owner = owners[i % owners.length];
      listingsToCreate.push(
        generateListing(baseListing, {
          name: `${baseListing.name} ${i + 1}`,
          location,
          owner: owner.id,
        }),
      );
    }

    await Listing.insertMany(listingsToCreate);
    console.log('Seed complete. Created:');
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Locations: ${locations.length}`);
    console.log(`- Users: 3 (including admin)`);
    console.log(`- Listings: ${listingsToCreate.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
