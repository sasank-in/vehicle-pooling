import React, { useState, useEffect } from 'react';
import useStore from '../store';
import { ridesAPI } from '../api';
import { toast } from 'react-toastify';

const PostRide = () => {
  const user = useStore((state) => state.user);
  const vehicles = useStore((state) => state.vehicles);
  const [formData, setFormData] = useState({
    vehicleId: '',
    startLat: '',
    startLng: '',
    endLat: '',
    endLng: '',
    startAddress: '',
    endAddress: '',
    departureTime: '',
    availableSeats: '',
    pricePerSeat: '',
    notes: ''
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
      const response = await ridesAPI.createRide(formData);
      toast.success('Ride posted successfully!');
      setFormData({
        vehicleId: '',
        startLat: '',
        startLng: '',
        endLat: '',
        endLng: '',
        startAddress: '',
        endAddress: '',
        departureTime: '',
        availableSeats: '',
        pricePerSeat: '',
        notes: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to post ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-ride-container">
      <h2>Post a Ride</h2>

      <form onSubmit={handleSubmit} className="ride-form">
        <div className="form-group">
          <label>Select Vehicle *</label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            required
          >
            <option value="">Choose a vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.model} ({vehicle.license_plate})
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Latitude *</label>
            <input
              type="number"
              name="startLat"
              step="0.0001"
              value={formData.startLat}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Longitude *</label>
            <input
              type="number"
              name="startLng"
              step="0.0001"
              value={formData.startLng}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Start Address</label>
          <input
            type="text"
            name="startAddress"
            value={formData.startAddress}
            onChange={handleChange}
            placeholder="e.g., Downtown Station"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>End Latitude *</label>
            <input
              type="number"
              name="endLat"
              step="0.0001"
              value={formData.endLat}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Longitude *</label>
            <input
              type="number"
              name="endLng"
              step="0.0001"
              value={formData.endLng}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>End Address</label>
          <input
            type="text"
            name="endAddress"
            value={formData.endAddress}
            onChange={handleChange}
            placeholder="e.g., City Center"
          />
        </div>

        <div className="form-group">
          <label>Departure Time *</label>
          <input
            type="datetime-local"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Available Seats *</label>
            <input
              type="number"
              name="availableSeats"
              min="1"
              value={formData.availableSeats}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price Per Seat ($) *</label>
            <input
              type="number"
              name="pricePerSeat"
              step="0.01"
              min="0"
              value={formData.pricePerSeat}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional information about the ride..."
            rows="3"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Posting...' : 'Post Ride'}
        </button>
      </form>
    </div>
  );
};

export default PostRide;
