const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  confirmBooking
} = require('../controllers/bookingController');

const router = express.Router();

router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getUserBookings);
router.delete('/:bookingId', authMiddleware, cancelBooking);
router.put('/:bookingId/confirm', authMiddleware, confirmBooking);

module.exports = router;
