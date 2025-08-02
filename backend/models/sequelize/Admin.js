import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';
import bcrypt from 'bcryptjs';

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [3, 255]
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255]
    }
  },
  role: {
    type: DataTypes.ENUM('superadmin', 'admin'),
    allowNull: false,
    defaultValue: 'admin',
    validate: {
      isIn: [['superadmin', 'admin']]
    }
  }
}, {
  tableName: 'admins',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (admin) => {
      if (admin.password) {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
    },
    beforeUpdate: async (admin) => {
      if (admin.changed('password')) {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
    }
  }
});

// Instance methods
Admin.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Static methods
Admin.findByUsername = async function(username) {
  return await this.findOne({ where: { username } });
};

Admin.findByEmail = async function(email) {
  return await this.findOne({ where: { email } });
};

Admin.updatePassword = async function(id, hashedPassword) {
  return await this.update(
    { password: hashedPassword },
    { where: { id } }
  );
};

export default Admin; 