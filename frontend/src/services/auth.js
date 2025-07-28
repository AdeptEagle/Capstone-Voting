export function getRole() {
  return localStorage.getItem('role');
}

export function getToken() {
  return localStorage.getItem('token');
}

// Function to check current user's role and token validity
export const checkCurrentUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { isAuthenticated: false, role: null, user: null };
    }

    // Decode the JWT token (without verification for client-side check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp < currentTime) {
      // Token has expired
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      return { isAuthenticated: false, role: null, user: null, error: 'Token expired' };
    }

    return {
      isAuthenticated: true,
      role: payload.role,
      user: {
        id: payload.id,
        username: payload.username || payload.name, // Use name for users, username for admins
        email: payload.email
      }
    };
  } catch (error) {
    console.error('Error checking current user:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return { isAuthenticated: false, role: null, user: null, error: 'Invalid token' };
  }
};

// Function to check if user has required role
export const hasRole = (requiredRole) => {
  const currentUser = checkCurrentUser();
  if (!currentUser.isAuthenticated) {
    return false;
  }
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(currentUser.role);
  }
  
  return currentUser.role === requiredRole;
};

// Function to check if user is superadmin
export const isSuperAdmin = () => {
  return hasRole('superadmin');
};

// Function to check if user is admin
export const isAdmin = () => {
  return hasRole(['admin', 'superadmin']);
}; 