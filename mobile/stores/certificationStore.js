// stores/certificationStore.js
import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://your-backend-url/api'; // Replace with your backend URL

const useCertificationStore = create((set) => ({
  certifications: [],
  enrolledCertifications: [],

  fetchCertifications: async () => {
    try {
      const response = await axios.get(`${API_URL}/certifications`);
      set({ certifications: response.data });
    } catch (error) {
      console.error('Error fetching certifications:', error);
    }
  },

  fetchEnrolledCertifications: async () => {
    try {
      const response = await axios.get(`${API_URL}/certifications/enrolled`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Adjust based on your auth setup
      });
      set({ enrolledCertifications: response.data });
    } catch (error) {
      console.error('Error fetching enrolled certifications:', error);
    }
  },

  enrollInCertification: async (certificationId) => {
    try {
      const response = await axios.post(
        `${API_URL}/certifications/${certificationId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      set((state) => ({
        enrolledCertifications: [...state.enrolledCertifications, response.data],
      }));
    } catch (error) {
      console.error('Error enrolling in certification:', error);
      throw error;
    }
  },

    // stores/certificationStore.js
    // Add this method if needed
  fetchModule: async (moduleId) => {
    try {
      const response = await axios.get(`${API_URL}/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching module:', error);
      throw error;
    }
  },

}));

export default useCertificationStore;