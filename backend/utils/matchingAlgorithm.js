/**
 * Route Matching Algorithm
 * Matches passengers with available rides based on:
 * - Similar starting and ending locations (within radius)
 * - Compatible departure times
 * - Available seats
 * - Similar routes
 */

const pool = require('../config/database');

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Check if two routes are compatible
const areRoutesCompatible = (rideStart, rideEnd, passengerStart, passengerEnd, maxDeviationKm = 2) => {
  // Calculate distance from passenger pickup to ride start
  const pickupDeviation = calculateDistance(
    rideStart.lat, rideStart.lng,
    passengerStart.lat, passengerStart.lng
  );

  // Calculate distance from passenger dropoff to ride end
  const dropoffDeviation = calculateDistance(
    rideEnd.lat, rideEnd.lng,
    passengerEnd.lat, passengerEnd.lng
  );

  return pickupDeviation <= maxDeviationKm && dropoffDeviation <= maxDeviationKm;
};

// Check if departure times are compatible
const areTimesCompatible = (rideTime, passengerTime, toleranceMinutes = 30) => {
  const rideDeparture = new Date(rideTime).getTime();
  const passengerDeparture = new Date(passengerTime).getTime();
  const timeDiffMs = Math.abs(rideDeparture - passengerDeparture);
  return timeDiffMs <= toleranceMinutes * 60 * 1000;
};

// Main matching function
const findMatchesForPassenger = async (passengerStart, passengerEnd, departureTime, maxMatches = 5) => {
  try {
    // Query available rides
    const query = `
      SELECT 
        r.id,
        r.driver_id,
        r.vehicle_id,
        r.start_lat,
        r.start_lng,
        r.end_lat,
        r.end_lng,
        r.start_address,
        r.end_address,
        r.departure_time,
        r.available_seats,
        r.price_per_seat,
        u.first_name as driver_name,
        u.rating as driver_rating,
        v.model as vehicle_model,
        v.color as vehicle_color
      FROM rides r
      JOIN users u ON r.driver_id = u.id
      JOIN vehicles v ON r.vehicle_id = v.id
      WHERE r.status = 'scheduled'
      AND r.available_seats > 0
      AND r.departure_time > NOW()
      ORDER BY r.departure_time ASC
      LIMIT 50
    `;

    const result = await pool.query(query);
    const availableRides = result.rows;

    // Score and filter rides based on compatibility
    const matches = availableRides
      .map(ride => {
        const rideStart = { lat: ride.start_lat, lng: ride.start_lng };
        const rideEnd = { lat: ride.end_lat, lng: ride.end_lng };

        const routeCompatible = areRoutesCompatible(rideStart, rideEnd, passengerStart, passengerEnd);
        const timeCompatible = areTimesCompatible(ride.departure_time, departureTime);

        if (!routeCompatible || !timeCompatible) {
          return null;
        }

        // Calculate compatibility score (0-100)
        const pickupDeviation = calculateDistance(
          rideStart.lat, rideStart.lng,
          passengerStart.lat, passengerStart.lng
        );
        const dropoffDeviation = calculateDistance(
          rideEnd.lat, rideEnd.lng,
          passengerEnd.lat, passengerEnd.lng
        );
        const timeDiffMinutes = Math.abs(
          new Date(ride.departure_time).getTime() - new Date(departureTime).getTime()
        ) / (60 * 1000);

        // Score formula: prioritize close routes and similar times
        const routeScore = Math.max(0, 100 - (pickupDeviation + dropoffDeviation) * 20);
        const timeScore = Math.max(0, 100 - timeDiffMinutes * 2);
        const compatibilityScore = (routeScore * 0.6 + timeScore * 0.4);

        return {
          ...ride,
          compatibilityScore: Math.round(compatibilityScore),
          estimatedPickupDeviation: pickupDeviation,
          estimatedDropoffDeviation: dropoffDeviation,
          timeDifferenceMinutes: timeDiffMinutes
        };
      })
      .filter(ride => ride !== null)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, maxMatches);

    return matches;
  } catch (error) {
    console.error('Error finding matches:', error);
    throw error;
  }
};

// Find matches for a ride (passengers interested in booking)
const findPassengersForRide = async (rideId, maxMatches = 10) => {
  try {
    const rideResult = await pool.query(`
      SELECT start_lat, start_lng, end_lat, end_lng, departure_time, available_seats
      FROM rides
      WHERE id = $1
    `, [rideId]);

    if (rideResult.rows.length === 0) {
      throw new Error('Ride not found');
    }

    const ride = rideResult.rows[0];
    // This would typically query recently searched rides from a cache/search history
    // For now, returning a sample structure
    return {
      rideId,
      availableSeats: ride.available_seats,
      matches: []
    };
  } catch (error) {
    console.error('Error finding passengers:', error);
    throw error;
  }
};

module.exports = {
  findMatchesForPassenger,
  findPassengersForRide,
  calculateDistance,
  areRoutesCompatible,
  areTimesCompatible
};
