/**
 * Handles image upload and conversion to base64
 */
export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Only image files are allowed'));
      return;
    }
    
    // Validate file size (2MB limit for base64)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      reject(new Error('File size must be less than 2MB'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = (error) => {
      reject(new Error('Error reading file: ' + error));
    };
  });
};

/**
 * Optimizes image before upload
 */
export const optimizeImage = async (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Maximum dimensions
      const maxWidth = 800;
      const maxHeight = 800;

      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with compression
      const base64 = canvas.toDataURL('image/jpeg', 0.7);
      resolve(base64);
    };

    img.onerror = () => {
      reject(new Error('Error loading image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Main function to handle image upload with optimization
 */
export const handleImageUpload = async (file) => {
  try {
    // First optimize the image
    const optimizedImage = await optimizeImage(file);
    return optimizedImage;
  } catch (error) {
    // Fallback to simple base64 if optimization fails
    console.warn('Image optimization failed, falling back to direct base64:', error);
    return await convertImageToBase64(file);
  }
};