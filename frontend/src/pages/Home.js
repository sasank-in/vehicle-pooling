import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Smart Vehicle Pooling Platform</h1>
        <p>Share rides, save money, reduce traffic and emissions</p>
        <div className="hero-buttons">
          <Link to="/search" className="btn btn-primary">Find a Ride</Link>
          <Link to="/post" className="btn btn-secondary">Post a Ride</Link>
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Matching</h3>
            <p>Our algorithm matches passengers with similar routes and departure times</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Save Money</h3>
            <p>Share costs with other passengers and reduce your travel expenses</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Eco-Friendly</h3>
            <p>Reduce emissions by sharing rides and helping the environment</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Trusted Community</h3>
            <p>Rate and review drivers and passengers for a safer experience</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Share a Ride?</h2>
        <p>Join thousands of users saving money and time</p>
        <Link to="/register" className="btn btn-primary">Get Started Today</Link>
      </section>
    </div>
  );
};

export default Home;
