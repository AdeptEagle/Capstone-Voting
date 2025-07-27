// Validation utility functions

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  // Password must be at least 6 characters long
  return password && password.length >= 6;
}

export function validateStudentId(studentId) {
  // Student ID should be alphanumeric and at least 3 characters
  const studentIdRegex = /^[a-zA-Z0-9]{3,}$/;
  return studentIdRegex.test(studentId);
}

export function validateElectionDates(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();
  
  // Start time should be in the future
  if (start <= now) {
    return { valid: false, error: "Start time must be in the future" };
  }
  
  // End time should be after start time
  if (end <= start) {
    return { valid: false, error: "End time must be after start time" };
  }
  
  return { valid: true };
}

export function validateVoteData(voteData) {
  const { voterId, candidateId, id, isLastVote } = voteData;
  
  if (!voterId || !candidateId || !id) {
    return { valid: false, error: "Missing required fields: voterId, candidateId, id" };
  }
  
  if (typeof isLastVote !== 'boolean') {
    return { valid: false, error: "isLastVote must be a boolean" };
  }
  
  return { valid: true };
} 