const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const run = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const passwordPlain = 'Password123!';
    const passwordHash = await bcrypt.hash(passwordPlain, 10);

    // Create users (auth table) to satisfy FK constraints, but focus on other tables.
    const driverIds = [];
    const passengerIds = [];
    const driverCount = 6;
    const passengerCount = 6;

    for (let i = 1; i <= driverCount; i += 1) {
      const email = `driver${i}@test.com`;
      let result = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        result = await client.query(
          `INSERT INTO users (email, password_hash, first_name, last_name, phone)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [email, passwordHash, `Driver${i}`, 'Test', `555-10${i}`]
        );
      }
      driverIds.push(result.rows[0].id);
    }

    for (let i = 1; i <= passengerCount; i += 1) {
      const email = `passenger${i}@test.com`;
      let result = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        result = await client.query(
          `INSERT INTO users (email, password_hash, first_name, last_name, phone)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [email, passwordHash, `Passenger${i}`, 'Test', `555-20${i}`]
        );
      }
      passengerIds.push(result.rows[0].id);
    }

    const vehicleIds = [];
    const vehiclesTarget = 30;
    for (let i = 1; i <= vehiclesTarget; i += 1) {
      const license = `TEST-${100 + i}`;
      let result = await client.query('SELECT id FROM vehicles WHERE license_plate = $1', [license]);
      if (result.rows.length === 0) {
        const ownerId = driverIds[(i - 1) % driverIds.length];
        result = await client.query(
          `INSERT INTO vehicles (owner_id, license_plate, model, color, seats)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [ownerId, license, `Model-${i}`, ['Blue', 'Red', 'Black'][i % 3], 4 + (i % 2)]
        );
      }
      vehicleIds.push(result.rows[0].id);
    }

    const rideIds = [];
    const ridesTarget = 30;
    for (let i = 1; i <= ridesTarget; i += 1) {
      const driverId = driverIds[(i - 1) % driverIds.length];
      const vehicleId = vehicleIds[(i - 1) % vehicleIds.length];
      const startLat = 40.70 + i * 0.01;
      const startLng = -74.00 - i * 0.01;
      const endLat = 34.00 + i * 0.01;
      const endLng = -118.20 - i * 0.01;

      let result = await client.query(
        'SELECT id FROM rides WHERE driver_id = $1 AND vehicle_id = $2 AND start_lat = $3 AND end_lat = $4',
        [driverId, vehicleId, startLat, endLat]
      );
      if (result.rows.length === 0) {
        result = await client.query(
          `INSERT INTO rides (
            driver_id, vehicle_id, start_location, end_location,
            start_lat, start_lng, end_lat, end_lng,
            start_address, end_address, departure_time,
            available_seats, price_per_seat, notes
          ) VALUES (
            $1, $2, POINT($3, $4), POINT($5, $6),
            $3, $4, $5, $6,
            $7, $8, NOW() + ($9 || ' day')::INTERVAL,
            $10, $11, $12
          ) RETURNING id`,
          [
            driverId,
            vehicleId,
            startLat, startLng,
            endLat, endLng,
            `Start-${i}`, `End-${i}`,
            i,
            3,
            20 + i,
            `Seed ride ${i}`
          ]
        );
      }
      rideIds.push(result.rows[0].id);
    }

    const bookingsTarget = 30;
    const bookingIds = [];
    for (let i = 1; i <= bookingsTarget; i += 1) {
      const rideId = rideIds[(i - 1) % rideIds.length];
      const passengerId = passengerIds[(i - 1) % passengerIds.length];
      let result = await client.query(
        'SELECT id FROM bookings WHERE ride_id = $1 AND passenger_id = $2',
        [rideId, passengerId]
      );
      if (result.rows.length === 0) {
        result = await client.query(
          `INSERT INTO bookings (
            ride_id, passenger_id, seats_booked, total_price, status
          ) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [rideId, passengerId, 1, 20 + i, 'confirmed']
        );
      }
      bookingIds.push(result.rows[0].id);
    }

    const reviewsTarget = 30;
    for (let i = 1; i <= reviewsTarget; i += 1) {
      const bookingId = bookingIds[(i - 1) % bookingIds.length];
      const reviewerId = passengerIds[(i - 1) % passengerIds.length];
      const revieweeId = driverIds[(i - 1) % driverIds.length];
      const rating = 3 + (i % 3);
      const existing = await client.query(
        'SELECT id FROM reviews WHERE booking_id = $1 AND reviewer_id = $2',
        [bookingId, reviewerId]
      );
      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
           VALUES ($1, $2, $3, $4, $5)`,
          [bookingId, reviewerId, revieweeId, rating, `Review ${i}`]
        );
      }
    }

    const paymentsTarget = 30;
    for (let i = 1; i <= paymentsTarget; i += 1) {
      const bookingId = bookingIds[(i - 1) % bookingIds.length];
      const existing = await client.query(
        'SELECT id FROM payments WHERE booking_id = $1',
        [bookingId]
      );
      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO payments (booking_id, amount, currency, payment_method, status)
           VALUES ($1, $2, $3, $4, $5)`,
          [bookingId, 20 + i, 'USD', 'stripe', 'completed']
        );
      }
    }

    await client.query('COMMIT');
    console.log('Seed data inserted.');
    console.log('Test users: driver1@test.com..driver6@test.com / Password123!');
    console.log('Test users: passenger1@test.com..passenger6@test.com / Password123!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

run();
