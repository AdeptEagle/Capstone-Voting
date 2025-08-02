import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';
import Admin from './Admin.js';

const Department = sequelize.define('Department', {
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
  created_by: {
    type: DataTypes.STRING(36),
    allowNull: false,
    references: {
      model: 'admins',
      key: 'id'
    }
  }
}, {
  tableName: 'departments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Department.belongsTo(Admin, { 
  foreignKey: 'created_by', 
  as: 'creator' 
});

export default Department; 