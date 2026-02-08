import React, { useEffect, useState } from 'react';
import useStore from '../store';
import { bookingsAPI } from '../api';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const bookings = useStore((state) => state.bookings);
  const setBookings = useStore((state) => state.setBookings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getUserBookings();
      setBookings(response.data.bookings);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingsAPI.cancelBooking(bookingId);
        toast.success('Booking cancelled');
        fetchBookings();
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>You haven't booked any rides yet.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="booking-header">
                <h3>{booking.driver_name}</h3>
                <span className={`status ${booking.status}`}>{booking.status}</span>
              </div>

              <div className="booking-details">
                <div className="detail">
                  <label>From:</label>
                  <p>{booking.start_address}</p>
                </div>
                <div className="detail">
                  <label>To:</label>
                  <p>{booking.end_address}</p>
                </div>
                <div className="detail">
                  <label>Departure:</label>
                  <p>{new Date(booking.departure_time).toLocaleString()}</p>
                </div>
                <div className="detail">
                  <label>Seats:</label>
                  <p>{booking.seats_booked}</p>
                </div>
                <div className="detail">
                  <label>Total Price:</label>
                  <p>
                    ${Number.isFinite(parseFloat(booking.total_price))
                      ? parseFloat(booking.total_price).toFixed(2)
                      : '0.00'}
                  </p>
                </div>
                <div className="detail">
                  <label>Vehicle:</label>
                  <p>{booking.vehicle_model}</p>
                </div>
              </div>

              {booking.status === 'confirmed' && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
