import React from 'react';

const DepartmentMessage = ({ message, onClose }) => {
  if (!message) return null;

  const isError = message.includes('Error');

  return (
    <div className={`department-message ${isError ? 'department-message-error' : 'department-message-success'}`}>
      <i className={`fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
      <span>{message}</span>
      <button 
        className="department-message-close"
        onClick={onClose}
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default DepartmentMessage;