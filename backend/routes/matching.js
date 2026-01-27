const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  searchRides,
  getMatchingStats,
  getRecommendedRides
} = require('../controllers/matchingController');

const router = express.Router();

router.post('/search', authMiddleware, searchRides);
router.get('/stats', getMatchingStats);
router.get('/recommendations', authMiddleware, getRecommendedRides);

module.exports = router;
