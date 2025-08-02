import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';
import Election from './Election.js';
import Candidate from './Candidate.js';

const ElectionCandidate = sequelize.define('ElectionCandidate', {
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false
  },
  electionId: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: 'elections',
      key: 'id'
    }
  },
  candidateId: {
    type: DataTypes.STRING(36),
    allowNull: false,
    references: {
      model: 'candidates',
      key: 'id'
    }
  }
}, {
  tableName: 'election_candidates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Associations
ElectionCandidate.belongsTo(Election, { 
  foreignKey: 'electionId', 
  as: 'election' 
});

ElectionCandidate.belongsTo(Candidate, { 
  foreignKey: 'candidateId', 
  as: 'candidate' 
});

export default ElectionCandidate; 