const pool = require('../config/database');
const { findMatchesForPassenger } = require('../utils/matchingAlgorithm');

// Create a new ride
const createRide = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      vehicleId,
      startLat,
      startLng,
      endLat,
      endLng,
      startAddress,
      endAddress,
      departureTime,
      availableSeats,
      pricePerSeat,
      notes
    } = req.body;

    // Validate input
    if (!vehicleId || !startLat || !startLng || !endLat || !endLng || !departureTime || !availableSeats || !pricePerSeat) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify vehicle ownership
    const vehicleCheck = await pool.query(
      'SELECT id FROM vehicles WHERE id = $1 AND owner_id = $2',
      [vehicleId, userId]
    );

    if (vehicleCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Vehicle not found or not owned by user' });
    }

    // Create ride
    const result = await pool.query(
      `INSERT INTO rides (
        driver_id, vehicle_id, start_lat, start_lng, end_lat, end_lng,
        start_address, end_address, departure_time, available_seats,
        price_per_seat, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [userId, vehicleId, startLat, startLng, endLat, endLng,
        startAddress, endAddress, departureTime, availableSeats,
        pricePerSeat, notes]
    );

    const ride = result.rows[0];

    res.status(201).json({
      message: 'Ride created successfully',
      ride
    });
  } catch (error) {
    console.error('Error creating ride:', error);
    res.status(500).json({ error: 'Failed to create ride' });
  }
};

// Get all rides (with filters)
const getAllRides = async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng, departureDate, status } = req.query;
    
    let query = `
      SELECT 
        r.*,
        u.first_name as driver_name,
        u.rating as driver_rating,
        v.model as vehicle_model
      FROM rides r
      JOIN users u ON r.driver_id = u.id
      JOIN vehicles v ON r.vehicle_id = v.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND r.status = $${params.length}`;
    } else {
      query += ` AND r.status = 'scheduled'`;
    }

    if (departureDate) {
      const dateStart = new Date(departureDate);
      const dateEnd = new Date(departureDate);
      dateEnd.setDate(dateEnd.getDate() + 1);
      params.push(dateStart, dateEnd);
      query += ` AND r.departure_time >= $${params.length - 1} AND r.departure_time < $${params.length}`;
    }

    query += ` ORDER BY r.departure_time ASC LIMIT 100`;

    const result = await pool.query(query, params);
    res.json({ rides: result.rows });
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
};

// Get ride details
const getRideDetails = async (req, res) => {
  try {
    const { rideId } = req.params;

    const result = await pool.query(
      `SELECT 
        r.*,
        u.first_name as driver_name,
        u.email as driver_email,
        u.rating as driver_rating,
        u.total_rides,
        v.model as vehicle_model,
        v.color as vehicle_color,
        v.seats as vehicle_seats
      FROM rides r
      JOIN users u ON r.driver_id = u.id
      JOIN vehicles v ON r.vehicle_id = v.id
      WHERE r.id = $1`,
      [rideId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Get passengers for this ride
    const passengersResult = await pool.query(
      `SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.rating,
        b.seats_booked,
        b.pickup_address,
        b.dropoff_address
      FROM bookings b
      JOIN users u ON b.passenger_id = u.id
      WHERE b.ride_id = $1 AND b.status = 'confirmed'`,
      [rideId]
    );

    res.json({
      ride: result.rows[0],
      passengers: passengersResult.rows
    });
  } catch (error) {
    console.error('Error fetching ride details:', error);
    res.status(500).json({ error: 'Failed to fetch ride details' });
  }
};

// Update ride status
const updateRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    // Verify ride ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM rides WHERE id = $1 AND driver_id = $2',
      [rideId, userId]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this ride' });
    }

    const result = await pool.query(
      'UPDATE rides SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, rideId]
    );

    res.json({
      message: 'Ride status updated',
      ride: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating ride:', error);
    res.status(500).json({ error: 'Failed to update ride' });
  }
};

// Cancel ride
const cancelRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const userId = req.userId;

    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT id FROM rides WHERE id = $1 AND driver_id = $2',
      [rideId, userId]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query(
      'UPDATE rides SET status = $1, updated_at = NOW() WHERE id = $2',
      ['cancelled', rideId]
    );

    res.json({ message: 'Ride cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling ride:', error);
    res.status(500).json({ error: 'Failed to cancel ride' });
  }
};

module.exports = {
  createRide,
  getAllRides,
  getRideDetails,
  updateRideStatus,
  cancelRide
};
