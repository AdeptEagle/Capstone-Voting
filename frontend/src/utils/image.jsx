import React from 'react';

// Get backend URL from environment or use Railway backend URL
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://your-railway-backend-url.railway.app';

export const getImageUrl = (photoUrl) => {
  if (!photoUrl) return '/default-avatar.png';
  
  // If it's already a full URL, return as is
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  
  // If it's a relative path, prepend the backend URL
  if (photoUrl.startsWith('/')) {
    return `${BACKEND_URL}${photoUrl}`;
  }
  
  // If it's just a filename, prepend the uploads path
  return `${BACKEND_URL}/uploads/${photoUrl}`;
};

export const getCandidatePhotoUrl = getImageUrl;

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