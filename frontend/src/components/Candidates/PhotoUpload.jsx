import React, { useState } from 'react';
import { uploadToCloudinary } from '../../services/cloudinaryService';

const PhotoUpload = ({ 
  photoFile, 
  photoPreview, 
  onPhotoChange, 
  onRemovePhoto,
  disabled = false 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleRemove = () => {
    if (onRemovePhoto) {
      onRemovePhoto();
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">
        Photo (profile picture)
        <span className="text-muted ms-1">(optional)</span>
      </label>
      
      <div className="photo-upload-container">
        <input
          type="file"
          className="form-control"
          accept="image/jpeg,image/jpg,image/png"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setError('');
            setLoading(true);
            
            try {
              const imageUrl = await uploadToCloudinary(file);
              onPhotoChange({
                target: {
                  files: [file],
                  imageUrl: imageUrl
                }
              });
            } catch (err) {
              setError(err.message);
              console.error('Error uploading image:', err);
            } finally {
              setLoading(false);
            }
          }}
          disabled={disabled || loading}
        />
        {error && (
          <div className="alert alert-danger mt-2">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}
        {loading && (
          <div className="text-primary mt-2">
            <i className="fas fa-spinner fa-spin me-2"></i>
            Processing image...
          </div>
        )}
        
        <div className="upload-help text-muted small mt-1">
          Supported formats: JPG, PNG, GIF. Max size: 5MB
        </div>

        {photoPreview && (
          <div className="photo-preview mt-3">
            <div className="preview-container text-center">
              <img
                src={photoPreview}
                alt="Photo Preview"
                className="preview-image"
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '8px', 
                  objectFit: 'cover', 
                  border: '2px solid #e9ecef',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                }}
              />
              <div className="preview-actions mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleRemove}
                  disabled={disabled}
                >
                  <i className="fas fa-trash me-1"></i>
                  Remove Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {photoFile && (
          <div className="file-info mt-2">
            <small className="text-muted">
              <i className="fas fa-file-image me-1"></i>
              Selected: {photoFile.name} ({(photoFile.size / 1024 / 1024).toFixed(2)} MB)
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;