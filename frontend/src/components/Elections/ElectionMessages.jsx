import React from 'react';

const ElectionMessages = ({ error, success, onClearError, onClearSuccess }) => {
  if (!error && !success) return null;

  return (
    <>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={onClearError}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {success}
          <button type="button" className="btn-close" onClick={onClearSuccess}></button>
        </div>
      )}
    </>
  );
};

export default ElectionMessages;