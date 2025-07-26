import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Add a request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Positions API Functions
export const getPositions = async () => {
  try {
    const response = await api.get('/api/positions');
    return response.data;
  } catch (error) {
    console.error('Error fetching positions:', error);
    throw error;
  }
};

export const createPosition = async (position) => {
  try {
    // Do NOT override id, use the one provided by the form
    const response = await api.post('/api/positions', position);
    return response.data;
  } catch (error) {
    console.error('Error creating position:', error);
    throw error;
  }
};

export const updatePosition = async (id, position) => {
  try {
    const response = await api.put(`/api/positions/${id}`, position);
    return response.data;
  } catch (error) {
    console.error('Error updating position:', error);
    throw error;
  }
};

export const deletePosition = async (id) => {
  try {
    const response = await api.delete(`/api/positions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting position:', error);
    throw error;
  }
};

// Candidates API Functions
export const getCandidates = async () => {
  try {
    const response = await api.get('/api/candidates');
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

export const createCandidate = async (candidate, config = {}) => {
  try {
    let dataToSend = candidate;
    if (candidate instanceof FormData) {
      dataToSend.append('id', crypto.randomUUID());
    } else {
      dataToSend = { ...candidate, id: crypto.randomUUID() };
    }
    const response = await api.post('/api/candidates', dataToSend, config);
    return response.data;
  } catch (error) {
    console.error('Error creating candidate:', error);
    throw error;
  }
};

export const updateCandidate = async (id, candidate, config = {}) => {
  try {
    const response = await api.put(`/api/candidates/${id}`, candidate, config);
    return response.data;
  } catch (error) {
    console.error('Error updating candidate:', error);
    throw error;
  }
};

export const deleteCandidate = async (id) => {
  try {
    const response = await api.delete(`/api/candidates/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting candidate:', error);
    throw error;
  }
};

// Voters API Functions
export const getVoters = async () => {
  try {
    const response = await api.get('/api/voters');
    return response.data;
  } catch (error) {
    console.error('Error fetching voters:', error);
    throw error;
  }
};

export const createVoter = async (voter) => {
  try {
    const response = await api.post('/api/voters', { ...voter, id: crypto.randomUUID() });
    return response.data;
  } catch (error) {
    console.error('Error creating voter:', error);
    throw error;
  }
};

export const updateVoter = async (id, voter) => {
  try {
    const response = await api.put(`/api/voters/${id}`, voter);
    return response.data;
  } catch (error) {
    console.error('Error updating voter:', error);
    throw error;
  }
};

export const deleteVoter = async (id) => {
  try {
    const response = await api.delete(`/api/voters/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting voter:', error);
    throw error;
  }
};

// Votes API Functions
export const getVotes = async () => {
  try {
    const response = await api.get('/api/votes');
    return response.data;
  } catch (error) {
    console.error('Error fetching votes:', error);
    throw error;
  }
};

export const createVote = async (vote) => {
  try {
    const response = await api.post('/api/votes', { ...vote, id: crypto.randomUUID() });
    return response.data;
  } catch (error) {
    console.error('Error creating vote:', error);
    throw error;
  }
};

// Results API Functions
export const getResults = async () => {
  try {
    const response = await api.get('/api/results');
    return response.data;
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error;
  }
};

// Elections API Functions
export const getElections = async () => {
  try {
    const response = await api.get('/api/elections');
    return response.data;
  } catch (error) {
    console.error('Error fetching elections:', error);
    throw error;
  }
};

export const getElection = async (id) => {
  try {
    const response = await api.get(`/api/elections/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching election:', error);
    throw error;
  }
};

export const getElectionPositions = async (id) => {
  try {
    const response = await api.get(`/api/elections/${id}/positions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching election positions:', error);
    throw error;
  }
};

export const createElection = async (election) => {
  try {
    const response = await api.post('/api/elections', { ...election, id: crypto.randomUUID() });
    return response.data;
  } catch (error) {
    console.error('Error creating election:', error);
    throw error;
  }
};

export const updateElection = async (id, election) => {
  try {
    const response = await api.put(`/api/elections/${id}`, election);
    return response.data;
  } catch (error) {
    console.error('Error updating election:', error);
    throw error;
  }
};

export const deleteElection = async (id) => {
  try {
    const response = await api.delete(`/api/elections/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting election:', error);
    throw error;
  }
};

export const getActiveElection = async () => {
  try {
    const response = await api.get('/api/elections/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active election:', error);
    throw error;
  }
};

// Admin Authentication
export const adminLogin = async (username, password) => {
  try {
    const response = await api.post('/api/admin/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Error during admin login:', error);
    throw error;
  }
};

export default api; 