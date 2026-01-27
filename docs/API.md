# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All responses are JSON with the following format:
```json
{
  "data": {...},
  "error": null,
  "timestamp": "2024-01-27T..."
}
```

## Status Codes
- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Not authorized
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Server Error` - Server error

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response** (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Responses**:
- `400` - Missing required fields
- `409` - Email already registered

---

### POST /auth/login
Login to user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (200):
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "rating": 4.8
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Responses**:
- `400` - Missing email or password
- `401` - Invalid credentials

---

## Rides Endpoints

### POST /rides
Create a new ride (driver).

**Authentication**: Required

**Request Body**:
```json
{
  "vehicleId": 5,
  "startLat": 40.7128,
  "startLng": -74.0060,
  "endLat": 34.0522,
  "endLng": -118.2437,
  "startAddress": "NYC Downtown",
  "endAddress": "LA Airport",
  "departureTime": "2024-02-01T08:00:00Z",
  "availableSeats": 3,
  "pricePerSeat": 45.50,
  "notes": "Non-smoking ride"
}
```

**Response** (201):
```json
{
  "message": "Ride created successfully",
  "ride": {
    "id": 10,
    "driver_id": 1,
    "vehicle_id": 5,
    "start_lat": 40.7128,
    "start_lng": -74.0060,
    "end_lat": 34.0522,
    "end_lng": -118.2437,
    "available_seats": 3,
    "price_per_seat": 45.50,
    "status": "scheduled",
    "created_at": "2024-01-27T10:00:00Z"
  }
}
```

---

### GET /rides
Get all available rides.

**Query Parameters**:
- `status` (optional) - Filter by status (default: scheduled)
- `departureDate` (optional) - Filter by date (YYYY-MM-DD)
- `startLat`, `startLng` - Filter by start location (future feature)
- `endLat`, `endLng` - Filter by end location (future feature)

**Response** (200):
```json
{
  "rides": [
    {
      "id": 10,
      "driver_name": "John Doe",
      "driver_rating": 4.8,
      "vehicle_model": "Toyota Camry",
      "start_address": "NYC Downtown",
      "end_address": "LA Airport",
      "departure_time": "2024-02-01T08:00:00Z",
      "available_seats": 3,
      "price_per_seat": 45.50,
      "status": "scheduled"
    }
  ]
}
```

---

### GET /rides/:rideId
Get specific ride details with passengers.

**Response** (200):
```json
{
  "ride": {
    "id": 10,
    "driver_name": "John Doe",
    "driver_email": "john@example.com",
    "driver_rating": 4.8,
    "total_rides": 45,
    "vehicle_model": "Toyota Camry",
    "vehicle_seats": 5,
    "start_address": "NYC Downtown",
    "end_address": "LA Airport",
    "departure_time": "2024-02-01T08:00:00Z",
    "available_seats": 1,
    "price_per_seat": 45.50,
    "status": "scheduled"
  },
  "passengers": [
    {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "rating": 4.9,
      "seats_booked": 2,
      "pickup_address": "NY Train Station",
      "dropoff_address": "LA Terminal"
    }
  ]
}
```

---

### PUT /rides/:rideId/status
Update ride status (driver only).

**Authentication**: Required

**Request Body**:
```json
{
  "status": "in_progress"
}
```

**Valid Statuses**: `scheduled`, `in_progress`, `completed`, `cancelled`

**Response** (200):
```json
{
  "message": "Ride status updated",
  "ride": {
    "id": 10,
    "status": "in_progress"
  }
}
```

---

### DELETE /rides/:rideId
Cancel a ride (driver only).

**Authentication**: Required

**Response** (200):
```json
{
  "message": "Ride cancelled successfully"
}
```

---

## Bookings Endpoints

### POST /bookings
Book a ride (passenger).

**Authentication**: Required

**Request Body**:
```json
{
  "rideId": 10,
  "seatsBooked": 2,
  "pickupLat": 40.7300,
  "pickupLng": -74.0020,
  "dropoffLat": 34.0500,
  "dropoffLng": -118.2400,
  "pickupAddress": "NY Train Station",
  "dropoffAddress": "LA Terminal"
}
```

**Response** (201):
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": 20,
    "ride_id": 10,
    "passenger_id": 3,
    "seats_booked": 2,
    "total_price": 91.00,
    "status": "confirmed",
    "payment_status": "pending",
    "created_at": "2024-01-27T10:30:00Z"
  }
}
```

**Error Responses**:
- `400` - Not enough seats available / Can't book own ride
- `404` - Ride not found

---

### GET /bookings
Get user's bookings.

**Authentication**: Required

**Response** (200):
```json
{
  "bookings": [
    {
      "id": 20,
      "ride_id": 10,
      "driver_name": "John Doe",
      "driver_rating": 4.8,
      "vehicle_model": "Toyota Camry",
      "start_address": "NYC Downtown",
      "end_address": "LA Airport",
      "departure_time": "2024-02-01T08:00:00Z",
      "seats_booked": 2,
      "total_price": 91.00,
      "status": "confirmed",
      "payment_status": "pending"
    }
  ]
}
```

---

### DELETE /bookings/:bookingId
Cancel booking (passenger).

**Authentication**: Required

**Response** (200):
```json
{
  "message": "Booking cancelled successfully"
}
```

---

### PUT /bookings/:bookingId/confirm
Confirm booking (driver only).

**Authentication**: Required

**Response** (200):
```json
{
  "message": "Booking confirmed",
  "booking": {
    "id": 20,
    "status": "confirmed"
  }
}
```

---

## Matching Endpoints

### POST /matching/search
Search rides with intelligent matching algorithm.

**Authentication**: Required

**Request Body**:
```json
{
  "startLat": 40.7128,
  "startLng": -74.0060,
  "endLat": 34.0522,
  "endLng": -118.2437,
  "departureTime": "2024-02-01T08:00:00Z"
}
```

**Response** (200):
```json
{
  "matchCount": 5,
  "matches": [
    {
      "id": 10,
      "driver_name": "John Doe",
      "driver_rating": 4.8,
      "vehicle_model": "Toyota Camry",
      "vehicle_color": "Blue",
      "start_address": "NYC Downtown",
      "end_address": "LA Airport",
      "departure_time": "2024-02-01T08:00:00Z",
      "available_seats": 3,
      "price_per_seat": 45.50,
      "compatibilityScore": 92,
      "estimatedPickupDeviation": 0.5,
      "estimatedDropoffDeviation": 1.2,
      "timeDifferenceMinutes": 5
    }
  ]
}
```

---

### GET /matching/stats
Get platform statistics.

**Response** (200):
```json
{
  "total_available_rides": 245,
  "total_bookings": 1890,
  "avg_seats_available": 2.8,
  "completed_rides": 1650
}
```

---

### GET /matching/recommendations
Get personalized ride recommendations based on history.

**Authentication**: Required

**Query Parameters**:
- `limit` (optional) - Number of recommendations (default: 5)

**Response** (200):
```json
{
  "recommendations": [
    {
      "id": 15,
      "driver_name": "Jane Smith",
      "start_address": "Your usual pickup",
      "end_address": "Your usual dropoff",
      "compatibilityScore": 95
    }
  ]
}
```

---

## Vehicles Endpoints

### POST /vehicles
Register a vehicle (driver).

**Authentication**: Required

**Request Body**:
```json
{
  "licensePlate": "ABC123XY",
  "model": "Toyota Camry 2022",
  "color": "Blue",
  "seats": 5,
  "vehicleType": "sedan"
}
```

**Response** (201):
```json
{
  "vehicle": {
    "id": 5,
    "owner_id": 1,
    "license_plate": "ABC123XY",
    "model": "Toyota Camry 2022",
    "color": "Blue",
    "seats": 5,
    "vehicle_type": "sedan",
    "is_active": true,
    "created_at": "2024-01-27T10:00:00Z"
  }
}
```

---

### GET /vehicles
Get user's vehicles.

**Authentication**: Required

**Response** (200):
```json
{
  "vehicles": [
    {
      "id": 5,
      "license_plate": "ABC123XY",
      "model": "Toyota Camry 2022",
      "color": "Blue",
      "seats": 5,
      "vehicle_type": "sedan",
      "is_active": true
    }
  ]
}
```

---

## Users Endpoints

### GET /users/profile
Get user profile.

**Authentication**: Required

**Response** (200):
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "rating": 4.8,
    "total_rides": 45
  }
}
```

---

### PUT /users/profile
Update user profile.

**Authentication**: Required

**Request Body**:
```json
{
  "firstName": "Jonathan",
  "lastName": "Doe",
  "phone": "+9876543210"
}
```

**Response** (200):
```json
{
  "user": {
    "id": 1,
    "first_name": "Jonathan",
    "last_name": "Doe",
    "phone": "+9876543210"
  }
}
```

---

### GET /users/reviews
Get reviews received.

**Authentication**: Required

**Response** (200):
```json
{
  "reviews": [
    {
      "id": 50,
      "reviewer_name": "Jane Smith",
      "rating": 5,
      "comment": "Great driver, very friendly!",
      "created_at": "2024-01-25T14:30:00Z"
    }
  ]
}
```

---

## Payments Endpoints

### POST /payments/create-intent
Create a payment intent.

**Authentication**: Required

**Request Body**:
```json
{
  "bookingId": 20,
  "amount": 91.00
}
```

**Response** (201):
```json
{
  "message": "Payment intent created",
  "payment": {
    "id": 100,
    "booking_id": 20,
    "amount": 91.00,
    "currency": "USD",
    "status": "pending",
    "created_at": "2024-01-27T10:30:00Z"
  }
}
```

---

### POST /payments/confirm
Confirm a payment.

**Authentication**: Required

**Request Body**:
```json
{
  "paymentId": 100
}
```

**Response** (200):
```json
{
  "message": "Payment confirmed",
  "payment": {
    "id": 100,
    "status": "completed",
    "updated_at": "2024-01-27T10:35:00Z"
  }
}
```

---

## Error Handling

All errors follow this format:
```json
{
  "error": "Error message describing what went wrong",
  "statusCode": 400
}
```

Common errors:
- `"Missing authorization token provided"` - No token in header
- `"Invalid or expired token"` - Invalid JWT token
- `"Not authorized"` - User doesn't have permission
- `"Resource not found"` - Item doesn't exist

---

## Rate Limiting

Currently not implemented. Future versions will include:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Pagination

List endpoints support pagination (future implementation):
```
GET /rides?page=1&limit=20
```

---

## Sorting

Available sort parameters:
- `sortBy` - Field to sort by (e.g., departure_time, price_per_seat)
- `order` - `asc` or `desc`

Example:
```
GET /rides?sortBy=departure_time&order=asc
```

---

## Filtering

Advanced filtering (future implementation):
```
GET /matching/search
{
  "filters": {
    "minRating": 4.5,
    "maxPrice": 50,
    "amenities": ["wifi", "phone_charger"]
  }
}
```

---

## WebSocket Events (Socket.io)

### Client → Server

**join-ride**:
```javascript
socket.emit('join-ride', { rideId: 10 });
```

**location-update**:
```javascript
socket.emit('location-update', {
  rideId: 10,
  lat: 40.7200,
  lng: -74.0050,
  userId: 1
});
```

**ride-status-change**:
```javascript
socket.emit('ride-status-change', {
  rideId: 10,
  status: 'in_progress'
});
```

### Server → Client

**driver-location**:
```javascript
socket.on('driver-location', {
  lat: 40.7200,
  lng: -74.0050,
  userId: 1,
  timestamp: 1706339400000
});
```

**status-update**:
```javascript
socket.on('status-update', {
  status: 'in_progress',
  timestamp: 1706339400000
});
```

---

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Authentication and authorization
- Ride creation and search
- Booking system
- Matching algorithm
- Real-time updates
- Review system

### Planned Features
- v1.1.0: Payment integration
- v1.2.0: Google Maps integration
- v1.3.0: Email/SMS notifications
- v2.0.0: Mobile app
