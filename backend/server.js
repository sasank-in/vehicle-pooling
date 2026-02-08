const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const rideRoutes = require('./routes/rides');
const matchingRoutes = require('./routes/matching');
const bookingRoutes = require('./routes/bookings');
const vehicleRoutes = require('./routes/vehicles');
const paymentRoutes = require('./routes/payments');

// Initialize app
const app = express();
const server = http.createServer(app);
const defaultOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const envOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = envOrigins.length > 0 ? envOrigins : defaultOrigins;

const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store socket.io in app for route access
app.io = io;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User joins a ride room for real-time updates
  socket.on('join-ride', (rideId) => {
    socket.join(`ride-${rideId}`);
    console.log(`User ${socket.id} joined ride ${rideId}`);
  });

  // Broadcast ride location updates
  socket.on('location-update', (data) => {
    const { rideId, lat, lng, userId } = data;
    io.to(`ride-${rideId}`).emit('driver-location', { lat, lng, userId, timestamp: Date.now() });
  });

  // Handle ride status changes
  socket.on('ride-status-change', (data) => {
    const { rideId, status } = data;
    io.to(`ride-${rideId}`).emit('status-update', { status, timestamp: Date.now() });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Vehicle Pooling Backend running on port ${PORT}`);
});

module.exports = app;
