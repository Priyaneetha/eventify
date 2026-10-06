// routes/eventRoutes.js
// Express routes for browsing and managing events

const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Admin-only routes (requires valid token AND admin role)
router.post('/', verifyToken, isAdmin, createEvent);
router.put('/:id', verifyToken, isAdmin, updateEvent);
router.delete('/:id', verifyToken, isAdmin, deleteEvent);

module.exports = router;
