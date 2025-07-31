import React from 'react';

const PositionSelector = ({
  positions,
  selectedPositionIds,
  onPositionToggle,
  onSelectAll,
  onClearAll
}) => {
  if (!positions || positions.length === 0) {
    return (
      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        No existing positions found. Create new positions below.
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Select Existing Positions</h6>
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={onSelectAll}
          >
            Select All
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onClearAll}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="row">
        {positions.map((position) => (
          <div key={position.id} className="col-md-6 mb-2">
            <div className={`card h-100 ${selectedPositionIds.includes(position.id) ? 'border-primary bg-light' : ''}`}>
              <div className="card-body p-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`existing-position-${position.id}`}
                    checked={selectedPositionIds.includes(position.id)}
                    onChange={(e) => onPositionToggle(position.id, e.target.checked)}
                  />
                  <label className="form-check-label w-100" htmlFor={`existing-position-${position.id}`}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{position.name}</strong>
                        <br />
                        <small className="text-muted">ID: {position.id}</small>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">
                          Vote Limit: {position.voteLimit || 1}
                        </small>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Position Summary */}
      {selectedPositionIds.length > 0 && (
        <div className="alert alert-success mt-3">
          <i className="fas fa-check-circle me-2"></i>
          <strong>{selectedPositionIds.length}</strong> existing position{selectedPositionIds.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};

export default PositionSelector;