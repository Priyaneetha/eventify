// controllers/bookingController.js
// Handles event booking, user bookings view, ticket availability, and cancellation

const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Book tickets for an event
// @route   POST /api/bookings
// @access  Private (Registered Users)
const createBooking = async (req, res) => {
  try {
    const { eventId, ticketsCount = 1 } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required.' });
    }

    const tickets = Number(ticketsCount);
    if (isNaN(tickets) || tickets <= 0) {
      return res.status(400).json({ message: 'Please select a valid ticket count (at least 1).' });
    }

    // 1. Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // 2. Check if event is active/upcoming
    if (event.status === 'Cancelled') {
      return res.status(400).json({ message: 'Cannot book tickets for a cancelled event.' });
    }

    // 3. Check seat availability
    const availableSeats = event.capacity - event.bookedSeats;
    if (availableSeats < tickets) {
      return res.status(400).json({
        message: `Not enough seats available. Only ${availableSeats} seat(s) left.`,
      });
    }

    // 4. Calculate total price
    const totalPrice = event.price * tickets;

    // 5. Create Booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      ticketsCount: tickets,
      totalPrice,
      status: 'Confirmed',
    });

    // 6. Update event's booked seats counter
    event.bookedSeats += tickets;
    await event.save();

    // 7. Populate event details for response
    const populatedBooking = await Booking.findById(booking._id).populate('event');

    res.status(201).json({
      message: 'Booking confirmed successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    console.error('Create Booking Error:', error);
    res.status(500).json({ message: 'Server error processing booking.', error: error.message });
  }
};

// @desc    Get bookings of current logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Get User Bookings Error:', error);
    res.status(500).json({ message: 'Server error fetching your bookings.', error: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking record not found.' });
    }

    // Check ownership or admin privilege
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking.' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'This booking is already cancelled.' });
    }

    // Update status to Cancelled
    booking.status = 'Cancelled';
    await booking.save();

    // Release seats back to event capacity
    const event = await Event.findById(booking.event);
    if (event) {
      event.bookedSeats = Math.max(0, event.bookedSeats - booking.ticketsCount);
      await event.save();
    }

    const updatedBooking = await Booking.findById(booking._id).populate('event');

    res.status(200).json({
      message: 'Booking cancelled successfully.',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Cancel Booking Error:', error);
    res.status(500).json({ message: 'Server error cancelling booking.', error: error.message });
  }
};

// @desc    Get all bookings (Admin dashboard view)
// @route   GET /api/bookings/admin/all
// @access  Private / Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('event', 'title date location price status')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all bookings.', error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
};
