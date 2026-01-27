import create from 'zustand';

const useStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  rides: [],
  setRides: (rides) => set({ rides }),

  bookings: [],
  setBookings: (bookings) => set({ bookings }),

  selectedRide: null,
  setSelectedRide: (ride) => set({ selectedRide: ride }),

  vehicles: [],
  setVehicles: (vehicles) => set({ vehicles }),
}));

export default useStore;
