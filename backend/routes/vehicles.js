const express = require('express');
const authMiddleware = require('../middleware/auth');
const pool = require('../config/database');

const router = express.Router();

// Register a vehicle
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { licensePlate, model, color, seats, vehicleType } = req.body;

    if (!licensePlate || !model || !seats) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO vehicles (owner_id, license_plate, model, color, seats, vehicle_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, licensePlate, model, color, seats, vehicleType || 'sedan']
    );

    res.status(201).json({ vehicle: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'License plate already registered' });
    }
    console.error('Error creating vehicle:', error);
    res.status(500).json({ error: 'Failed to register vehicle' });
  }
});

// Get user's vehicles
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      'SELECT * FROM vehicles WHERE owner_id = $1',
      [userId]
    );
    res.json({ vehicles: result.rows });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

module.exports = router;
