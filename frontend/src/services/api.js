import axios from 'axios';

// Get API base URL from environment or use Railway backend URL
const API_BASE_URL = 'https://backend-production-219d.up.railway.app/api';

// Debug: Log the API URL being used
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🌍 Environment:', import.meta.env.MODE);
console.log('🔧 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('🚀 Frontend will make requests to:', API_BASE_URL);

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
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching elections:', error);
    return [];
  }
};

export const getActiveElection = async () => {
  try {
    const response = await api.get('/elections/active');
    return response.data || null;
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
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching votes:', error);
    return [];
  }
};

// Voter API functions
export const getVoters = async () => {
  try {
    const response = await api.get('/voters');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching voters:', error);
    return [];
  }
};

// Position API functions
export const getPositions = async () => {
  try {
    const response = await api.get('/positions');
    return Array.isArray(response.data) ? response.data : [];
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

export const deleteMultiplePositions = async (ids) => {
  try {
    const response = await api.delete('/positions', { data: { ids } });
    return response.data;
  } catch (error) {
    console.error('Error deleting multiple positions:', error);
    throw error;
  }
};

// Candidate API functions
export const getCandidates = async () => {
  try {
    const response = await api.get('/candidates');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
};

export const getAllCandidates = async () => {
  try {
    const response = await api.get('/candidates?all=true');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching all candidates:', error);
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

export const deleteMultipleCandidates = async (ids) => {
  try {
    const response = await api.delete('/candidates', { data: { ids } });
    return response.data;
  } catch (error) {
    console.error('Error deleting multiple candidates:', error);
    throw error;
  }
};

// Department API functions
export const getDepartments = async () => {
  try {
    const response = await api.get('/departments');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};

export const getCoursesByDepartment = async (departmentId) => {
  try {
    const response = await api.get(`/departments/${departmentId}/courses`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching courses by department:', error);
    return [];
  }
};

// Admin API functions
export const getAdmins = async () => {
  try {
    const response = await api.get('/admins');
    return Array.isArray(response.data) ? response.data : [];
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
    console.log('🚀 Starting election with POST request:', electionId);
    const response = await api.post(`/elections/${electionId}/start`);
    console.log('✅ Election start response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error starting election:', error);
    throw error;
  }
};

export const pauseElection = async (electionId) => {
  try {
    const response = await api.post(`/elections/${electionId}/pause`);
    return response.data;
  } catch (error) {
    console.error('Error pausing election:', error);
    throw error;
  }
};

export const stopElection = async (electionId) => {
  try {
    const response = await api.post(`/elections/${electionId}/stop`);
    return response.data;
  } catch (error) {
    console.error('Error stopping election:', error);
    throw error;
  }
};

export const resumeElection = async (electionId) => {
  try {
    const response = await api.post(`/elections/${electionId}/resume`);
    return response.data;
  } catch (error) {
    console.error('Error resuming election:', error);
    throw error;
  }
};

export const endElection = async (electionId) => {
  try {
    const response = await api.post(`/elections/${electionId}/end`);
    return response.data;
  } catch (error) {
    console.error('Error ending election:', error);
    throw error;
  }
};

export const getElectionPositions = async (electionId) => {
  try {
    const response = await api.get(`/elections/${electionId}/positions`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching election positions:', error);
    return [];
  }
};

export const getElectionCandidates = async (electionId) => {
  try {
    const response = await api.get(`/elections/${electionId}/candidate-assignments`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching election candidates:', error);
    return [];
  }
};

// Position assignment functions
export const getPositionAssignmentStatus = async (electionId) => {
  try {
    const response = await api.get(`/election-assignments/elections/${electionId}/position-status`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching position assignment status:', error);
    return [];
  }
};

// Candidate assignment functions
export const getCandidateAssignmentStatus = async (electionId) => {
  try {
    const response = await api.get(`/election-assignments/elections/${electionId}/candidate-status`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching candidate assignment status:', error);
    return [];
  }
};

export const assignCandidateToElection = async (electionId, candidateId) => {
  try {
    const response = await api.post('/election-assignments/elections/assign-candidate', {
      electionId,
      candidateId
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning candidate to election:', error);
    throw error;
  }
};

// Vote-related API calls
export const createVote = async (voteData) => {
  try {
    const response = await api.post('/votes/single', voteData);
    return response.data;
  } catch (error) {
    console.error('Error creating vote:', error);
    throw error;
  }
};

export const createMultipleVotes = async (voteData) => {
  try {
    console.log('Submitting votes:', voteData);
    
    // Use the votes-array endpoint
    const response = await api.post('/votes/votes-array', voteData);
    
    console.log('Vote response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Voting API error:', error.response?.data);
    
    if (error.response?.data?.errors) {
      // Create detailed error message
      const errorDetails = error.response.data.errors.map(e => 
        `Position ${e.positionId}: ${e.error}`
      ).join('\n');
      
      const summary = error.response.data.summary;
      const message = `Voting partially failed (${summary?.successful || 0}/${summary?.total || 0} successful):\n${errorDetails}`;
      
      throw new Error(message);
    }
    
    throw new Error(error.response?.data?.error || 'Failed to submit votes');
  }
};

// NEW: Get voting status for a position
export const getVotingStatus = async (electionId, positionId) => {
  try {
    const response = await api.get(`/votes/status/${electionId}/${positionId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting voting status:', error);
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

export const deleteMultipleVoters = async (ids) => {
  try {
    const response = await api.delete('/voters', { data: { ids } });
    return response.data;
  } catch (error) {
    console.error('Error deleting multiple voters:', error);
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
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching vote timeline:', error);
    return [];
  }
};

export const getElectionHistory = async () => {
  try {
    const response = await api.get('/elections/history');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching election history:', error);
    return [];
  }
};

// Course API functions
export const getCourses = async () => {
  try {
    const response = await api.get('/courses');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await api.post('/courses', courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (courseId, updateData) => {
  try {
    const response = await api.put(`/courses/${courseId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Department management functions
export const createDepartment = async (departmentData) => {
  try {
    const response = await api.post('/departments', departmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

export const updateDepartment = async (departmentId, updateData) => {
  try {
    const response = await api.put(`/departments/${departmentId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

export const deleteDepartment = async (departmentId) => {
  try {
    const response = await api.delete(`/departments/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};

// Timer and countdown functions
export const getElectionTimer = async (electionId) => {
  try {
    const response = await api.get(`/elections/${electionId}/timer`);
    return response.data;
  } catch (error) {
    console.error('Error getting election timer:', error);
    throw error;
  }
};

export const getElectionCountdown = async (electionId) => {
  try {
    const response = await api.get(`/elections/${electionId}/countdown`);
    return response.data;
  } catch (error) {
    console.error('Error getting election countdown:', error);
    throw error;
  }
};

export const getAllActiveTimers = async () => {
  try {
    const response = await api.get('/elections/timers/active');
    return response.data;
  } catch (error) {
    console.error('Error getting active timers:', error);
    throw error;
  }
};

// Ballot History API functions
export const getAllCompletedElections = async () => {
  try {
    const response = await api.get('/ballot-history/elections');
    return response.data;
  } catch (error) {
    console.error('Error getting completed elections:', error);
    throw error;
  }
};

export const getElectionAnalysis = async (electionId) => {
  try {
    const response = await api.get(`/ballot-history/elections/${electionId}/analysis`);
    return response.data;
  } catch (error) {
    console.error('Error getting election analysis:', error);
    throw error;
  }
};

export const getElectionSummary = async (electionId) => {
  try {
    const response = await api.get(`/ballot-history/elections/${electionId}/summary`);
    return response.data;
  } catch (error) {
    console.error('Error getting election summary:', error);
    throw error;
  }
};

export const getElectionHistoryResults = async (electionId) => {
  try {
    const response = await api.get(`/ballot-history/elections/${electionId}/results`);
    return response.data;
  } catch (error) {
    console.error('Error getting election results:', error);
    throw error;
  }
};

export const getElectionVoters = async (electionId) => {
  try {
    const response = await api.get(`/ballot-history/elections/${electionId}/voters`);
    return response.data;
  } catch (error) {
    console.error('Error getting election voters:', error);
    throw error;
  }
};

export const getDepartmentStats = async (electionId) => {
  try {
    const response = await api.get(`/ballot-history/elections/${electionId}/departments`);
    return response.data;
  } catch (error) {
    console.error('Error getting department stats:', error);
    throw error;
  }
};

export const getCourseStats = async (electionId) => {
  try {
    const response = await api.get(`/ballot-history/elections/${electionId}/courses`);
    return response.data;
  } catch (error) {
    console.error('Error getting course stats:', error);
    throw error;
  }
};

export const getVotingTimeline = async (electionId) => {
  try {
    const response = await api.get(`/ballot-history/elections/${electionId}/timeline`);
    return response.data;
  } catch (error) {
    console.error('Error getting voting timeline:', error);
    throw error;
  }
};

export const getPositionAnalytics = async (electionId) => {
  try {
    const response = await api.get(`/ballot-history/elections/${electionId}/analytics/positions`);
    return response.data;
  } catch (error) {
    console.error('Error getting position analytics:', error);
    throw error;
  }
};

export const getVoteDistribution = async (electionId) => {
  try {
    const response = await api.get(`/ballot-history/elections/${electionId}/analytics/distribution`);
    return response.data;
  } catch (error) {
    console.error('Error getting vote distribution:', error);
    throw error;
  }
};

export default api; 