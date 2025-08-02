import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';
import Admin from './Admin.js';

const Election = sequelize.define('Election', {
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'paused', 'stopped', 'ended', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'active', 'paused', 'stopped', 'ended', 'cancelled']]
    }
  },
  created_by: {
    type: DataTypes.STRING(36),
    allowNull: false,
    references: {
      model: 'admins',
      key: 'id'
    }
  }
}, {
  tableName: 'elections',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Election.belongsTo(Admin, { 
  foreignKey: 'created_by', 
  as: 'creator' 
});

export default Election; 