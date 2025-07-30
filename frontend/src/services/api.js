import axios from 'axios';

// Get API base URL from environment or use Railway backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-production-219d.up.railway.app/api';

// Debug: Log the API URL being used
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', import.meta.env.MODE);
console.log('🔧 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Election API functions
export const getElections = async () => {
  try {
    const response = await api.get('/elections');
    return response.data;
  } catch (error) {
    console.error('Error fetching elections:', error);
    throw error;
  }
};

export const getActiveElection = async () => {
  try {
    const response = await api.get('/elections/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active election:', error);
    return null;
  }
};

export const updateElection = async (electionId, updateData) => {
  try {
    const response = await api.put(`/elections/${electionId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating election:', error);
    throw error;
  }
};

// Vote API functions
export const getVotes = async () => {
  try {
    const response = await api.get('/votes');
    return response.data;
  } catch (error) {
    console.error('Error fetching votes:', error);
    return [];
  }
};

// Voter API functions
export const getVoters = async () => {
  try {
    const response = await api.get('/voters');
    return response.data;
  } catch (error) {
    console.error('Error fetching voters:', error);
    return [];
  }
};

export default api; 