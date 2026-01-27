const express = require('express');
const authMiddleware = require('../middleware/auth');
const pool = require('../config/database');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, phone, rating, total_rides, profile_image_url
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, phone, profileImageUrl } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           phone = COALESCE($3, phone),
           profile_image_url = COALESCE($4, profile_image_url),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [firstName, lastName, phone, profileImageUrl, userId]
    );

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user reviews
router.get('/reviews', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, b.id as booking_id
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       JOIN bookings b ON r.booking_id = b.id
       WHERE r.reviewee_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json({ reviews: result.rows });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
