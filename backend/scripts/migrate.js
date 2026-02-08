const pool = require('../config/database');

const run = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        profile_image_url TEXT,
        rating DECIMAL(3,2) DEFAULT 5.00,
        total_rides INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        owner_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        license_plate VARCHAR(20) UNIQUE NOT NULL,
        model VARCHAR(100) NOT NULL,
        color VARCHAR(50),
        seats INT NOT NULL,
        vehicle_type VARCHAR(50) DEFAULT 'sedan',
        registration_doc_url TEXT,
        insurance_doc_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS rides (
        id SERIAL PRIMARY KEY,
        driver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        start_location POINT NOT NULL,
        end_location POINT NOT NULL,
        start_lat DECIMAL(10,8),
        start_lng DECIMAL(11,8),
        end_lat DECIMAL(10,8),
        end_lng DECIMAL(11,8),
        start_address VARCHAR(255),
        end_address VARCHAR(255),
        departure_time TIMESTAMP NOT NULL,
        arrival_time TIMESTAMP,
        available_seats INT NOT NULL,
        price_per_seat DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        ride_id INT NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
        passenger_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        pickup_lat DECIMAL(10,8),
        pickup_lng DECIMAL(11,8),
        dropoff_lat DECIMAL(10,8),
        dropoff_lng DECIMAL(11,8),
        pickup_address VARCHAR(255),
        dropoff_address VARCHAR(255),
        seats_booked INT NOT NULL DEFAULT 1,
        total_price DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'confirmed',
        payment_status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        reviewer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reviewee_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        payment_method VARCHAR(50),
        stripe_payment_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
      CREATE INDEX IF NOT EXISTS idx_vehicles_owner_id ON vehicles(owner_id);
      CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON rides(driver_id);
      CREATE INDEX IF NOT EXISTS idx_rides_vehicle_id ON rides(vehicle_id);
      CREATE INDEX IF NOT EXISTS idx_rides_departure_time ON rides(departure_time);
      CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
      CREATE INDEX IF NOT EXISTS idx_bookings_ride_id ON bookings(ride_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_passenger_id ON bookings(passenger_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
      CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
      CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    `);

    await client.query('COMMIT');
    console.log('Database schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

run();
