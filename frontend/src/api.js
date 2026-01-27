import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const ridesAPI = {
  createRide: (data) => api.post('/rides', data),
  getAllRides: (params) => api.get('/rides', { params }),
  getRideDetails: (rideId) => api.get(`/rides/${rideId}`),
  updateRideStatus: (rideId, data) => api.put(`/rides/${rideId}/status`, data),
  cancelRide: (rideId) => api.delete(`/rides/${rideId}`),
};

export const bookingsAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getUserBookings: () => api.get('/bookings'),
  cancelBooking: (bookingId) => api.delete(`/bookings/${bookingId}`),
  confirmBooking: (bookingId) => api.put(`/bookings/${bookingId}/confirm`),
};

export const matchingAPI = {
  searchRides: (data) => api.post('/matching/search', data),
  getStats: () => api.get('/matching/stats'),
  getRecommendations: (limit) => api.get('/matching/recommendations', { params: { limit } }),
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getReviews: () => api.get('/users/reviews'),
};

export const vehiclesAPI = {
  createVehicle: (data) => api.post('/vehicles', data),
  getVehicles: () => api.get('/vehicles'),
};

export const paymentsAPI = {
  createPaymentIntent: (data) => api.post('/payments/create-intent', data),
  confirmPayment: (data) => api.post('/payments/confirm', data),
};

export default api;
