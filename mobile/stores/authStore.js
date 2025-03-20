import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the base URL for API calls
const API_URL = 'http://localhost:3000/api/auth';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  // Initialize authentication state from storage
  init: async () => {
    try {
      set({ isLoading: true });
      const token = await AsyncStorage.getItem('userToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        // Set auth header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        set({
          token,
          user: JSON.parse(userData),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },

  // Register a new user
  registerUser: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/register`, userData);
      
      const { token, user } = response.data;
      
      // Set auth header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Save to storage
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      return { success: false, message: errorMessage };
    }
  },

  // Login user
  loginUser: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/login`, credentials);
      
      const { token, user } = response.data;
      
      // Set auth header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Save to storage
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      return { success: false, message: errorMessage };
    }
  },

  // Logout user
  logoutUser: async () => {
    try {
      set({ isLoading: true });
      
      // Call logout API if needed
      await axios.post(`${API_URL}/logout`);
      
      // Remove auth header
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear storage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still clear local state even if API call fails
      delete axios.defaults.headers.common['Authorization'];
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      return { success: true };
    }
  },

  // Update user profile
  updateUserProfile: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.put(`${API_URL}/profile`, userData);
      
      const updatedUser = response.data.user;
      
      // Update storage
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
      set({
        user: updatedUser,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      return { success: false, message: errorMessage };
    }
  },

  // Clear any error messages
  clearError: () => set({ error: null }),
}));

export default useAuthStore;