import React from 'react';

const PositionAlerts = ({ success, error, onClearSuccess, onClearError }) => {
  if (!success && !error) return null;

  return (
    <div className="position-alerts mb-3">
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {success}
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClearSuccess}
          ></button>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClearError}
          ></button>
        </div>
      )}
    </div>
  );
};

export default PositionAlerts;