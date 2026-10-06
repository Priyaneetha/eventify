// controllers/eventController.js
// Handles CRUD operations for Events (Public view, Admin create/edit/delete)

const Event = require('../models/Event');
const Booking = require('../models/Booking');

// @desc    Get all events (with optional search & category filter)
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = {};

    // Filter by search query in title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by status if requested
    if (status) {
      query.status = status;
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error fetching events.', error: error.message });
  }
};

// @desc    Get single event details by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching event details.', error: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private / Admin
const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, location, price, capacity, image, organizer } = req.body;

    if (!title || !description || !date || !time || !location || capacity === undefined) {
      return res.status(400).json({ message: 'Please provide all required event details.' });
    }

    const newEvent = await Event.create({
      title,
      description,
      category: category || 'General',
      date,
      time,
      location,
      price: price || 0,
      capacity: Number(capacity),
      bookedSeats: 0,
      image: image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
      organizer: organizer || 'Event Team',
      status: 'Upcoming',
    });

    res.status(201).json({
      message: 'Event created successfully!',
      event: newEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error creating event.', error: error.message });
  }
};

// @desc    Update an existing event
// @route   PUT /api/events/:id
// @access  Private / Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const { title, description, category, date, time, location, price, capacity, image, organizer, status } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (category) event.category = category;
    if (date) event.date = date;
    if (time) event.time = time;
    if (location) event.location = location;
    if (price !== undefined) event.price = price;
    if (capacity !== undefined) event.capacity = capacity;
    if (image) event.image = image;
    if (organizer) event.organizer = organizer;
    if (status) event.status = status;

    const updatedEvent = await event.save();

    res.status(200).json({
      message: 'Event updated successfully!',
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating event.', error: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private / Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Delete event
    await Event.findByIdAndDelete(req.params.id);

    // Cancel/Delete related bookings
    await Booking.deleteMany({ event: req.params.id });

    res.status(200).json({ message: 'Event and related bookings deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting event.', error: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
