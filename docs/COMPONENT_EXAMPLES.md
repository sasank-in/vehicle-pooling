# Component Examples - Implementation Guide

## Button Components

### Primary Button
```jsx
<button className="btn btn-primary">
  Book Ride
</button>
```

### Secondary Button
```jsx
<button className="btn btn-secondary">
  Learn More
</button>
```

### Success Button
```jsx
<button className="btn btn-success">
  Confirm Booking
</button>
```

### Danger Button
```jsx
<button className="btn btn-danger">
  Cancel Ride
</button>
```

### Large Button
```jsx
<button className="btn btn-primary btn-lg">
  Get Started Today
</button>
```

### Block Button
```jsx
<button className="btn btn-primary btn-block">
  Submit
</button>
```

---

## Card Components

### Basic Card
```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</div>
```

### Feature Card
```jsx
<div className="feature-card">
  <div className="feature-icon">🔍</div>
  <h3>Smart Matching</h3>
  <p>Our algorithm matches passengers with similar routes</p>
</div>
```

### Stat Card
```jsx
<div className="stat-card">
  <div className="stat-value">245</div>
  <div className="stat-label">Available Rides</div>
</div>
```

### Ride Card
```jsx
<div className="ride-card">
  <div className="ride-header">
    <div className="driver-info">
      <div className="driver-avatar">JD</div>
      <div className="driver-details">
        <div className="driver-name">John Doe</div>
        <div className="driver-rating">
          <span className="star">⭐</span>
          <span>4.8</span>
        </div>
      </div>
    </div>
    <div className="ride-price">$45.50</div>
  </div>
  
  <div className="ride-details">
    <div className="location">
      <div>
        <p className="label">From</p>
        <p className="address">Downtown Station</p>
      </div>
      <div className="arrow">→</div>
      <div>
        <p className="label">To</p>
        <p className="address">Airport Terminal</p>
      </div>
    </div>
  </div>
  
  <div className="ride-footer">
    <div>
      <p className="label">Departure</p>
      <p className="value">Feb 1, 8:00 AM</p>
    </div>
    <div>
      <p className="label">Seats</p>
      <p className="value">3</p>
    </div>
    <div>
      <p className="label">Match</p>
      <p className="value">92%</p>
    </div>
  </div>
  
  <button className="book-button">Book Ride</button>
</div>
```

---

## Form Components

### Text Input
```jsx
<div className="form-group">
  <label>Email Address</label>
  <input 
    type="email" 
    placeholder="Enter your email"
    required
  />
</div>
```

### Select Dropdown
```jsx
<div className="form-group">
  <label>Select Vehicle</label>
  <select required>
    <option value="">Choose a vehicle</option>
    <option value="1">Toyota Camry (ABC123)</option>
    <option value="2">Honda Accord (XYZ789)</option>
  </select>
</div>
```

### Textarea
```jsx
<div className="form-group">
  <label>Notes</label>
  <textarea 
    placeholder="Any additional information..."
    rows="3"
  />
</div>
```

### Form Row (Two Columns)
```jsx
<div className="form-row">
  <div className="form-group">
    <label>Start Latitude</label>
    <input type="number" step="0.0001" required />
  </div>
  <div className="form-group">
    <label>Start Longitude</label>
    <input type="number" step="0.0001" required />
  </div>
</div>
```

### Form Actions
```jsx
<div className="form-actions">
  <button type="submit">Save Changes</button>
  <button type="button">Cancel</button>
</div>
```

---

## Status & Badge Components

### Status Badges
```jsx
<span className="status confirmed">Confirmed</span>
<span className="status cancelled">Cancelled</span>
<span className="status pending">Pending</span>
```

### Badge Components
```jsx
<span className="badge badge-primary">New</span>
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-danger">Cancelled</span>
```

---

## Navigation Components

### Main Navigation
```jsx
<nav className="navbar">
  <div className="nav-container">
    <Link to="/" className="nav-logo">
      🚗 Vehicle Pooling
    </Link>
    
    <ul className="nav-menu">
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
        <button className="nav-link logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </li>
    </ul>
  </div>
</nav>
```

---

## Layout Components

### Hero Section
```jsx
<section className="hero">
  <h1>Smart Vehicle Pooling Platform</h1>
  <p>Share rides, save money, reduce traffic and emissions</p>
  <div className="hero-buttons">
    <Link to="/search" className="btn btn-primary btn-lg">
      Find a Ride
    </Link>
    <Link to="/post" className="btn btn-secondary btn-lg">
      Post a Ride
    </Link>
  </div>
</section>
```

### Features Grid
```jsx
<section className="features">
  <h2>How It Works</h2>
  <div className="features-grid">
    <div className="feature-card">
      <div className="feature-icon">🔍</div>
      <h3>Smart Matching</h3>
      <p>Our algorithm matches passengers with similar routes</p>
    </div>
    <div className="feature-card">
      <div className="feature-icon">💰</div>
      <h3>Save Money</h3>
      <p>Share costs with other passengers</p>
    </div>
    <div className="feature-card">
      <div className="feature-icon">🌍</div>
      <h3>Eco-Friendly</h3>
      <p>Reduce emissions by sharing rides</p>
    </div>
    <div className="feature-card">
      <div className="feature-icon">⭐</div>
      <h3>Trusted Community</h3>
      <p>Rate and review for a safer experience</p>
    </div>
  </div>
</section>
```

### CTA Section
```jsx
<section className="cta">
  <h2>Ready to Share a Ride?</h2>
  <p>Join thousands of users saving money and time</p>
  <Link to="/register" className="btn btn-primary btn-lg">
    Get Started Today
  </Link>
</section>
```

---

## Dashboard Components

### Stats Section
```jsx
<section className="stats-section">
  <h2>Platform Statistics</h2>
  <div className="stats-cards">
    <div className="stat-card">
      <div className="stat-value">245</div>
      <div className="stat-label">Available Rides</div>
    </div>
    <div className="stat-card">
      <div className="stat-value">1,890</div>
      <div className="stat-label">Total Bookings</div>
    </div>
    <div className="stat-card">
      <div className="stat-value">2.8</div>
      <div className="stat-label">Avg Seats Available</div>
    </div>
    <div className="stat-card">
      <div className="stat-value">1,650</div>
      <div className="stat-label">Completed Rides</div>
    </div>
  </div>
</section>
```

### Vehicle Section
```jsx
<section className="vehicles-section">
  <h2>My Vehicles</h2>
  <div className="vehicle-list">
    <div className="vehicle-card">
      <p><strong>Toyota Camry 2022</strong></p>
      <p>License Plate: ABC123XY</p>
      <p>Color: Blue</p>
      <p>Seats: 5</p>
      <p>Type: Sedan</p>
    </div>
  </div>
  <button className="btn btn-primary">+ Add Vehicle</button>
</section>
```

---

## Booking Components

### Booking Item
```jsx
<div className="booking-item">
  <div className="booking-header">
    <h3>John Doe</h3>
    <span className="status confirmed">Confirmed</span>
  </div>
  
  <div className="booking-details">
    <div className="detail">
      <label>From:</label>
      <p>Downtown Station</p>
    </div>
    <div className="detail">
      <label>To:</label>
      <p>Airport Terminal</p>
    </div>
    <div className="detail">
      <label>Departure:</label>
      <p>Feb 1, 2024 8:00 AM</p>
    </div>
    <div className="detail">
      <label>Seats:</label>
      <p>2</p>
    </div>
    <div className="detail">
      <label>Total Price:</label>
      <p>$91.00</p>
    </div>
  </div>
  
  <button className="cancel-btn">Cancel Booking</button>
</div>
```

### Ride Summary (for booking page)
```jsx
<div className="ride-summary">
  <h3>Ride Summary</h3>
  <p><strong>Driver:</strong> John Doe</p>
  <p><strong>Vehicle:</strong> Toyota Camry (Blue)</p>
  <p><strong>From:</strong> Downtown Station</p>
  <p><strong>To:</strong> Airport Terminal</p>
  <p><strong>Departure:</strong> Feb 1, 2024 8:00 AM</p>
  <p><strong>Price per seat:</strong> $45.50</p>
</div>
```

### Price Summary
```jsx
<div className="price-summary">
  <p>Total Price: <strong>$91.00</strong></p>
</div>
```

---

## Profile Components

### Profile Info
```jsx
<div className="profile-section">
  <h2>My Profile</h2>
  <div className="profile-info">
    <div className="info-row">
      <label>Name:</label>
      <p>John Doe</p>
    </div>
    <div className="info-row">
      <label>Email:</label>
      <p>john@example.com</p>
    </div>
    <div className="info-row">
      <label>Phone:</label>
      <p>+1234567890</p>
    </div>
    <div className="info-row">
      <label>Rating:</label>
      <p>4.8 / 5.0</p>
    </div>
    <div className="info-row">
      <label>Total Rides:</label>
      <p>45</p>
    </div>
  </div>
  <button className="edit-btn">Edit Profile</button>
</div>
```

### Review Card
```jsx
<div className="review-card">
  <div className="review-header">
    <p className="reviewer">Jane Smith</p>
    <span className="rating">⭐⭐⭐⭐⭐</span>
  </div>
  <p className="comment">Great driver, very friendly and punctual!</p>
</div>
```

---

## Alert Components

### Success Alert
```jsx
<div className="alert alert-success">
  Your booking has been confirmed successfully!
</div>
```

### Error Alert
```jsx
<div className="alert alert-error">
  Failed to process your request. Please try again.
</div>
```

### Warning Alert
```jsx
<div className="alert alert-warning">
  Your payment is pending. Please complete the transaction.
</div>
```

---

## Loading States

### Loading Spinner
```jsx
<div className="loading">
  <div className="spinner"></div>
  <p>Loading rides...</p>
</div>
```

---

## Empty States

### No Results
```jsx
<div className="empty-state">
  <div className="empty-state-icon">🔍</div>
  <h3>No rides found</h3>
  <p>Try adjusting your search parameters</p>
  <button className="btn btn-primary">Search Again</button>
</div>
```

---

## Utility Classes

### Text Alignment
```jsx
<div className="text-center">Centered text</div>
<div className="text-left">Left aligned text</div>
<div className="text-right">Right aligned text</div>
```

### Spacing
```jsx
<div className="mt-2">Margin top 2rem</div>
<div className="mb-3">Margin bottom 3rem</div>
<div className="p-2">Padding 2rem</div>
```

---

## Responsive Patterns

### Mobile-First Grid
```jsx
<div className="features-grid">
  {/* Automatically adjusts from 1 column (mobile) to 4 columns (desktop) */}
  <div className="feature-card">...</div>
  <div className="feature-card">...</div>
  <div className="feature-card">...</div>
  <div className="feature-card">...</div>
</div>
```

### Responsive Form Row
```jsx
<div className="form-row">
  {/* Two columns on desktop, stacks on mobile */}
  <div className="form-group">...</div>
  <div className="form-group">...</div>
</div>
```

---

## Animation Examples

### Hover Lift Effect
```css
.card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}
```

### Button Ripple Effect
```css
.btn::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
}
```

### Fade In Animation
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease;
}
```

---

## Best Practices

### Component Structure
1. Always use semantic HTML
2. Include proper ARIA labels
3. Maintain consistent spacing
4. Use descriptive class names
5. Keep components modular

### Accessibility
1. Include focus states
2. Use proper heading hierarchy
3. Add alt text for images
4. Ensure keyboard navigation
5. Maintain color contrast

### Performance
1. Use CSS transforms for animations
2. Avoid layout thrashing
3. Optimize images
4. Minimize repaints
5. Use will-change sparingly

---

## Testing Checklist

- [ ] Component renders correctly
- [ ] Responsive on all breakpoints
- [ ] Hover states work
- [ ] Focus states visible
- [ ] Keyboard accessible
- [ ] Screen reader compatible
- [ ] Colors have proper contrast
- [ ] Animations are smooth
- [ ] Loading states display
- [ ] Error states handled

---

**Note**: All examples use the professional classic theme defined in App.css. Customize colors, spacing, and styles according to your brand guidelines while maintaining the established design system.
