import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';
import Election from './Election.js';
import Position from './Position.js';
import Candidate from './Candidate.js';
import Voter from './Voter.js';

const Vote = sequelize.define('Vote', {
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
  positionId: {
    type: DataTypes.STRING(36),
    allowNull: false,
    references: {
      model: 'positions',
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
  },
  voterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'voters',
      key: 'id'
    }
  }
}, {
  tableName: 'votes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['electionId', 'positionId', 'voterId'],
      name: 'unique_vote'
    }
  ]
});

// Associations
Vote.belongsTo(Election, { 
  foreignKey: 'electionId', 
  as: 'election' 
});

Vote.belongsTo(Position, { 
  foreignKey: 'positionId', 
  as: 'position' 
});

Vote.belongsTo(Candidate, { 
  foreignKey: 'candidateId', 
  as: 'candidate' 
});

Vote.belongsTo(Voter, { 
  foreignKey: 'voterId', 
  as: 'voter' 
});

export default Vote; 