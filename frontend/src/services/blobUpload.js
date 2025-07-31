import { put } from '@vercel/blob';

export const uploadToBlob = async (file) => {
  try {
    console.log('📁 Uploading file to Vercel Blob:', file.name);
    
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

export const uploadImageToBlob = async (file) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }
  
  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB');
  }
  
  return await uploadToBlob(file);
}; 