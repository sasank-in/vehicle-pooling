import React, { useEffect, useState } from 'react';
import useStore from '../store';
import { usersAPI, vehiclesAPI } from '../api';
import { toast } from 'react-toastify';

const Profile = () => {
  const user = useStore((state) => state.user);
  const vehicles = useStore((state) => state.vehicles);
  const setVehicles = useStore((state) => state.setVehicles);
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchVehicles();
    fetchReviews();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await usersAPI.getProfile();
      setProfileData(response.data.user);
      setFormData(response.data.user);
    } catch (error) {
      toast.error('Failed to fetch profile');
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await vehiclesAPI.getVehicles();
      setVehicles(response.data.vehicles);
    } catch (error) {
      console.error('Failed to fetch vehicles');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await usersAPI.getReviews();
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        firstName: formData.first_name,
        lastName: formData.last_name,
        phone: formData.phone
      };
      await usersAPI.updateProfile(updateData);
      toast.success('Profile updated successfully');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-section">
        <h2>My Profile</h2>

        {editMode ? (
          <form onSubmit={handleUpdateProfile} className="edit-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-row">
              <label>Name:</label>
              <p>{profileData?.first_name} {profileData?.last_name}</p>
            </div>
            <div className="info-row">
              <label>Email:</label>
              <p>{profileData?.email}</p>
            </div>
            <div className="info-row">
              <label>Phone:</label>
              <p>{profileData?.phone || 'Not provided'}</p>
            </div>
            <div className="info-row">
              <label>Rating:</label>
              <p>{profileData?.rating?.toFixed(1)} / 5.0</p>
            </div>
            <div className="info-row">
              <label>Total Rides:</label>
              <p>{profileData?.total_rides}</p>
            </div>
            <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        )}
      </div>

      <div className="vehicles-section">
        <h2>My Vehicles</h2>
        {vehicles.length === 0 ? (
          <p>No vehicles registered yet.</p>
        ) : (
          <div className="vehicles-list">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card">
                <p><strong>{vehicle.model}</strong></p>
                <p>License Plate: {vehicle.license_plate}</p>
                <p>Color: {vehicle.color}</p>
                <p>Seats: {vehicle.seats}</p>
                <p>Type: {vehicle.vehicle_type}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="reviews-section">
        <h2>Reviews Received</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <p className="reviewer">{review.first_name} {review.last_name}</p>
                  <span className="rating">{'⭐'.repeat(review.rating)}</span>
                </div>
                <p className="comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
