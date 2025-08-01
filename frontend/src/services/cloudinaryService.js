import { cloudinaryConfig } from '../config/cloudinaryConfig';

/**
 * Uploads an image to Cloudinary using unsigned upload
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} The URL of the uploaded image
 */
export const uploadToCloudinary = async (file) => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('cloud_name', cloudinaryConfig.cloudName);
    
    // Add optional parameters for image optimization
    formData.append('quality', 'auto'); // Automatic quality optimization
    formData.append('fetch_format', 'auto'); // Automatic format optimization
    formData.append('folder', 'voting-system/candidates'); // Organize uploads in folders

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};