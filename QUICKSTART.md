# Quick Start Guide

Get the Vehicle Pooling platform running in 5 minutes!

## 1. Prerequisites
- Node.js v14+ 
- PostgreSQL v12+

## 2. Clone/Download Project
```bash
cd vehicle-pooling
```

## 3. Setup Backend (Terminal 1)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# Windows: notepad .env
# Mac: open -a TextEdit .env
# Linux: nano .env
```

Update these in `.env`:
```
DB_USER=pooling_user
DB_PASSWORD=your_password
```

```bash
# Create database in PostgreSQL
# In PostgreSQL terminal:
# CREATE DATABASE vehicle_pooling;
# CREATE USER pooling_user WITH PASSWORD 'your_password';
# GRANT ALL ON DATABASE vehicle_pooling TO pooling_user;

# Initialize database
npm run migrate

# Start server
npm run dev
```

✅ Backend running at http://localhost:5000

## 4. Setup Frontend (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend running at http://localhost:3000

## 5. Test the Platform

### Register a User
1. Go to http://localhost:3000
2. Click "Register"
3. Fill in details (e.g., email: test@example.com)
4. Click "Register"

### Post a Ride (as Driver)
1. Go to Dashboard
2. Click "+ Add Vehicle"
3. Fill vehicle details
4. Click "Post Ride"
5. Fill ride details:
   - Start: 40.7128, -74.0060 (NYC)
   - End: 34.0522, -118.2437 (LA)
   - Time: Tomorrow at 8:00 AM
   - Seats: 3
   - Price: $45 per seat
6. Click "Post Ride"

### Search & Book Rides (as Passenger)
1. Register second account
2. Click "Search Rides"
3. Fill search details matching the ride posted
4. Click "Search Rides"
5. Click "Book Ride"
6. Fill pickup/dropoff details
7. Select seats
8. Click "Confirm Booking"

### View Bookings
- Click "My Bookings" to see booked rides
- Can cancel upcoming bookings

### View Profile
- Click "Profile" to see:
  - Your information
  - Your vehicles (if driver)
  - Reviews received (if driver)

## 6. API Testing

### Test backend directly with curl:

Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"driver@test.com",
    "password":"password123",
    "firstName":"John",
    "lastName":"Doe"
  }'
```

Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"driver@test.com",
    "password":"password123"
  }'
```

## 7. Key Files

### Backend
- `server.js` - Main server file
- `config/database.js` - Database connection
- `utils/matchingAlgorithm.js` - Route matching logic
- `controllers/` - Business logic
- `routes/` - API endpoints

### Frontend
- `src/App.js` - Main app component
- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/api.js` - API client
- `src/store.js` - State management

### Docs
- `docs/README.md` - Full documentation
- `docs/SETUP.md` - Detailed setup guide
- `docs/API.md` - API reference
- `docs/MATCHING_ALGORITHM.md` - Algorithm details
- `docs/DATABASE_SCHEMA.md` - Database structure

## 8. Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process if needed
kill -9 <PID>

# Or change PORT in .env
```

### Database connection error
```bash
# Check PostgreSQL is running
psql -U postgres

# If not, start PostgreSQL service
# Windows: Services > PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Frontend won't start
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Start again
npm start
```

### CORS error
- Make sure backend is running on port 5000
- Check FRONTEND_URL in .env matches your frontend URL

## 9. Next Steps

1. **Customize**: 
   - Change colors in `frontend/src/App.css`
   - Update logos in `frontend/public/`
   - Modify ride pricing logic

2. **Add Features**:
   - Integrate Google Maps
   - Add payment processing (Stripe)
   - Email notifications
   - Mobile app

3. **Deploy**:
   - Backend: Heroku, AWS, DigitalOcean
   - Frontend: Vercel, Netlify, AWS

4. **Learn More**:
   - Read `docs/API.md` for all endpoints
   - Check `docs/MATCHING_ALGORITHM.md` for algorithm details
   - Review `docs/DATABASE_SCHEMA.md` for data structure

## 10. Demo Workflow

**5 minute demo**:

1. Register driver account
2. Add vehicle
3. Post ride from City A to City B
4. Logout
5. Register passenger account
6. Search for rides
7. Book the ride
8. View booking
9. Logout & login as driver
10. Confirm booking

## 11. Architecture Overview

```
┌─────────────────────────────────────────┐
│      Frontend (React)                   │
│      Port 3000                          │
└──────────────┬──────────────────────────┘
               │ HTTP/REST & WebSocket
               ↓
┌─────────────────────────────────────────┐
│      Backend (Node.js + Express)        │
│      Port 5000                          │
├─────────────────────────────────────────┤
│  - Authentication (JWT)                 │
│  - Matching Algorithm                   │
│  - Real-time Updates (Socket.io)        │
│  - Payment Processing (Ready)           │
└──────────────┬──────────────────────────┘
               │ SQL
               ↓
┌─────────────────────────────────────────┐
│      PostgreSQL Database                │
│      Port 5432                          │
│  - Users, Vehicles, Rides               │
│  - Bookings, Reviews, Payments          │
└─────────────────────────────────────────┘
```

## 12. Common Endpoints

**Authentication**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

**Rides**
- `POST /api/rides` - Post a ride
- `GET /api/rides` - List all rides
- `POST /api/matching/search` - Search with matching

**Bookings**
- `POST /api/bookings` - Book a ride
- `GET /api/bookings` - My bookings
- `DELETE /api/bookings/:id` - Cancel booking

**Users**
- `GET /api/users/profile` - My profile
- `PUT /api/users/profile` - Update profile

See `docs/API.md` for full reference.

## 13. Performance Tips

- Clear browser cache if changes not appearing
- Use private/incognito mode to test multiple accounts
- Check browser DevTools console for errors
- Backend logs in terminal window

## 14. Database Backup

```bash
# Backup
pg_dump -U pooling_user vehicle_pooling > backup.sql

# Restore
psql -U pooling_user vehicle_pooling < backup.sql
```

## 15. Reset Everything

```bash
# Kill all Node processes
pkill -f node

# Delete database
dropdb -U postgres vehicle_pooling

# Recreate database
createdb -U postgres vehicle_pooling

# Run migrations
cd backend
npm run migrate

# Start fresh
npm run dev
```

---

**Happy pooling! 🚗**

For detailed documentation, see the `docs/` folder.
