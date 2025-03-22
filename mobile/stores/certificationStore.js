import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from './authStore';

const API_URL = 'http://localhost:3000/api'; // Replace with your actual IP

const useCertificationStore = create((set) => ({
  enrolledCertifications: [],
  certifications: [],
  isLoading: false,
  error: null,

  fetchCertifications: async () => {
    try {
      set({ isLoading: true });
      const { token } = useAuthStore.getState();
      if (!token) {
        console.log('No token available, skipping fetchCertifications');
        set({ certifications: [], isLoading: false });
        return;
      }

      const url = `${API_URL}/certifications`;
      console.log('Fetching certifications from:', url, 'with token:', token);
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Certifications response:', response.data);
      set({ certifications: response.data, isLoading: false });
    } catch (error) {
      console.error('Fetch certifications error:', error.message, error.response?.data);
      set({ certifications: [], isLoading: false, error: error.message });
    }
  },

  fetchEnrolledCertifications: async () => {
    try {
      set({ isLoading: true });
      const { token } = useAuthStore.getState();
      if (!token) {
        console.log('No token available, skipping fetchEnrolledCertifications');
        set({ enrolledCertifications: [], isLoading: false });
        return;
      }

      const url = `${API_URL}/certifications/user/enrolled`;
      console.log('Fetching enrolled from:', url, 'with token:', token);
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Enrolled certifications response:', response.data);
      set({ enrolledCertifications: response.data, isLoading: false });
    } catch (error) {
      console.error('Fetch enrolled error:', error.message, error.response?.data);
      set({ enrolledCertifications: [], isLoading: false, error: error.message });
    }
  },

  enrollInCertification: async (certificationId) => {
    try {
      set({ isLoading: true });
      const { token } = useAuthStore.getState();
      if (!token) throw new Error('No authentication token available');

      const url = `${API_URL}/certifications/${certificationId}/enroll`;
      console.log('Enrolling at:', url, 'with token:', token);
      const response = await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Enrollment response:', response.data);

      set((state) => ({
        enrolledCertifications: [...state.enrolledCertifications, response.data],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error enrolling in certification:', error.message, error.response?.data);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  fetchModule: async (moduleId) => {
    try {
      set({ isLoading: true });
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token available, skipping fetchModule');
        set({ isLoading: false });
        return;
      }

      const url = `${API_URL}/modules/${moduleId}`;
      console.log('Fetching module from:', url, 'with token:', token);
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Module response:', response.data);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error('Error fetching module:', error.message, error.response?.data);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
}));

export default useCertificationStore;