#!/usr/bin/env node
/* eslint-disable no-console */
const path = require('path');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const env = require('../src/config/env');
const { connectDB } = require('../src/config/database');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Location = require('../src/models/Location');
const Listing = require('../src/models/Listing');
const Bookmark = require('../src/models/Bookmark');

const categoriesSeed = [
  { key: 'haircut', label: 'Haircut' },
  { key: 'laundry', label: 'Laundry' },
  { key: 'electronics', label: 'Electronics' },
  { key: 'fashion', label: 'Fashion' },
  { key: 'market', label: 'Market' },
];

const locationsSeed = [
  { city: 'Metro City', area: 'Downtown' },
  { city: 'Metro City', area: 'Uptown' },
  { city: 'Lakeside', area: 'Harbor' },
  { city: 'Greenville', area: 'Central Park' },
  { city: 'Hillview', area: 'Old Town' },
];

const sampleDescriptions = [
  'Locally owned and operated with a passion for service.',
  'Trusted by the community for over a decade.',
  'Affordable prices and friendly staff ready to help.',
  'Modern facilities with top-notch customer care.',
  'Convenient location with extended business hours.',
];

const sampleHours = ['Mon-Fri 9am-6pm', 'Daily 10am-8pm', 'Mon-Sat 8am-5pm', 'Daily 24/7'];

const sampleImage = (index) =>
  `https://picsum.photos/seed/business-${index}/400/250`;

const pick = (arr, index) => arr[index % arr.length];

const createListings = (owners) => {
  const listings = [];
  for (let i = 0; i < 20; i += 1) {
    const category = categoriesSeed[i % categoriesSeed.length].label;
    const location = locationsSeed[i % locationsSeed.length];
    const owner = owners[i % owners.length];

    listings.push({
      owner: owner._id,
      name: `${category} Services ${i + 1}`,
      category,
      location,
      shortDescription: pick(sampleDescriptions, i).slice(0, 120),
      description: `${pick(sampleDescriptions, i)} We take pride in offering great experiences to all of our customers. Visit us for personalized assistance and premium offerings tailored to your needs.`,
      phone: `555-01${(i + 10).toString().padStart(2, '0')}`,
      hours: pick(sampleHours, i),
      imageUrl: sampleImage(i),
      isActive: true,
    });
  }
  return listings;
};

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Location.deleteMany({}),
    Listing.deleteMany({}),
    Bookmark.deleteMany({}),
  ]);

  const [adminPassword, userPassword] = await Promise.all([
    bcrypt.hash('admin123', 10),
    bcrypt.hash('user123', 10),
  ]);

  const users = await User.insertMany([
    {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'admin',
    },
    {
      name: 'Jane Doe',
      email: 'jane@example.com',
      passwordHash: userPassword,
      role: 'user',
    },
    {
      name: 'John Smith',
      email: 'john@example.com',
      passwordHash: userPassword,
      role: 'user',
    },
  ]);

  await Category.insertMany(categoriesSeed);
  await Location.insertMany(locationsSeed);

  const listings = createListings(users);
  await Listing.insertMany(listings);

  console.log('Seed data created successfully');
  console.log(`Admin login -> email: admin@example.com password: admin123`);
  console.log(`User login  -> email: jane@example.com password: user123`);

  process.exit(0);
};

seed().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
