import React, { useState, useEffect } from 'react';
import { Alert, Badge } from 'react-bootstrap';

const CountdownTimer = ({ 
  endTime, 
  electionId, 
  electionTitle,
  onExpired,
  size = 'normal',
  showTitle = true,
  variant = 'primary'
}) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeRemaining(null);
        if (onExpired && !isExpired) {
          onExpired(electionId);
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds, total: difference });
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Set up interval
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [endTime, electionId, onExpired, isExpired]);

  const getVariant = () => {
    if (isExpired) return 'danger';
    if (!timeRemaining) return variant;
    
    const { total } = timeRemaining;
    const oneHour = 60 * 60 * 1000;
    const fiveMinutes = 5 * 60 * 1000;
    
    if (total <= fiveMinutes) return 'danger';
    if (total <= oneHour) return 'warning';
    return variant;
  };

  const getTimeDisplay = () => {
    if (isExpired) return 'EXPIRED';
    if (!timeRemaining) return 'Loading...';

    const { days, hours, minutes, seconds } = timeRemaining;
    
    if (size === 'small') {
      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m ${seconds}s`;
    }

    let display = '';
    if (days > 0) display += `${days}d `;
    if (hours > 0 || days > 0) display += `${hours}h `;
    display += `${minutes}m ${seconds}s`;
    
    return display.trim();
  };

  const getIcon = () => {
    if (isExpired) return 'fas fa-times-circle';
    if (!timeRemaining) return 'fas fa-clock';
    
    const { total } = timeRemaining;
    const fiveMinutes = 5 * 60 * 1000;
    
    if (total <= fiveMinutes) return 'fas fa-exclamation-triangle';
    return 'fas fa-clock';
  };

  if (size === 'small') {
    return (
      <Badge bg={getVariant()} className="countdown-timer-small">
        <i className={getIcon() + ' me-1'}></i>
        {getTimeDisplay()}
      </Badge>
    );
  }

  return (
    <Alert variant={getVariant()} className="countdown-timer mb-0">
      <div className="d-flex align-items-center justify-content-between">
        <div className="countdown-info">
          {showTitle && (
            <div className="countdown-title">
              <i className={getIcon() + ' me-2'}></i>
              <strong>
                {isExpired ? 'Election Ended' : 'Time Remaining'}
              </strong>
            </div>
          )}
          <div className="countdown-display">
            {getTimeDisplay()}
          </div>
          {!isExpired && timeRemaining && (
            <small className="text-muted">
              Ends: {new Date(endTime).toLocaleString()}
            </small>
          )}
        </div>
        
        {isExpired && (
          <div className="countdown-actions">
            <Badge bg="dark">
              <i className="fas fa-flag-checkered me-1"></i>
              Completed
            </Badge>
          </div>
        )}
      </div>
      
      {!isExpired && timeRemaining && timeRemaining.total <= (60 * 60 * 1000) && (
        <div className="countdown-progress mt-2">
          <div className="progress" style={{ height: '4px' }}>
            <div 
              className="progress-bar bg-danger" 
              role="progressbar" 
              style={{ 
                width: `${Math.min(100, ((60 * 60 * 1000 - timeRemaining.total) / (60 * 60 * 1000)) * 100)}%` 
              }}
            ></div>
          </div>
          <small className="text-muted mt-1 d-block">
            {timeRemaining.total <= (5 * 60 * 1000) ? 
              'Final minutes!' : 
              'Less than 1 hour remaining'
            }
          </small>
        </div>
      )}
    </Alert>
  );
};

export default CountdownTimer; 