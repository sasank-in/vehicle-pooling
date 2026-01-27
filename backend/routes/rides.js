const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createRide,
  getAllRides,
  getRideDetails,
  updateRideStatus,
  cancelRide
} = require('../controllers/rideController');

const router = express.Router();

router.post('/', authMiddleware, createRide);
router.get('/', getAllRides);
router.get('/:rideId', getRideDetails);
router.put('/:rideId/status', authMiddleware, updateRideStatus);
router.delete('/:rideId', authMiddleware, cancelRide);

module.exports = router;
