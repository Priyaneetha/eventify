// seeder.js
// Script to clear existing database and populate initial sample data (Users & Events)

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

dotenv.config();

const sampleEvents = [
  {
    title: 'Global Tech Summit 2026',
    description: 'Join industry leaders and innovators to discuss AI, Web Development, Cloud Computing, and the future of technology.',
    category: 'Technology',
    date: '2026-11-15',
    time: '09:00 AM - 05:00 PM',
    location: 'Convention Center, Tech Park, Silicon Valley',
    price: 49,
    capacity: 250,
    bookedSeats: 45,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Tech Global Inc.',
    status: 'Upcoming',
  },
  {
    title: 'Neon Pulse Music Festival',
    description: 'Experience an extraordinary night of live electronic and synthwave music with top international DJs and laser light shows.',
    category: 'Music',
    date: '2026-11-20',
    time: '06:30 PM - 02:00 AM',
    location: 'Riverside Open Air Arena',
    price: 75,
    capacity: 500,
    bookedSeats: 120,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    organizer: 'SoundWave Productions',
    status: 'Upcoming',
  },
  {
    title: 'Full-Stack Web Dev Bootcamp',
    description: 'Hands-on interactive workshop covering React, Node.js, Express, and MongoDB. Perfect for students and entry-level developers.',
    category: 'Workshop',
    date: '2026-12-05',
    time: '10:00 AM - 04:00 PM',
    location: 'Innovation Hub, Building B, Downtown',
    price: 25,
    capacity: 60,
    bookedSeats: 28,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    organizer: 'CodeCraft Academy',
    status: 'Upcoming',
  },
  {
    title: 'Startup Pitch Night & Expo',
    description: 'Early-stage founders present their ideas to venture capitalists, angel investors, and tech enthusiasts. Networking included.',
    category: 'Business',
    date: '2026-12-12',
    time: '05:00 PM - 09:00 PM',
    location: 'Venture Capital Center, Floor 14',
    price: 0, // Free event
    capacity: 150,
    bookedSeats: 80,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Founders Alliance',
    status: 'Upcoming',
  },
  {
    title: 'International Modern Art Exhibition',
    description: 'Discover contemporary masterpieces, digital artworks, and sculpture installations by world-renowned artists.',
    category: 'Arts',
    date: '2026-12-18',
    time: '11:00 AM - 07:00 PM',
    location: 'City Gallery of Fine Arts',
    price: 15,
    capacity: 300,
    bookedSeats: 90,
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Metro Cultural Guild',
    status: 'Upcoming',
  },
  {
    title: 'City Marathon & Fitness Expo',
    description: 'Annual 10k and Half-marathon race through scenic city landmarks. Includes energy drinks, medals, and health checkup stalls.',
    category: 'Sports',
    date: '2027-01-10',
    time: '06:00 AM - 12:00 PM',
    location: 'Central Park Main Entrance',
    price: 30,
    capacity: 1000,
    bookedSeats: 340,
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
    organizer: 'City Athletics Club',
    status: 'Upcoming',
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_management_db');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Event.deleteMany();
    await Booking.deleteMany();
    console.log('Cleared existing Users, Events, and Bookings.');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@event.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1 800-555-0199',
    });

    // Create Regular User
    const userPassword = await bcrypt.hash('user123', 10);
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'user',
      phone: '+1 555-0142',
    });

    console.log('Created Demo Users:');
    console.log('  Admin -> Email: admin@event.com | Password: admin123');
    console.log('  User  -> Email: john@example.com | Password: user123');

    // Create Events
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`Created ${createdEvents.length} initial events.`);

    // Create a demo booking for regular user
    await Booking.create({
      user: regularUser._id,
      event: createdEvents[0]._id, // Global Tech Summit
      ticketsCount: 2,
      totalPrice: createdEvents[0].price * 2,
      status: 'Confirmed',
    });
    console.log('Created sample booking for John Doe.');

    console.log('✅ Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
