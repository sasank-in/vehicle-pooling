# Database Schema

## Overview

The Vehicle Pooling platform uses PostgreSQL with a normalized relational schema designed for scalability and performance.

## Tables

### 1. users

Stores user account information and profile data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| first_name | VARCHAR(100) | NOT NULL | User's first name |
| last_name | VARCHAR(100) | NOT NULL | User's last name |
| phone | VARCHAR(20) | | Phone number |
| profile_image_url | TEXT | | URL to profile picture |
| rating | DECIMAL(3,2) | DEFAULT 5.00 | Average rating (1-5) |
| total_rides | INT | DEFAULT 0 | Total rides completed |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update date |

**Indexes**: email (UNIQUE), created_at

**Example**:
```json
{
  "id": 1,
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "rating": 4.8,
  "total_rides": 45
}
```

---

### 2. vehicles

Stores vehicle information for drivers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique vehicle identifier |
| owner_id | INT | NOT NULL, FOREIGN KEY | Reference to users table |
| license_plate | VARCHAR(20) | UNIQUE, NOT NULL | Vehicle license plate |
| model | VARCHAR(100) | NOT NULL | Vehicle make and model |
| color | VARCHAR(50) | | Vehicle color |
| seats | INT | NOT NULL | Number of seats |
| vehicle_type | VARCHAR(50) | DEFAULT 'sedan' | Type (sedan, SUV, etc.) |
| registration_doc_url | TEXT | | URL to registration document |
| insurance_doc_url | TEXT | | URL to insurance document |
| is_active | BOOLEAN | DEFAULT TRUE | Whether vehicle is available |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Registration date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update date |

**Indexes**: owner_id, license_plate (UNIQUE)

**Foreign Keys**: owner_id → users(id) ON DELETE CASCADE

**Example**:
```json
{
  "id": 5,
  "owner_id": 1,
  "license_plate": "ABC123XY",
  "model": "Toyota Camry",
  "seats": 5,
  "vehicle_type": "sedan"
}
```

---

### 3. rides

Stores ride postings by drivers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique ride identifier |
| driver_id | INT | NOT NULL, FOREIGN KEY | Reference to users table |
| vehicle_id | INT | NOT NULL, FOREIGN KEY | Reference to vehicles table |
| start_location | POINT | NOT NULL | Geographic start point |
| end_location | POINT | NOT NULL | Geographic end point |
| start_lat | DECIMAL(10,8) | | Start latitude |
| start_lng | DECIMAL(11,8) | | Start longitude |
| end_lat | DECIMAL(10,8) | | End latitude |
| end_lng | DECIMAL(11,8) | | End longitude |
| start_address | VARCHAR(255) | | Formatted start address |
| end_address | VARCHAR(255) | | Formatted end address |
| departure_time | TIMESTAMP | NOT NULL | When ride starts |
| arrival_time | TIMESTAMP | | When ride ends |
| available_seats | INT | NOT NULL | Number of open seats |
| price_per_seat | DECIMAL(10,2) | NOT NULL | Price per passenger |
| status | VARCHAR(50) | DEFAULT 'scheduled' | Current status |
| notes | TEXT | | Additional ride info |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update |

**Statuses**: `scheduled`, `in_progress`, `completed`, `cancelled`

**Indexes**: driver_id, vehicle_id, departure_time, status

**Foreign Keys**: 
- driver_id → users(id) ON DELETE CASCADE
- vehicle_id → vehicles(id) ON DELETE CASCADE

**Example**:
```json
{
  "id": 10,
  "driver_id": 1,
  "vehicle_id": 5,
  "start_address": "Downtown Station",
  "end_address": "Airport Terminal",
  "departure_time": "2024-02-01T08:00:00Z",
  "available_seats": 3,
  "price_per_seat": 25.00,
  "status": "scheduled"
}
```

---

### 4. bookings

Stores passenger bookings for rides.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique booking identifier |
| ride_id | INT | NOT NULL, FOREIGN KEY | Reference to rides table |
| passenger_id | INT | NOT NULL, FOREIGN KEY | Reference to users table |
| pickup_lat | DECIMAL(10,8) | | Passenger pickup latitude |
| pickup_lng | DECIMAL(11,8) | | Passenger pickup longitude |
| dropoff_lat | DECIMAL(10,8) | | Passenger dropoff latitude |
| dropoff_lng | DECIMAL(11,8) | | Passenger dropoff longitude |
| pickup_address | VARCHAR(255) | | Formatted pickup address |
| dropoff_address | VARCHAR(255) | | Formatted dropoff address |
| seats_booked | INT | NOT NULL DEFAULT 1 | Number of seats booked |
| total_price | DECIMAL(10,2) | | Total booking cost |
| status | VARCHAR(50) | DEFAULT 'confirmed' | Booking status |
| payment_status | VARCHAR(50) | DEFAULT 'pending' | Payment status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Booking date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update |

**Statuses**: `confirmed`, `cancelled`, `completed`

**Payment Statuses**: `pending`, `confirmed`, `refunded`

**Indexes**: ride_id, passenger_id, status

**Foreign Keys**:
- ride_id → rides(id) ON DELETE CASCADE
- passenger_id → users(id) ON DELETE CASCADE

**Example**:
```json
{
  "id": 20,
  "ride_id": 10,
  "passenger_id": 3,
  "seats_booked": 2,
  "total_price": 50.00,
  "status": "confirmed",
  "payment_status": "confirmed"
}
```

---

### 5. reviews

Stores user reviews and ratings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique review identifier |
| booking_id | INT | NOT NULL, FOREIGN KEY | Reference to bookings table |
| reviewer_id | INT | NOT NULL, FOREIGN KEY | User giving review |
| reviewee_id | INT | NOT NULL, FOREIGN KEY | User being reviewed |
| rating | INT | NOT NULL, CHECK 1-5 | Star rating (1-5) |
| comment | TEXT | | Written review |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Review date |

**Indexes**: booking_id, reviewer_id, reviewee_id

**Foreign Keys**:
- booking_id → bookings(id) ON DELETE CASCADE
- reviewer_id → users(id) ON DELETE CASCADE
- reviewee_id → users(id) ON DELETE CASCADE

**Example**:
```json
{
  "id": 50,
  "booking_id": 20,
  "reviewer_id": 3,
  "reviewee_id": 1,
  "rating": 5,
  "comment": "Great driver, clean car, very friendly!"
}
```

---

### 6. payments

Stores payment transaction information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique payment identifier |
| booking_id | INT | NOT NULL, FOREIGN KEY | Reference to bookings table |
| amount | DECIMAL(10,2) | NOT NULL | Payment amount |
| currency | VARCHAR(10) | DEFAULT 'USD' | Currency code |
| payment_method | VARCHAR(50) | | Method used (stripe, paypal) |
| stripe_payment_id | VARCHAR(255) | | External payment ID |
| status | VARCHAR(50) | DEFAULT 'pending' | Payment status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Payment date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update |

**Statuses**: `pending`, `completed`, `failed`, `refunded`

**Indexes**: booking_id, status

**Foreign Keys**: booking_id → bookings(id) ON DELETE CASCADE

**Example**:
```json
{
  "id": 100,
  "booking_id": 20,
  "amount": 50.00,
  "currency": "USD",
  "status": "completed",
  "stripe_payment_id": "pi_1234567890"
}
```

---

## Relationships Diagram

```
users
  ├── owns → vehicles
  ├── posts → rides
  ├── makes → bookings (as passenger)
  ├── gives/receives → reviews
  └── makes → payments

vehicles
  └── used in → rides

rides
  └── has many → bookings

bookings
  ├── generates → reviews
  ├── associated with → payments
  └── references → rides, users (passenger)

reviews
  └── references → bookings, users (reviewer/reviewee)

payments
  └── references → bookings
```

## Query Examples

### Find all rides for a driver
```sql
SELECT * FROM rides 
WHERE driver_id = 1 AND status = 'scheduled'
ORDER BY departure_time ASC;
```

### Get rider's booking history
```sql
SELECT b.*, r.start_address, r.end_address, u.first_name as driver_name
FROM bookings b
JOIN rides r ON b.ride_id = r.id
JOIN users u ON r.driver_id = u.id
WHERE b.passenger_id = 3
ORDER BY r.departure_time DESC;
```

### Calculate driver's average rating
```sql
SELECT u.first_name, u.last_name, AVG(r.rating) as avg_rating
FROM users u
LEFT JOIN reviews r ON u.id = r.reviewee_id
WHERE u.id = 1
GROUP BY u.id;
```

### Find matching rides for a passenger
```sql
SELECT r.*, u.first_name, u.rating
FROM rides r
JOIN users u ON r.driver_id = u.id
WHERE r.status = 'scheduled'
  AND r.available_seats > 0
  AND r.departure_time > NOW()
  AND ABS(r.start_lat - 40.7128) < 0.05
  AND ABS(r.start_lng - (-74.0060)) < 0.05
ORDER BY r.departure_time ASC
LIMIT 10;
```

## Performance Optimization

### Indexes Created
- `rides.driver_id` - Fast driver queries
- `rides.vehicle_id` - Fast vehicle queries
- `rides.departure_time` - Sort and filter by time
- `rides.status` - Filter by status
- `bookings.ride_id` - Find bookings for ride
- `bookings.passenger_id` - Find user's bookings
- `bookings.status` - Filter by status
- `vehicles.owner_id` - Find user's vehicles
- `reviews.booking_id` - Get ride reviews
- `payments.booking_id` - Get booking payments

### Tips for Performance
1. Always use indexes in WHERE clauses
2. Avoid SELECT * for large tables
3. Use LIMIT for result sets
4. Cache frequently accessed data
5. Consider partitioning large tables

## Backup and Recovery

### Create backup
```bash
pg_dump -U pooling_user vehicle_pooling > backup.sql
```

### Restore backup
```bash
psql -U pooling_user vehicle_pooling < backup.sql
```

## Data Cleanup

### Delete old rides
```sql
DELETE FROM rides 
WHERE status = 'completed' 
AND departure_time < NOW() - INTERVAL '90 days';
```

### Archive old reviews
```sql
DELETE FROM reviews 
WHERE created_at < NOW() - INTERVAL '1 year';
```
