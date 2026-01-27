const pool = require('../config/database');
const { findMatchesForPassenger } = require('../utils/matchingAlgorithm');

// Search for rides with matching algorithm
const searchRides = async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng, departureTime } = req.body;

    if (!startLat || !startLng || !endLat || !endLng || !departureTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const passengerStart = { lat: parseFloat(startLat), lng: parseFloat(startLng) };
    const passengerEnd = { lat: parseFloat(endLat), lng: parseFloat(endLng) };

    // Use matching algorithm to find compatible rides
    const matches = await findMatchesForPassenger(passengerStart, passengerEnd, departureTime);

    res.json({
      matchCount: matches.length,
      matches
    });
  } catch (error) {
    console.error('Error searching rides:', error);
    res.status(500).json({ error: 'Failed to search rides' });
  }
};

// Get matching statistics
const getMatchingStats = async (req, res) => {
  try {
    const statsResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT r.id) as total_available_rides,
        COUNT(DISTINCT b.id) as total_bookings,
        AVG(CAST(r.available_seats as NUMERIC)) as avg_seats_available,
        SUM(CASE WHEN b.status = 'completed' THEN 1 ELSE 0 END) as completed_rides
      FROM rides r
      LEFT JOIN bookings b ON r.id = b.ride_id
      WHERE r.status IN ('scheduled', 'in_progress')
    `);

    res.json(statsResult.rows[0]);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};

// Get recommended rides based on user history
const getRecommendedRides = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 5 } = req.query;

    // Get user's past ride preferences
    const userHistoryResult = await pool.query(
      `SELECT 
        AVG(r.start_lat) as avg_start_lat,
        AVG(r.start_lng) as avg_start_lng,
        AVG(r.end_lat) as avg_end_lat,
        AVG(r.end_lng) as avg_end_lng
      FROM bookings b
      JOIN rides r ON b.ride_id = r.id
      WHERE b.passenger_id = $1`,
      [userId]
    );

    if (userHistoryResult.rows[0].avg_start_lat === null) {
      // No history, return empty recommendations
      return res.json({ recommendations: [] });
    }

    const userPreference = userHistoryResult.rows[0];
    const matches = await findMatchesForPassenger(
      { lat: userPreference.avg_start_lat, lng: userPreference.avg_start_lng },
      { lat: userPreference.avg_end_lat, lng: userPreference.avg_end_lng },
      new Date(),
      parseInt(limit)
    );

    res.json({ recommendations: matches });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

module.exports = {
  searchRides,
  getMatchingStats,
  getRecommendedRides
};
