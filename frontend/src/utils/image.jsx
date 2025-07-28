import React from 'react';
// Utility to get the correct candidate photo URL
export function getCandidatePhotoUrl(photoUrl) {
  if (!photoUrl) return null;
  // If already a full URL, use as is
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  // If already starts with /uploads/, use as is (prepend host)
  if (photoUrl.startsWith('/uploads/')) {
    return `http://localhost:3000${photoUrl}`;
  }
  // If just a filename, prepend /uploads/
  return `http://localhost:3000/uploads/${photoUrl}`;
}

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