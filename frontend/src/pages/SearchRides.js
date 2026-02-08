import React, { useState, useEffect } from 'react';
import useStore from '../store';
import { matchingAPI } from '../api';
import RideCard from '../components/RideCard';
import { toast } from 'react-toastify';

const SearchRides = () => {
  const [formData, setFormData] = useState({
    startLat: '',
    startLng: '',
    endLat: '',
    endLng: '',
    departureTime: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const rides = useStore((state) => state.rides);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await matchingAPI.searchRides(formData);
      setResults(response.data.matches);
      toast.success(`Found ${response.data.matchCount} matching rides`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-rides-container">
      <h2>Search Rides</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <label>Start Location (Lat)</label>
          <input
            type="number"
            name="startLat"
            step="0.0001"
            placeholder="Latitude"
            value={formData.startLat}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Location (Lng)</label>
          <input
            type="number"
            name="startLng"
            step="0.0001"
            placeholder="Longitude"
            value={formData.startLng}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Location (Lat)</label>
          <input
            type="number"
            name="endLat"
            step="0.0001"
            placeholder="Latitude"
            value={formData.endLat}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Location (Lng)</label>
          <input
            type="number"
            name="endLng"
            step="0.0001"
            placeholder="Longitude"
            value={formData.endLng}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Departure Time</label>
          <input
            type="datetime-local"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search Rides'}
        </button>
      </form>

      <div className="results">
        {results.length === 0 ? (
          <p>No rides found. Try adjusting your search parameters.</p>
        ) : (
          <div className="rides-list">
            {results.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchRides;
