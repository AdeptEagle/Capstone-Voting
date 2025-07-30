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

// Position API functions
export const getPositions = async () => {
  try {
    const response = await api.get('/positions');
    return response.data;
  } catch (error) {
    console.error('Error fetching positions:', error);
    return [];
  }
};

export const createPosition = async (positionData) => {
  try {
    const response = await api.post('/positions', positionData);
    return response.data;
  } catch (error) {
    console.error('Error creating position:', error);
    throw error;
  }
};

export const updatePosition = async (positionId, updateData) => {
  try {
    const response = await api.put(`/positions/${positionId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating position:', error);
    throw error;
  }
};

export const deletePosition = async (positionId) => {
  try {
    const response = await api.delete(`/positions/${positionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting position:', error);
    throw error;
  }
};

// Candidate API functions
export const getCandidates = async () => {
  try {
    const response = await api.get('/candidates');
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
};

export const createCandidate = async (candidateData) => {
  try {
    const response = await api.post('/candidates', candidateData);
    return response.data;
  } catch (error) {
    console.error('Error creating candidate:', error);
    throw error;
  }
};

export const updateCandidate = async (candidateId, updateData) => {
  try {
    const response = await api.put(`/candidates/${candidateId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating candidate:', error);
    throw error;
  }
};

export const deleteCandidate = async (candidateId) => {
  try {
    const response = await api.delete(`/candidates/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting candidate:', error);
    throw error;
  }
};

// Department API functions
export const getDepartments = async () => {
  try {
    const response = await api.get('/departments');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};

export const getCoursesByDepartment = async (departmentId) => {
  try {
    const response = await api.get(`/departments/${departmentId}/courses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses by department:', error);
    return [];
  }
};

// Admin API functions
export const getAdmins = async () => {
  try {
    const response = await api.get('/admins');
    return response.data;
  } catch (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
};

export const createAdmin = async (adminData) => {
  try {
    const response = await api.post('/admins', adminData);
    return response.data;
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
};

export const updateAdmin = async (adminId, updateData) => {
  try {
    const response = await api.put(`/admins/${adminId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating admin:', error);
    throw error;
  }
};

export const deleteAdmin = async (adminId) => {
  try {
    const response = await api.delete(`/admins/${adminId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error;
  }
};

// Election management functions
export const createElection = async (electionData) => {
  try {
    const response = await api.post('/elections', electionData);
    return response.data;
  } catch (error) {
    console.error('Error creating election:', error);
    throw error;
  }
};

export const deleteElection = async (electionId) => {
  try {
    const response = await api.delete(`/elections/${electionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting election:', error);
    throw error;
  }
};

export const startElection = async (electionId) => {
  try {
    const response = await api.put(`/elections/${electionId}/start`);
    return response.data;
  } catch (error) {
    console.error('Error starting election:', error);
    throw error;
  }
};

export const pauseElection = async (electionId) => {
  try {
    const response = await api.put(`/elections/${electionId}/pause`);
    return response.data;
  } catch (error) {
    console.error('Error pausing election:', error);
    throw error;
  }
};

export const stopElection = async (electionId) => {
  try {
    const response = await api.put(`/elections/${electionId}/stop`);
    return response.data;
  } catch (error) {
    console.error('Error stopping election:', error);
    throw error;
  }
};

export const resumeElection = async (electionId) => {
  try {
    const response = await api.put(`/elections/${electionId}/resume`);
    return response.data;
  } catch (error) {
    console.error('Error resuming election:', error);
    throw error;
  }
};

export const endElection = async (electionId) => {
  try {
    const response = await api.put(`/elections/${electionId}/end`);
    return response.data;
  } catch (error) {
    console.error('Error ending election:', error);
    throw error;
  }
};

export const getElectionPositions = async (electionId) => {
  try {
    const response = await api.get(`/elections/${electionId}/positions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching election positions:', error);
    return [];
  }
};

export const getElectionCandidates = async (electionId) => {
  try {
    const response = await api.get(`/elections/${electionId}/candidates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching election candidates:', error);
    return [];
  }
};

// Vote API functions
export const createVote = async (voteData) => {
  try {
    const response = await api.post('/votes', voteData);
    return response.data;
  } catch (error) {
    console.error('Error creating vote:', error);
    throw error;
  }
};

// Voter management functions
export const createVoter = async (voterData) => {
  try {
    const response = await api.post('/voters', voterData);
    return response.data;
  } catch (error) {
    console.error('Error creating voter:', error);
    throw error;
  }
};

export const updateVoter = async (voterId, updateData) => {
  try {
    const response = await api.put(`/voters/${voterId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating voter:', error);
    throw error;
  }
};

export const deleteVoter = async (voterId) => {
  try {
    const response = await api.delete(`/voters/${voterId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting voter:', error);
    throw error;
  }
};

// Results and statistics functions
export const getActiveElectionResults = async () => {
  try {
    const response = await api.get('/elections/active/results');
    return response.data;
  } catch (error) {
    console.error('Error fetching active election results:', error);
    return null;
  }
};

export const getRealTimeStats = async () => {
  try {
    const response = await api.get('/elections/stats/realtime');
    return response.data;
  } catch (error) {
    console.error('Error fetching real-time stats:', error);
    return {};
  }
};

export const getVoteTimeline = async () => {
  try {
    const response = await api.get('/votes/timeline');
    return response.data;
  } catch (error) {
    console.error('Error fetching vote timeline:', error);
    return [];
  }
};

export const getElectionHistory = async () => {
  try {
    const response = await api.get('/elections/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching election history:', error);
    return [];
  }
};

// Course API functions
export const getCourses = async () => {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

export default api; 