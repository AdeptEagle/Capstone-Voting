import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';
import Department from './Department.js';
import Admin from './Admin.js';

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  departmentId: {
    type: DataTypes.STRING(36),
    allowNull: false,
    references: {
      model: 'departments',
      key: 'id'
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
  tableName: 'courses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Course.belongsTo(Department, { 
  foreignKey: 'departmentId', 
  as: 'department' 
});

Course.belongsTo(Admin, { 
  foreignKey: 'created_by', 
  as: 'creator' 
});

export default Course; 