import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';
import Election from './Election.js';
import Position from './Position.js';

const ElectionPosition = sequelize.define('ElectionPosition', {
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
  }
}, {
  tableName: 'election_positions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Associations
ElectionPosition.belongsTo(Election, { 
  foreignKey: 'electionId', 
  as: 'election' 
});

ElectionPosition.belongsTo(Position, { 
  foreignKey: 'positionId', 
  as: 'position' 
});

export default ElectionPosition; 