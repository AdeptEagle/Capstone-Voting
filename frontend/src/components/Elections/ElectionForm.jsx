import React from 'react';

const ElectionForm = ({ formData, setFormData, positions, loadingPositions, isEditing = false }) => {
  const handlePositionToggle = (positionId, isChecked) => {
    if (isChecked) {
      setFormData({
        ...formData,
        positionIds: [...formData.positionIds, positionId]
      });
    } else {
      setFormData({
        ...formData,
        positionIds: formData.positionIds.filter(id => id !== positionId)
      });
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">Election Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows="3"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Start Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">End Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={formData.endTime}
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              required
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Positions to Include</label>
        {loadingPositions ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="text-muted">Loading election positions...</span>
          </div>
        ) : (
          <div className="position-checkboxes">
            {positions.length > 0 ? (
              positions.map(position => (
                <div key={position.id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${isEditing ? 'edit' : 'create'}-position-${position.id}`}
                    checked={formData.positionIds.includes(position.id)}
                    onChange={(e) => handlePositionToggle(position.id, e.target.checked)}
                  />
                  <label 
                    className="form-check-label" 
                    htmlFor={`${isEditing ? 'edit' : 'create'}-position-${position.id}`}
                  >
                    {position.name}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-muted">No positions available. Please create positions first.</p>
            )}
          </div>
        )}
        {!loadingPositions && formData.positionIds.length === 0 && (
          <small className="text-danger">Please select at least one position</small>
        )}
      </div>
    </div>
  );
};

export default ElectionForm;