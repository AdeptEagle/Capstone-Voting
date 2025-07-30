import { put } from '@vercel/blob';

export const uploadToBlob = async (file) => {
  try {
    console.log('📁 Uploading file to Vercel Blob:', file.name);
    
    const { url } = await put(file.name, file, {
      access: 'public',
    });
    
    console.log('✅ File uploaded successfully:', url);
    return url;
  } catch (error) {
    console.error('❌ Error uploading to Vercel Blob:', error);
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