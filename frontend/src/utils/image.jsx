import React, { useState, useEffect } from 'react';

// Get backend URL from environment or use Railway backend URL
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://backend-production-219d.up.railway.app';

export const getImageUrl = (photoUrl) => {
  // Return default if no photoUrl provided
  if (!photoUrl || photoUrl === '' || photoUrl === null || photoUrl === undefined) {
    return '/default-avatar.png';
  }

  // Clean up the photoUrl string
  const cleanedUrl = String(photoUrl).trim();
  
  // Return default for empty strings after cleaning
  if (!cleanedUrl) {
    return '/default-avatar.png';
  }

  // Handle complete data URLs (base64 images)
  if (cleanedUrl.startsWith('data:image/') && cleanedUrl.includes('base64,')) {
    // Check if base64 data actually exists after the comma
    const base64Part = cleanedUrl.split('base64,')[1];
    if (base64Part && base64Part.length > 10) {
      return cleanedUrl;
    } else {
      // Incomplete base64, return default
      console.warn('Incomplete base64 image data, using default avatar');
      return '/default-avatar.png';
    }
  }

  // Handle malformed data URLs (incomplete base64)
  if (cleanedUrl.startsWith('data:image/') || cleanedUrl.startsWith('data:')) {
    console.warn('Malformed data URL, using default avatar:', cleanedUrl);
    return '/default-avatar.png';
  }

  // Handle complete external URLs (Cloudinary, etc.)
  if (cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://')) {
    // Validate that it's a proper image URL
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = validImageExtensions.some(ext => 
      cleanedUrl.toLowerCase().includes(ext)
    );
    
    // For Cloudinary URLs or URLs with valid extensions, return as is
    if (cleanedUrl.includes('cloudinary.com') || hasValidExtension) {
      return cleanedUrl;
    } else {
      console.warn('Invalid external image URL, using default avatar:', cleanedUrl);
      return '/default-avatar.png';
    }
  }

  // Handle relative paths starting with /
  if (cleanedUrl.startsWith('/')) {
    // Don't double-process URLs that are already relative paths
    if (cleanedUrl.startsWith('/uploads/')) {
      return `${BACKEND_URL}${cleanedUrl}`;
    } else {
      return `${BACKEND_URL}/uploads${cleanedUrl}`;
    }
  }
  
  // Handle filenames (should be treated as relative to uploads directory)
  if (cleanedUrl.length > 0 && !cleanedUrl.includes(' ') && !cleanedUrl.includes(';')) {
    return `${BACKEND_URL}/uploads/${cleanedUrl}`;
  }

  // If none of the above, it's probably malformed data
  console.warn('Unrecognized image URL format, using default avatar:', cleanedUrl);
  return '/default-avatar.png';
};

export const getCandidatePhotoUrl = getImageUrl;

// Enhanced image component with error handling
export function CandidateImage({ photoUrl, alt = 'Candidate Photo', className = '', style = {}, size = 'normal' }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    console.log('CandidateImage - Input photoUrl:', photoUrl);
    const url = getImageUrl(photoUrl);
    console.log('CandidateImage - Processed URL:', url);
    setImageUrl(url);
    setIsLoading(true);
    setHasError(false);
  }, [photoUrl]);

  const handleImageLoad = () => {
    console.log('CandidateImage - Image loaded successfully:', imageUrl);
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    console.log('CandidateImage - Image failed to load:', imageUrl);
    setHasError(true);
    setIsLoading(false);
    // Fallback to placeholder
    setImageUrl('/default-avatar.png');
  };

  // Show placeholder if no valid image URL or error occurred
  if (hasError || imageUrl === '/default-avatar.png') {
    return (
      <CandidatePhotoPlaceholder 
        className={className}
        style={style}
        size={size}
      />
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      {isLoading && (
        <div className="image-loading-placeholder" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: 'inherit'
        }}>
          <div className="spinner-border spinner-border-sm text-muted" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{
          display: isLoading ? 'none' : 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 'inherit'
        }}
      />
    </div>
  );
}

// Enhanced placeholder component
export function CandidatePhotoPlaceholder({ className = '', style = {}, size = 'normal' }) {
  const getIconSize = () => {
    switch(size) {
      case 'small':
        return '16px';
      case 'large':
        return '40px';
      case 'xl':
        return '60px';
      default:
        return '24px';
    }
  };

  return (
    <div 
      className={`candidate-photo-placeholder ${className}`} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%', 
        height: '100%',
        fontSize: getIconSize(),
        color: '#6c757d',
        backgroundColor: '#e9ecef',
        borderRadius: 'inherit',
        border: '2px solid #dee2e6',
        ...style 
      }}
    >
      <i className="fas fa-user" style={{ fontSize: getIconSize() }}></i>
    </div>
  );
} 