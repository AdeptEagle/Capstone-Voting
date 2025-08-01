// Test script to verify Vercel Blob token
import { put } from '@vercel/blob';

const testBlobToken = async () => {
  try {
    console.log('🔍 Testing Vercel Blob token...');
    
    // Check if token is available
    const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    console.log('Token available:', !!token);
    console.log('Token starts with:', token ? token.substring(0, 20) + '...' : 'No token');
    
    if (!token) {
      throw new Error('No blob token found in environment variables');
    }
    
    // Create a test file
    const testContent = 'Hello from Vercel Blob test!';
    const testFile = new File([testContent], 'test-blob-token.txt', { type: 'text/plain' });
    
    console.log('📁 Uploading test file...');
    
    const { url } = await put('test-blob-token.txt', testFile, {
      access: 'public',
      token: token
    });
    
    console.log('✅ Test successful! File uploaded to:', url);
    return { success: true, url };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Run the test
testBlobToken().then(result => {
  if (result.success) {
    console.log('🎉 Blob token is working correctly!');
  } else {
    console.log('💥 Blob token test failed');
  }
}); 