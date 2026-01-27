import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store';
import { bookingsAPI } from '../api';
import { toast } from 'react-toastify';

const BookRide = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const selectedRide = useStore((state) => state.selectedRide);
  const [formData, setFormData] = useState({
    seatsBooked: 1,
    pickupLat: '',
    pickupLng: '',
    dropoffLat: '',
    dropoffLng: '',
    pickupAddress: '',
    dropoffAddress: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        rideId: parseInt(rideId),
        ...formData,
        pickupLat: parseFloat(formData.pickupLat),
        pickupLng: parseFloat(formData.pickupLng),
        dropoffLat: parseFloat(formData.dropoffLat),
        dropoffLng: parseFloat(formData.dropoffLng),
        seatsBooked: parseInt(formData.seatsBooked)
      };

      const response = await bookingsAPI.createBooking(bookingData);
      toast.success('Booking confirmed!');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRide) {
    return <div>Loading ride details...</div>;
  }

  const totalPrice = (selectedRide.price_per_seat * parseInt(formData.seatsBooked || 1)).toFixed(2);

  return (
    <div className="book-ride-container">
      <h2>Book Ride</h2>

      <div className="ride-summary">
        <h3>Ride Summary</h3>
        <p><strong>Driver:</strong> {selectedRide.driver_name}</p>
        <p><strong>Vehicle:</strong> {selectedRide.vehicle_model} ({selectedRide.vehicle_color})</p>
        <p><strong>From:</strong> {selectedRide.start_address}</p>
        <p><strong>To:</strong> {selectedRide.end_address}</p>
        <p><strong>Departure:</strong> {new Date(selectedRide.departure_time).toLocaleString()}</p>
        <p><strong>Price per seat:</strong> ${selectedRide.price_per_seat.toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Number of Seats *</label>
          <select
            name="seatsBooked"
            value={formData.seatsBooked}
            onChange={handleChange}
            required
          >
            {Array.from({ length: selectedRide.available_seats }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Pickup Latitude *</label>
            <input
              type="number"
              name="pickupLat"
              step="0.0001"
              value={formData.pickupLat}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Pickup Longitude *</label>
            <input
              type="number"
              name="pickupLng"
              step="0.0001"
              value={formData.pickupLng}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Pickup Address</label>
          <input
            type="text"
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Dropoff Latitude *</label>
            <input
              type="number"
              name="dropoffLat"
              step="0.0001"
              value={formData.dropoffLat}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Dropoff Longitude *</label>
            <input
              type="number"
              name="dropoffLng"
              step="0.0001"
              value={formData.dropoffLng}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Dropoff Address</label>
          <input
            type="text"
            name="dropoffAddress"
            value={formData.dropoffAddress}
            onChange={handleChange}
          />
        </div>

        <div className="price-summary">
          <p>Total Price: <strong>${totalPrice}</strong></p>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookRide;
