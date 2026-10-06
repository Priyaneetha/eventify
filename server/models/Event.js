// models/Event.js
// Event Schema for managing event details

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Technology', 'Music', 'Workshop', 'Business', 'Sports', 'Arts', 'General'],
      default: 'General',
    },
    date: {
      type: String,
      required: [true, 'Event date is required (YYYY-MM-DD)'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      default: 0,
    },
    capacity: {
      type: Number,
      required: [true, 'Total seat capacity is required'],
      min: 1,
    },
    bookedSeats: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
    },
    organizer: {
      type: String,
      default: 'Event Team',
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
