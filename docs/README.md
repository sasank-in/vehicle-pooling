# Vehicle Pooling Platform

A full-stack ride-sharing application that intelligently matches passengers with similar routes and departure times, reducing costs, traffic, and environmental impact.

## Features

### Core Features
- **Smart Route Matching**: Advanced algorithm matches passengers based on:
  - Geographic proximity (within 2km deviation tolerance)
  - Departure time compatibility (±30 minutes)
  - Available seats and pricing
  - Compatibility scoring (0-100%)

- **User Management**:
  - Registration and authentication with JWT
  - User profiles with ratings and reviews
  - Vehicle management for drivers
  - Travel history and preferences

- **Ride Management**:
  - Post rides with flexible pricing
  - Search and filter available rides
  - Real-time seat availability
  - Ride status tracking (scheduled, in-progress, completed, cancelled)

- **Booking System**:
  - Easy one-click bookings
  - Flexible seat selection
  - Custom pickup/dropoff locations
  - Payment integration ready

- **Real-time Features**:
  - Socket.io integration for live updates
  - Driver location tracking
  - Ride status notifications
  - Live seat availability updates

- **Review System**:
  - Rate drivers and passengers (1-5 stars)
  - Written reviews and comments
  - Community trust building

## Technology Stack

### Backend
- **Node.js & Express.js**: REST API server
- **PostgreSQL**: Relational database
- **Socket.io**: Real-time communication
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Joi**: Data validation

### Frontend
- **React 18**: UI framework
- **React Router v6**: Navigation
- **Zustand**: State management
- **Axios**: HTTP client
- **React Toastify**: Notifications
- **Socket.io Client**: Real-time updates

### Database
- PostgreSQL with comprehensive schema
- Optimized indexes for performance
- Relations for users, vehicles, rides, bookings, reviews, and payments

## Project Structure

```
vehicle-pooling/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── schema.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── rideController.js
│   │   ├── bookingController.js
│   │   └── matchingController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── rides.js
│   │   ├── bookings.js
│   │   ├── matching.js
│   │   ├── vehicles.js
│   │   ├── users.js
│   │   └── payments.js
│   ├── utils/
│   │   └── matchingAlgorithm.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── SearchRides.js
│   │   │   ├── PostRide.js
│   │   │   ├── BookRide.js
│   │   │   ├── MyBookings.js
│   │   │   └── Profile.js
│   │   ├── components/
│   │   │   ├── Navigation.js
│   │   │   ├── RideCard.js
│   │   │   └── ProtectedRoute.js
│   │   ├── api.js
│   │   ├── store.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
└── docs/
    ├── README.md
    ├── API.md
    ├── SETUP.md
    ├── MATCHING_ALGORITHM.md
    └── DATABASE_SCHEMA.md
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment**:
```bash
cp .env.example .env
```
Edit `.env` with your database credentials and API keys.

4. **Initialize database**:
```bash
npm run migrate
```

5. **Start server**:
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment**:
Create `.env.local`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start development server**:
```bash
npm start
```
Application opens at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Rides
- `POST /api/rides` - Create ride (driver)
- `GET /api/rides` - List available rides
- `GET /api/rides/:rideId` - Get ride details
- `PUT /api/rides/:rideId/status` - Update ride status
- `DELETE /api/rides/:rideId` - Cancel ride

### Bookings
- `POST /api/bookings` - Create booking (passenger)
- `GET /api/bookings` - Get user's bookings
- `DELETE /api/bookings/:bookingId` - Cancel booking
- `PUT /api/bookings/:bookingId/confirm` - Confirm booking

### Matching
- `POST /api/matching/search` - Search rides with matching algorithm
- `GET /api/matching/stats` - Get platform statistics
- `GET /api/matching/recommendations` - Get personalized recommendations

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/reviews` - Get user's reviews

### Vehicles
- `POST /api/vehicles` - Register vehicle
- `GET /api/vehicles` - Get user's vehicles

### Payments
- `POST /api/payments/create-intent` - Create payment
- `POST /api/payments/confirm` - Confirm payment

## Matching Algorithm

The platform uses a sophisticated matching algorithm that:

1. **Calculates Geographic Distance**: Uses Haversine formula to determine actual distance between coordinates
2. **Scores Route Compatibility**: Assigns points based on how close pickup/dropoff locations are
3. **Evaluates Time Compatibility**: Matches rides with similar departure times
4. **Generates Compatibility Score**: 0-100% score combining:
   - Route similarity (60% weight)
   - Time proximity (40% weight)

### Route Matching Parameters
- **Max Pickup Deviation**: 2 km from rider's start location
- **Max Dropoff Deviation**: 2 km from rider's end location
- **Time Tolerance**: ±30 minutes from desired departure time

## Database Schema

### Tables
- **users**: User accounts and profiles
- **vehicles**: Vehicle information for drivers
- **rides**: Posted rides with routes and pricing
- **bookings**: Passenger bookings for rides
- **reviews**: User ratings and comments
- **payments**: Payment tracking and history

## Authentication

The platform uses JWT (JSON Web Tokens) for secure authentication:
- Tokens valid for 7 days (configurable)
- Password hashing with bcryptjs
- Middleware validates tokens on protected routes

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vehicle_pooling
DB_USER=pooling_user
DB_PASSWORD=your_password

PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

GOOGLE_MAPS_API_KEY=your_key
STRIPE_PUBLIC_KEY=your_key
STRIPE_SECRET_KEY=your_key
FRONTEND_URL=http://localhost:3000
```

## Real-time Features

### Socket.io Events
- `join-ride`: Join ride room for real-time updates
- `location-update`: Broadcast driver location
- `ride-status-change`: Update ride status
- `driver-location`: Receive driver location updates
- `status-update`: Receive ride status changes

## Future Enhancements

- [x] Route matching algorithm
- [x] User authentication
- [x] Booking system
- [ ] Payment integration (Stripe/PayPal)
- [ ] Google Maps integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Advanced filters (music preference, no smoking, etc.)
- [ ] Driver verification system
- [ ] Insurance integration

## Testing

### Run tests
```bash
npm test
```

### Test coverage
```bash
npm test -- --coverage
```

## Deployment

### Backend
```bash
npm run build
npm start
```

### Frontend
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@vehiclepooling.com or open an issue on GitHub.

## Roadmap

- Q1 2024: Initial MVP launch
- Q2 2024: Mobile app beta
- Q3 2024: Payment integration
- Q4 2024: Advanced matching features
