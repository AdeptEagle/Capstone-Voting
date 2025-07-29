import React from 'react';

// Get backend URL from environment variable
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';

export const getImageUrl = (photoUrl) => {
  if (!photoUrl) return '/default-avatar.png';
  
  if (photoUrl.startsWith('/uploads/')) {
    return `${BACKEND_URL}${photoUrl}`;
  }
  
  return `${BACKEND_URL}/uploads/${photoUrl}`;
};

// Placeholder component for candidate photo
export function CandidatePhotoPlaceholder({ className = '', style = {} }) {
  return (
    <div 
      className={`candidate-photo-placeholder ${className}`} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%', 
        height: '100%',
        fontSize: '16px',
        color: '#666',
        background: '#f3f3f3',
        borderRadius: '50%',
        ...style 
      }}
    >
      <i className="fas fa-user" style={{ fontSize: '16px', width: '16px', height: '16px' }}></i>
    </div>
  );
} 