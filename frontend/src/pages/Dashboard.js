import React, { useState, useEffect } from 'react';
import useStore from '../store';
import { matchingAPI, vehiclesAPI } from '../api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const user = useStore((state) => state.user);
  const vehicles = useStore((state) => state.vehicles);
  const setVehicles = useStore((state) => state.setVehicles);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    licensePlate: '',
    model: '',
    color: '',
    seats: '',
    vehicleType: 'sedan'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recommendationsRes, vehiclesRes] = await Promise.all([
        matchingAPI.getStats(),
        matchingAPI.getRecommendations(5),
        vehiclesAPI.getVehicles()
      ]);

      setStats(statsRes.data);
      setRecommendations(recommendationsRes.data.recommendations);
      setVehicles(vehiclesRes.data.vehicles);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await vehiclesAPI.createVehicle(vehicleForm);
      toast.success('Vehicle added successfully');
      setVehicleForm({
        licensePlate: '',
        model: '',
        color: '',
        seats: '',
        vehicleType: 'sedan'
      });
      setShowAddVehicle(false);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add vehicle');
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome back, {user?.first_name}!</h1>

      <div className="dashboard-grid">
        <section className="stats-section">
          <h2>Platform Statistics</h2>
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-value">{stats?.total_available_rides || 0}</div>
              <div className="stat-label">Available Rides</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats?.total_bookings || 0}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {Number.isFinite(parseFloat(stats?.avg_seats_available))
                  ? parseFloat(stats.avg_seats_available).toFixed(1)
                  : '0.0'}
              </div>
              <div className="stat-label">Avg Seats Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats?.completed_rides || 0}</div>
              <div className="stat-label">Completed Rides</div>
            </div>
          </div>
        </section>

        <section className="vehicles-section">
          <h2>My Vehicles</h2>
          {vehicles.length === 0 ? (
            <p>No vehicles registered. {showAddVehicle ? '' : 'Add one to post rides!'}</p>
          ) : (
            <div className="vehicle-list">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="vehicle-item">
                  <p><strong>{vehicle.model}</strong></p>
                  <p>{vehicle.license_plate}</p>
                </div>
              ))}
            </div>
          )}

          {showAddVehicle ? (
            <form onSubmit={handleAddVehicle} className="vehicle-form">
              <input
                type="text"
                placeholder="License Plate"
                value={vehicleForm.licensePlate}
                onChange={(e) => setVehicleForm({...vehicleForm, licensePlate: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Model"
                value={vehicleForm.model}
                onChange={(e) => setVehicleForm({...vehicleForm, model: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Color"
                value={vehicleForm.color}
                onChange={(e) => setVehicleForm({...vehicleForm, color: e.target.value})}
              />
              <input
                type="number"
                placeholder="Number of Seats"
                value={vehicleForm.seats}
                onChange={(e) => setVehicleForm({...vehicleForm, seats: e.target.value})}
                required
              />
              <button type="submit" className="btn btn-primary">Add Vehicle</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddVehicle(false)}>Cancel</button>
            </form>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowAddVehicle(true)}>+ Add Vehicle</button>
          )}
        </section>

        <section className="recommendations-section">
          <h2>Recommended Rides</h2>
          {recommendations.length === 0 ? (
            <p>No recommendations available yet.</p>
          ) : (
            <div className="rides-mini-list">
              {recommendations.slice(0, 3).map((ride) => (
                <div key={ride.id} className="ride-mini-card">
                  <p><strong>{ride.driver_name}</strong></p>
                  <p>{ride.start_address} → {ride.end_address}</p>
                  <p className="price">
                    ${Number.isFinite(parseFloat(ride.price_per_seat))
                      ? parseFloat(ride.price_per_seat).toFixed(2)
                      : '0.00'}
                    /seat
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
