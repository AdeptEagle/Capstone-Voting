import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';
import Position from './Position.js';
import Department from './Department.js';
import Course from './Course.js';

const Candidate = sequelize.define('Candidate', {
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
  positionId: {
    type: DataTypes.STRING(36),
    allowNull: false,
    references: {
      model: 'positions',
      key: 'id'
    }
  },
  departmentId: {
    type: DataTypes.STRING(36),
    allowNull: true,
    references: {
      model: 'departments',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.STRING(36),
    allowNull: true,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  photoUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'candidates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Candidate.belongsTo(Position, { 
  foreignKey: 'positionId', 
  as: 'position' 
});

Candidate.belongsTo(Department, { 
  foreignKey: 'departmentId', 
  as: 'department' 
});

Candidate.belongsTo(Course, { 
  foreignKey: 'courseId', 
  as: 'course' 
});

export default Candidate; 