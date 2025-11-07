import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import { Category } from '../models/Category.js';
import { Location } from '../models/Location.js';
import { Bookmark } from '../models/Bookmark.js';

const categories = [
  { key: 'Haircut', label: 'Haircut' },
  { key: 'Laundry', label: 'Laundry' },
  { key: 'Electronics', label: 'Electronics' },
  { key: 'Fashion', label: 'Fashion' },
  { key: 'Market', label: 'Market' },
];

const locations = [
  { city: 'New York', area: 'Manhattan' },
  { city: 'New York', area: 'Brooklyn' },
  { city: 'New York', area: 'Queens' },
  { city: 'Los Angeles', area: 'Downtown' },
  { city: 'Los Angeles', area: 'Hollywood' },
  { city: 'Los Angeles', area: 'Santa Monica' },
  { city: 'Chicago', area: 'Loop' },
  { city: 'Chicago', area: 'North Side' },
  { city: 'San Francisco', area: 'Financial District' },
  { city: 'San Francisco', area: 'Mission District' },
];

const seedData = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Category.deleteMany({});
    await Location.deleteMany({});
    await Bookmark.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    await Category.insertMany(categories);
    console.log('Categories created');

    // Create locations
    await Location.insertMany(locations);
    console.log('Locations created');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: 'admin123',
      role: 'admin',
    });

    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: 'password123',
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      passwordHash: 'password123',
      role: 'user',
    });

    console.log('Users created');

    // Create listings
    const listings = [
      {
        owner: user1._id,
        name: "Joe's Barbershop",
        category: 'Haircut',
        location: { city: 'New York', area: 'Manhattan' },
        shortDescription: 'Classic haircuts and grooming for men',
        description:
          'Traditional barbershop offering classic cuts, beard trims, and hot towel shaves. Walk-ins welcome or book online for convenience.',
        phone: '(555) 123-4567',
        hours: 'Mon-Sat 9AM-7PM, Sun 10AM-5PM',
        imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
      },
      {
        owner: user1._id,
        name: 'Clean & Fresh Laundromat',
        category: 'Laundry',
        location: { city: 'New York', area: 'Brooklyn' },
        shortDescription: 'Self-service and drop-off laundry',
        description:
          'Modern laundromat with high-efficiency washers and dryers. Offering both self-service and same-day drop-off services.',
        phone: '(555) 234-5678',
        hours: 'Daily 6AM-11PM',
        imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
      },
      {
        owner: user2._id,
        name: 'Tech Haven Electronics',
        category: 'Electronics',
        location: { city: 'Los Angeles', area: 'Hollywood' },
        shortDescription: 'Latest gadgets and electronics repair',
        description:
          'Your one-stop shop for smartphones, laptops, tablets, and accessories. We also offer repair services and technical support.',
        phone: '(555) 345-6789',
        hours: 'Mon-Fri 10AM-8PM, Sat-Sun 11AM-6PM',
        imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
      },
      {
        owner: user2._id,
        name: 'Style Studio Boutique',
        category: 'Fashion',
        location: { city: 'Los Angeles', area: 'Santa Monica' },
        shortDescription: 'Trendy fashion for all occasions',
        description:
          'Curated collection of contemporary fashion, from casual wear to evening dresses. Personal styling services available.',
        phone: '(555) 456-7890',
        hours: 'Mon-Sat 10AM-9PM, Sun 12PM-6PM',
        imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800',
      },
      {
        owner: user1._id,
        name: "Farmer's Choice Market",
        category: 'Market',
        location: { city: 'San Francisco', area: 'Mission District' },
        shortDescription: 'Fresh local produce and organic goods',
        description:
          'Farm-fresh vegetables, fruits, dairy, and artisan products. Supporting local farmers and sustainable agriculture.',
        phone: '(555) 567-8901',
        hours: 'Daily 8AM-8PM',
        imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800',
      },
      {
        owner: user2._id,
        name: 'Elite Hair Salon',
        category: 'Haircut',
        location: { city: 'Chicago', area: 'Loop' },
        shortDescription: 'Premium hair styling and coloring',
        description:
          'Upscale salon offering cuts, color, highlights, and treatments by certified stylists. Complimentary consultations.',
        phone: '(555) 678-9012',
        hours: 'Tue-Sat 9AM-7PM, Sun-Mon Closed',
        imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
      },
      {
        owner: user1._id,
        name: 'Wash World 24/7',
        category: 'Laundry',
        location: { city: 'Chicago', area: 'North Side' },
        shortDescription: 'Round-the-clock laundry services',
        description:
          '24-hour laundromat with state-of-the-art machines. Free Wi-Fi, vending machines, and attended service during peak hours.',
        phone: '(555) 789-0123',
        hours: 'Open 24/7',
        imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800',
      },
      {
        owner: user2._id,
        name: 'Gadget Galaxy',
        category: 'Electronics',
        location: { city: 'San Francisco', area: 'Financial District' },
        shortDescription: 'Electronics and smart home devices',
        description:
          'Wide selection of consumer electronics, gaming gear, and smart home solutions. Expert staff ready to help.',
        phone: '(555) 890-1234',
        hours: 'Mon-Sat 9AM-9PM, Sun 10AM-7PM',
        imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800',
      },
      {
        owner: user1._id,
        name: 'Urban Threads',
        category: 'Fashion',
        location: { city: 'New York', area: 'Queens' },
        shortDescription: 'Streetwear and urban fashion',
        description:
          'Latest trends in urban fashion, sneakers, and accessories. Exclusive drops and limited editions.',
        phone: '(555) 901-2345',
        hours: 'Daily 11AM-8PM',
        imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
      },
      {
        owner: user2._id,
        name: 'Organic Valley Market',
        category: 'Market',
        location: { city: 'Los Angeles', area: 'Downtown' },
        shortDescription: 'Organic groceries and health foods',
        description:
          'Fully stocked organic market with health foods, supplements, and eco-friendly products. Nutritionist on staff.',
        phone: '(555) 012-3456',
        hours: 'Mon-Sat 7AM-10PM, Sun 8AM-9PM',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
      },
      {
        owner: user1._id,
        name: 'Quick Cuts Express',
        category: 'Haircut',
        location: { city: 'New York', area: 'Brooklyn' },
        shortDescription: 'Fast, affordable haircuts',
        description:
          'No-appointment-needed haircuts for the whole family. Quick service without compromising quality.',
        phone: '(555) 123-9876',
        hours: 'Daily 9AM-9PM',
        imageUrl: 'https://images.unsplash.com/photo-1622286346003-c3d3e0c57e67?w=800',
      },
      {
        owner: user2._id,
        name: 'Sparkle Laundry Service',
        category: 'Laundry',
        location: { city: 'Los Angeles', area: 'Santa Monica' },
        shortDescription: 'Premium laundry and dry cleaning',
        description:
          'High-end laundry service with pickup and delivery. Specializing in delicate fabrics and dry cleaning.',
        phone: '(555) 234-9876',
        hours: 'Mon-Fri 7AM-7PM, Sat 8AM-6PM, Sun Closed',
        imageUrl: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800',
      },
      {
        owner: user1._id,
        name: 'Circuit City Electronics',
        category: 'Electronics',
        location: { city: 'Chicago', area: 'Loop' },
        shortDescription: 'Computer parts and gaming equipment',
        description:
          'Specialized in computer hardware, gaming peripherals, and custom PC builds. Competitive pricing.',
        phone: '(555) 345-9876',
        hours: 'Mon-Sat 10AM-8PM, Sun 11AM-5PM',
        imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800',
      },
      {
        owner: user2._id,
        name: 'Chic Boutique',
        category: 'Fashion',
        location: { city: 'San Francisco', area: 'Mission District' },
        shortDescription: "Women's designer clothing",
        description:
          'Boutique featuring designer labels and unique pieces. Personal shopping and styling appointments available.',
        phone: '(555) 456-9876',
        hours: 'Tue-Sat 11AM-7PM, Sun-Mon Closed',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
      },
      {
        owner: user1._id,
        name: 'Fresh Daily Market',
        category: 'Market',
        location: { city: 'New York', area: 'Manhattan' },
        shortDescription: 'International groceries and specialty items',
        description:
          'Diverse selection of international foods, spices, and specialty ingredients. Catering to multicultural tastes.',
        phone: '(555) 567-9876',
        hours: 'Daily 7AM-11PM',
        imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800',
      },
      {
        owner: user2._id,
        name: 'The Trim Shop',
        category: 'Haircut',
        location: { city: 'Los Angeles', area: 'Hollywood' },
        shortDescription: 'Modern hair salon for all styles',
        description:
          'Contemporary salon offering precision cuts, styling, and color services. Instagram-worthy results guaranteed.',
        phone: '(555) 678-9876',
        hours: 'Wed-Sun 10AM-6PM, Mon-Tue Closed',
        imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
      },
      {
        owner: user1._id,
        name: 'Express Wash',
        category: 'Laundry',
        location: { city: 'San Francisco', area: 'Financial District' },
        shortDescription: 'Fast laundry service for busy professionals',
        description:
          'Speedy wash and fold service with same-day turnaround. Perfect for busy city dwellers.',
        phone: '(555) 789-9876',
        hours: 'Mon-Fri 7AM-9PM, Sat-Sun 9AM-6PM',
        imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800',
      },
      {
        owner: user2._id,
        name: 'Digital World',
        category: 'Electronics',
        location: { city: 'New York', area: 'Queens' },
        shortDescription: 'Electronics and mobile accessories',
        description:
          'Wide range of mobile phones, tablets, accessories, and repair services. Competitive trade-in values.',
        phone: '(555) 890-9876',
        hours: 'Daily 10AM-9PM',
        imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
      },
      {
        owner: user1._id,
        name: 'Trendsetter Fashion',
        category: 'Fashion',
        location: { city: 'Chicago', area: 'North Side' },
        shortDescription: 'Latest fashion trends and accessories',
        description:
          'Stay ahead of the curve with our curated selection of trendy clothing, shoes, and accessories.',
        phone: '(555) 901-9876',
        hours: 'Mon-Sat 10AM-8PM, Sun 12PM-6PM',
        imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
      },
      {
        owner: user2._id,
        name: 'Community Market',
        category: 'Market',
        location: { city: 'Los Angeles', area: 'Downtown' },
        shortDescription: 'Neighborhood grocery store',
        description:
          'Family-owned market serving the community for over 20 years. Fresh produce, meats, and everyday essentials.',
        phone: '(555) 012-9876',
        hours: 'Daily 6AM-10PM',
        imageUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800',
      },
    ];

    await Listing.insertMany(listings);
    console.log('Listings created');

    console.log('\n=== Seed Data Summary ===');
    console.log(`Admin: admin@example.com / admin123`);
    console.log(`User 1: john@example.com / password123`);
    console.log(`User 2: jane@example.com / password123`);
    console.log(`Categories: ${categories.length}`);
    console.log(`Locations: ${locations.length}`);
    console.log(`Listings: ${listings.length}`);
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
