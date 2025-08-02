import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';
import Department from './Department.js';
import Course from './Course.js';
import bcrypt from 'bcryptjs';

const Voter = sequelize.define('Voter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  studentId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: [6, 255]
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
  hasVoted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'voters',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (voter) => {
      if (voter.password) {
        voter.password = await bcrypt.hash(voter.password, 10);
      }
    },
    beforeUpdate: async (voter) => {
      if (voter.changed('password')) {
        voter.password = await bcrypt.hash(voter.password, 10);
      }
    }
  }
});

// Instance methods
Voter.prototype.validatePassword = async function(password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

// Static methods
Voter.findByEmail = async function(email) {
  return await this.findOne({ where: { email } });
};

Voter.findByStudentId = async function(studentId) {
  return await this.findOne({ where: { studentId } });
};

Voter.updatePassword = async function(id, hashedPassword) {
  return await this.update(
    { password: hashedPassword },
    { where: { id } }
  );
};

// Associations
Voter.belongsTo(Department, { 
  foreignKey: 'departmentId', 
  as: 'department' 
});

Voter.belongsTo(Course, { 
  foreignKey: 'courseId', 
  as: 'course' 
});

export default Voter; 