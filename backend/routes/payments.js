const express = require('express');
const authMiddleware = require('../middleware/auth');
const pool = require('../config/database');

const router = express.Router();

// Create payment intent
router.post('/create-intent', authMiddleware, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create payment record
    const result = await pool.query(
      `INSERT INTO payments (booking_id, amount, currency, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [bookingId, amount, 'USD', 'pending']
    );

    res.json({
      message: 'Payment intent created',
      payment: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Confirm payment
router.post('/confirm', authMiddleware, async (req, res) => {
  try {
    const { paymentId } = req.body;

    const result = await pool.query(
      `UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      ['completed', paymentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update booking payment status
    const payment = result.rows[0];
    await pool.query(
      'UPDATE bookings SET payment_status = $1 WHERE id = $2',
      ['confirmed', payment.booking_id]
    );

    res.json({ message: 'Payment confirmed', payment: result.rows[0] });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

module.exports = router;
