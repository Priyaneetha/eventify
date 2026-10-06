// routes/bookingRoutes.js
// Express routes for event bookings and ticket management

const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
} = require('../controllers/bookingController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Protected User routes
router.post('/', verifyToken, createBooking);
router.get('/my-bookings', verifyToken, getUserBookings);
router.put('/:id/cancel', verifyToken, cancelBooking);

// Protected Admin routes
router.get('/admin/all', verifyToken, isAdmin, getAllBookings);

module.exports = router;
