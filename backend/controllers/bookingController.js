const pool = require('../config/database');

// Create a booking
const createBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { rideId, seatsBooked, pickupLat, pickupLng, dropoffLat, dropoffLng, pickupAddress, dropoffAddress } = req.body;

    if (!rideId || !seatsBooked || !pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get ride details
    const rideResult = await pool.query(
      'SELECT available_seats, price_per_seat, driver_id FROM rides WHERE id = $1',
      [rideId]
    );

    if (rideResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    const ride = rideResult.rows[0];

    // Check if seats are available
    if (ride.available_seats < seatsBooked) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    // Check if user is not the driver
    if (ride.driver_id === userId) {
      return res.status(400).json({ error: 'Cannot book your own ride' });
    }

    // Calculate total price
    const totalPrice = ride.price_per_seat * seatsBooked;

    // Create booking
    const bookingResult = await pool.query(
      `INSERT INTO bookings (
        ride_id, passenger_id, seats_booked, total_price,
        pickup_lat, pickup_lng, dropoff_lat, dropoff_lng,
        pickup_address, dropoff_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [rideId, userId, seatsBooked, totalPrice, pickupLat, pickupLng, dropoffLat, dropoffLng, pickupAddress, dropoffAddress]
    );

    // Update available seats
    await pool.query(
      'UPDATE rides SET available_seats = available_seats - $1 WHERE id = $2',
      [seatsBooked, rideId]
    );

    const booking = bookingResult.rows[0];

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT 
        b.*,
        r.start_address,
        r.end_address,
        r.departure_time,
        u.first_name as driver_name,
        u.rating as driver_rating,
        v.model as vehicle_model
      FROM bookings b
      JOIN rides r ON b.ride_id = r.id
      JOIN users u ON r.driver_id = u.id
      JOIN vehicles v ON r.vehicle_id = v.id
      WHERE b.passenger_id = $1
      ORDER BY r.departure_time DESC`,
      [userId]
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.params;

    // Verify ownership and get booking details
    const bookingResult = await pool.query(
      'SELECT ride_id, seats_booked FROM bookings WHERE id = $1 AND passenger_id = $2',
      [bookingId, userId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(403).json({ error: 'Booking not found or not authorized' });
    }

    const booking = bookingResult.rows[0];

    // Update booking status
    await pool.query(
      'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2',
      ['cancelled', bookingId]
    );

    // Return seats to ride
    await pool.query(
      'UPDATE rides SET available_seats = available_seats + $1 WHERE id = $2',
      [booking.seats_booked, booking.ride_id]
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

// Confirm booking (driver confirming passenger)
const confirmBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.params;

    // Get booking and verify driver
    const bookingResult = await pool.query(
      `SELECT b.*, r.driver_id
       FROM bookings b
       JOIN rides r ON b.ride_id = r.id
       WHERE b.id = $1`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (bookingResult.rows[0].driver_id !== userId) {
      return res.status(403).json({ error: 'Only driver can confirm booking' });
    }

    const result = await pool.query(
      'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      ['confirmed', bookingId]
    );

    res.json({ message: 'Booking confirmed', booking: result.rows[0] });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ error: 'Failed to confirm booking' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
  confirmBooking
};
