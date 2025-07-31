import React from 'react';
import CandidateSelectionGrid from './CandidateSelectionGrid';

const MultiStepForm = ({
  currentStep,
  formData,
  setFormData,
  tempPositions,
  setTempPositions,
  tempCandidates,
  setTempCandidates,
  existingCandidates,
  departments,
  positions,
  onAddNewPosition,
  onUpdateTempPosition,
  onRemoveTempPosition,
  onAddCandidateToPosition,
  onUpdateTempCandidate,
  onRemoveTempCandidate,
  onPhotoChange,
  onCandidateSelection,
  onAddAllCandidates,
  onRemoveAllCandidates,
  getCandidatesForPosition,
  getFilteredCandidates,
  onNextStep,
  onPrevStep,
  onSubmit,
  loading
}) => {
  const renderStepIndicator = () => (
    <div className="row mb-4">
      <div className="col-12">
        <div className="step-indicator">
          <div className="d-flex justify-content-between align-items-center">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Basic Info</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Positions</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Candidates</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Review</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div>
      <h5 className="mb-3">
        <i className="fas fa-info-circle me-2"></i>
        Basic Election Information
      </h5>
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">Election Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter election title"
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
          placeholder="Enter election description"
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
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          <i className="fas fa-list me-2"></i>
          Configure Positions
        </h5>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={onAddNewPosition}
        >
          <i className="fas fa-plus me-1"></i>
          Add New Position
        </button>
      </div>

      {/* Existing Positions Selection */}
      {positions && positions.length > 0 && (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">📋 Select Existing Positions ({positions.length} available)</h6>
            <div className="btn-group" role="group">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  const allPositionIds = positions.map(p => p.id);
                  setFormData(prev => ({
                    ...prev,
                    positionIds: [...new Set([...prev.positionIds, ...allPositionIds])]
                  }));
                }}
              >
                Select All
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setFormData(prev => ({ ...prev, positionIds: [] }))}
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="row">
            {positions.map((position) => (
              <div key={position.id} className="col-md-6 mb-2">
                <div className={`card h-100 ${formData.positionIds.includes(position.id) ? 'border-primary bg-light' : ''}`}>
                  <div className="card-body p-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`existing-position-${position.id}`}
                        checked={formData.positionIds.includes(position.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              positionIds: [...prev.positionIds, position.id]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              positionIds: prev.positionIds.filter(id => id !== position.id)
                            }));
                          }
                        }}
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

          {/* Selected Positions Summary */}
          {formData.positionIds.length > 0 && (
            <div className="alert alert-success mt-3">
              <i className="fas fa-check-circle me-2"></i>
              <strong>{formData.positionIds.length}</strong> existing position{formData.positionIds.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      )}

      {positions && positions.length === 0 && (
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          No existing positions found. Create positions in the Position Management tab first, or create new positions below.
        </div>
      )}

      {tempPositions.length === 0 ? (
        <div className="text-center py-4">
          <i className="fas fa-list fa-3x text-muted mb-3"></i>
          <p className="text-muted">No new positions added yet. Click "Add New Position" to create positions for this election.</p>
          <div className="alert alert-info mt-3">
            <i className="fas fa-lightbulb me-2"></i>
            <strong>Tip:</strong> You can reuse existing positions by selecting them from the Elections page when editing elections. For now, create the positions you need for this ballot.
          </div>
        </div>
      ) : (
        <div className="position-list">
          {tempPositions.map((position, index) => (
            <div key={index} className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <div className="mb-2">
                      <label className="form-label">Position ID</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={position.id}
                        onChange={(e) => onUpdateTempPosition(index, 'id', e.target.value.toUpperCase())}
                        placeholder="e.g., PRES"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-2">
                      <label className="form-label">Position Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={position.name}
                        onChange={(e) => onUpdateTempPosition(index, 'name', e.target.value)}
                        placeholder="e.g., President"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="mb-2">
                      <label className="form-label">Vote Limit</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={position.voteLimit}
                        onChange={(e) => onUpdateTempPosition(index, 'voteLimit', parseInt(e.target.value))}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="mb-2">
                      <label className="form-label">Order</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={position.displayOrder}
                        onChange={(e) => onUpdateTempPosition(index, 'displayOrder', parseInt(e.target.value))}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-1">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onRemoveTempPosition(index)}
                      title="Remove Position"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h5 className="mb-3">
        <i className="fas fa-users me-2"></i>
        Add Candidates
      </h5>

      {(formData.positionIds.length === 0 && tempPositions.length === 0) ? (
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Please select existing positions or add new positions in Step 2 before adding candidates.
        </div>
      ) : (
        <div>
          {/* Existing Candidates Selection */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">👥 Select Existing Candidates (Recommended)</h6>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={onAddAllCandidates}
                >
                  Select All
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={onRemoveAllCandidates}
                >
                  Clear All
                </button>
              </div>
            </div>

            <CandidateSelectionGrid
              candidates={getFilteredCandidates()}
              selectedCandidateIds={formData.selectedCandidateIds}
              onCandidateSelection={onCandidateSelection}
            />
          </div>

          {/* New Candidates Creation */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">🆕 Create New Candidates (Optional)</h6>
              <small className="text-muted">💡 Tip: Select existing candidates above instead of creating new ones</small>
            </div>

            {tempPositions.map((position) => (
              <div key={position.id} className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="text-primary mb-0">
                    <i className="fas fa-certificate me-1"></i>
                    {position.name} ({position.id})
                  </h6>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => onAddCandidateToPosition(position.id)}
                  >
                    <i className="fas fa-plus me-1"></i>
                    Add Candidate
                  </button>
                </div>

                {getCandidatesForPosition(position.id).map((candidate, candidateIndex) => (
                  <div key={candidateIndex} className="card mb-2">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Candidate Name"
                            value={candidate.name}
                            onChange={(e) => onUpdateTempCandidate(candidateIndex, 'name', e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          <select
                            className="form-select form-select-sm"
                            value={candidate.departmentId}
                            onChange={(e) => onUpdateTempCandidate(candidateIndex, 'departmentId', e.target.value)}
                            required
                          >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                              <option key={dept.id} value={dept.id}>{dept.id}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            accept="image/*"
                            onChange={(e) => onPhotoChange(candidateIndex, e.target.files[0])}
                          />
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Platform/Slogan"
                            value={candidate.platform}
                            onChange={(e) => onUpdateTempCandidate(candidateIndex, 'platform', e.target.value)}
                          />
                        </div>
                        <div className="col-md-1">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onRemoveTempCandidate(candidateIndex)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {getCandidatesForPosition(position.id).length === 0 && (
                  <div className="text-center py-3 border rounded bg-light">
                    <p className="text-muted mb-0">No candidates added for this position yet.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div>
      <h5 className="mb-3">
        <i className="fas fa-check-circle me-2"></i>
        Review & Create Election
      </h5>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">
              <h6 className="mb-0">Election Details</h6>
            </div>
            <div className="card-body">
              <p><strong>Title:</strong> {formData.title}</p>
              <p><strong>Description:</strong> {formData.description}</p>
              <p><strong>Start:</strong> {new Date(formData.startTime).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(formData.endTime).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header">
              <h6 className="mb-0">Positions ({tempPositions.length})</h6>
            </div>
            <div className="card-body">
              {tempPositions.map((position) => (
                <div key={position.id} className="d-flex justify-content-between align-items-center mb-2">
                  <span>{position.name} ({position.id})</span>
                  <span className="badge bg-primary">{position.voteLimit} vote(s)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">
            Candidates ({tempCandidates.length + formData.selectedCandidateIds.length})
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6 className="text-success">New Candidates ({tempCandidates.length})</h6>
              {tempCandidates.map((candidate, index) => (
                <div key={index} className="mb-2">
                  <span className="fw-bold">{candidate.name}</span>
                  <br />
                  <small className="text-muted">
                    Position: {candidate.positionId} | Department: {candidate.departmentId}
                  </small>
                </div>
              ))}
            </div>
            <div className="col-md-6">
              <h6 className="text-primary">Existing Candidates ({formData.selectedCandidateIds.length})</h6>
              {formData.selectedCandidateIds.map(candidateId => {
                const candidate = existingCandidates.find(c => c.id === candidateId);
                return candidate ? (
                  <div key={candidateId} className="mb-2">
                    <span className="fw-bold">{candidate.name}</span>
                    <br />
                    <small className="text-muted">
                      Position: {candidate.positionId} | Department: {candidate.departmentId}
                    </small>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepButtons = () => (
    <div className="d-flex justify-content-between mt-4">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onPrevStep}
        disabled={currentStep === 1}
      >
        <i className="fas fa-arrow-left me-1"></i>
        Previous
      </button>

      {currentStep < 4 ? (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onNextStep}
        >
          Next
          <i className="fas fa-arrow-right ms-1"></i>
        </button>
      ) : (
        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
          onClick={onSubmit}
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin me-1"></i>
          ) : (
            <i className="fas fa-plus me-1"></i>
          )}
          Create Election
        </button>
      )}
    </div>
  );

  return (
    <div>
      {renderStepIndicator()}
      
      <div className="step-content">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {renderStepButtons()}
    </div>
  );
};

export default MultiStepForm;