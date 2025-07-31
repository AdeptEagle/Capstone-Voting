import React from 'react';
import { getStatusColor, getStatusIcon, formatDateTime, getStatusActions } from '../../utils/electionUtils';

const ElectionCard = ({ 
  election, 
  onEdit, 
  onDelete, 
  onStatusChange,
  isUpdating 
}) => {
  const statusActions = getStatusActions(election);

  return (
    <div className="election-card mb-3">
      <div className="election-header">
        <div className="election-title">
          <h5 className="mb-1">{election.title}</h5>
          <span className={`badge bg-${getStatusColor(election.status)} ms-2`}>
            <i className={`${getStatusIcon(election.status)} me-1`}></i>
            {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="election-meta">
        <small className="text-muted">
          Created: {formatDateTime(election.createdAt)}
        </small>
      </div>

      <div className="election-content">
        <p className="mb-2">{election.description}</p>

        <div className="election-details">
          <div className="detail-row">
            <strong>Start:</strong> {formatDateTime(election.startTime)}
          </div>
          <div className="detail-row">
            <strong>End:</strong> {formatDateTime(election.endTime)}
          </div>
          <div className="detail-row">
            <strong>Positions:</strong> {election.positionCount || 0}
          </div>
        </div>

        <div className="election-actions">
          <div className="status-actions">
            {statusActions.map((action) => (
              <button
                key={action.action}
                className={`btn btn-sm btn-${action.color} me-2`}
                onClick={() => onStatusChange(election.id, action.action)}
                disabled={isUpdating === election.id}
              >
                {isUpdating === election.id ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className={`${action.icon} me-1`}></i>
                    {action.label}
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="management-actions">
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={() => onEdit(election)}
              disabled={isUpdating === election.id}
            >
              <i className="fas fa-edit me-1"></i>
              Edit
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(election)}
              disabled={isUpdating === election.id}
            >
              <i className="fas fa-trash me-1"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionCard;