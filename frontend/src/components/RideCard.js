import React from 'react';
import useStore from '../store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RideCard = ({ ride }) => {
  const navigate = useNavigate();
  const setSelectedRide = useStore((state) => state.setSelectedRide);

  const handleBookRide = () => {
    setSelectedRide(ride);
    navigate(`/book/${ride.id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="ride-card">
      <div className="ride-header">
        <div className="driver-info">
          <h3>{ride.driver_name}</h3>
          <div className="rating">
            <span className="stars">★★★★★</span>
            <span>{ride.driver_rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="vehicle-info">
          <p className="vehicle-model">{ride.vehicle_model}</p>
          <p className="vehicle-color">{ride.vehicle_color}</p>
        </div>
      </div>

      <div className="ride-details">
        <div className="location">
          <div className="start">
            <p className="label">From</p>
            <p className="address">{ride.start_address || `${ride.start_lat}, ${ride.start_lng}`}</p>
          </div>
          <div className="arrow">→</div>
          <div className="end">
            <p className="label">To</p>
            <p className="address">{ride.end_address || `${ride.end_lat}, ${ride.end_lng}`}</p>
          </div>
        </div>
      </div>

      <div className="ride-footer">
        <div className="time">
          <p className="label">Departure</p>
          <p className="value">{formatDate(ride.departure_time)}</p>
        </div>
        <div className="seats">
          <p className="label">Available Seats</p>
          <p className="value">{ride.available_seats}</p>
        </div>
        <div className="price">
          <p className="label">Per Seat</p>
          <p className="value">${ride.price_per_seat.toFixed(2)}</p>
        </div>
        <div className="match-score">
          <p className="label">Match</p>
          <p className="value">{ride.compatibilityScore}%</p>
        </div>
      </div>

      <button className="book-button" onClick={handleBookRide}>
        Book Ride
      </button>
    </div>
  );
};

export default RideCard;
