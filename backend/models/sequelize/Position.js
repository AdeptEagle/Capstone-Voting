import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

const Position = sequelize.define('Position', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  voteLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'positions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Position; 