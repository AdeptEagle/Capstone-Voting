// Import all models
import Admin from './Admin.js';
import Department from './Department.js';
import Course from './Course.js';
import Position from './Position.js';
import Candidate from './Candidate.js';
import Voter from './Voter.js';
import Election from './Election.js';
import Vote from './Vote.js';
import PasswordResetToken from './PasswordResetToken.js';
import ElectionPosition from './ElectionPosition.js';
import ElectionCandidate from './ElectionCandidate.js';

// Set up many-to-many associations
Election.belongsToMany(Position, {
  through: ElectionPosition,
  foreignKey: 'electionId',
  otherKey: 'positionId',
  as: 'positions'
});

Position.belongsToMany(Election, {
  through: ElectionPosition,
  foreignKey: 'positionId',
  otherKey: 'electionId',
  as: 'elections'
});

Election.belongsToMany(Candidate, {
  through: ElectionCandidate,
  foreignKey: 'electionId',
  otherKey: 'candidateId',
  as: 'candidates'
});

Candidate.belongsToMany(Election, {
  through: ElectionCandidate,
  foreignKey: 'candidateId',
  otherKey: 'electionId',
  as: 'elections'
});

// Set up one-to-many associations
Department.hasMany(Course, {
  foreignKey: 'departmentId',
  as: 'courses'
});

Department.hasMany(Candidate, {
  foreignKey: 'departmentId',
  as: 'candidates'
});

Department.hasMany(Voter, {
  foreignKey: 'departmentId',
  as: 'voters'
});

Course.hasMany(Candidate, {
  foreignKey: 'courseId',
  as: 'candidates'
});

Course.hasMany(Voter, {
  foreignKey: 'courseId',
  as: 'voters'
});

Position.hasMany(Candidate, {
  foreignKey: 'positionId',
  as: 'candidates'
});

Election.hasMany(Vote, {
  foreignKey: 'electionId',
  as: 'votes'
});

Position.hasMany(Vote, {
  foreignKey: 'positionId',
  as: 'votes'
});

Candidate.hasMany(Vote, {
  foreignKey: 'candidateId',
  as: 'votes'
});

Voter.hasMany(Vote, {
  foreignKey: 'voterId',
  as: 'votes'
});

Admin.hasMany(Election, {
  foreignKey: 'created_by',
  as: 'elections'
});

Admin.hasMany(Department, {
  foreignKey: 'created_by',
  as: 'departments'
});

Admin.hasMany(Course, {
  foreignKey: 'created_by',
  as: 'courses'
});

// Export all models
export {
  Admin,
  Department,
  Course,
  Position,
  Candidate,
  Voter,
  Election,
  Vote,
  PasswordResetToken,
  ElectionPosition,
  ElectionCandidate
}; 