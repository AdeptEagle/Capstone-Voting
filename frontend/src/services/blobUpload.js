import { put } from '@vercel/blob';

export const uploadImageToBlob = async (file) => {
  try {
    console.log('📁 Uploading file to Vercel Blob:', file.name);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }
    
    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }
    
    // Check if token is available
    const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error('Blob upload token not configured. Please contact administrator to set up image uploads.');
    }
    
    const { url } = await put(file.name, file, {
      access: 'public',
      token: token
    });
    
    console.log('✅ File uploaded successfully:', url);
    return url;
  } catch (error) {
    console.error('❌ Error uploading to Vercel Blob:', error);
    
    // Provide user-friendly error message
    if (error.message.includes('No token found') || error.message.includes('token')) {
      throw new Error('Image upload service not configured. Please contact administrator.');
    }
    
    throw error;
  }
};

// Fallback function for environments without Vercel Blob
export const uploadImageFallback = async (file) => {
  console.warn('🔄 Vercel Blob not available, using data URL fallback');
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Alternative export names for compatibility
export const uploadToBlob = uploadImageToBlob;