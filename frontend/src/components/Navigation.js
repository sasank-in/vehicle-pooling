import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store';

const Navigation = () => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🚗 Vehicle Pooling
        </Link>

        <ul className="nav-menu">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/search" className="nav-link">Search Rides</Link>
              </li>
              <li className="nav-item">
                <Link to="/post" className="nav-link">Post Ride</Link>
              </li>
              <li className="nav-item">
                <Link to="/bookings" className="nav-link">My Bookings</Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">Profile</Link>
              </li>
              <li className="nav-item">
                <button className="nav-link logout-btn" onClick={() => {
                  logout();
                  window.location.href = '/';
                }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link register-link">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
