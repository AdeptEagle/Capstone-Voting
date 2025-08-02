import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

const PasswordResetToken = sequelize.define('PasswordResetToken', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  user_type: {
    type: DataTypes.ENUM('voter', 'admin'),
    allowNull: false,
    validate: {
      isIn: [['voter', 'admin']]
    }
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  }
}, {
  tableName: 'password_reset_tokens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Static methods
PasswordResetToken.findByToken = async function(token) {
  return await this.findOne({ where: { token } });
};

PasswordResetToken.findByEmail = async function(email) {
  return await this.findOne({ where: { email } });
};

PasswordResetToken.deleteExpired = async function() {
  const now = new Date();
  return await this.destroy({
    where: {
      expires_at: {
        [sequelize.Op.lt]: now
      }
    }
  });
};

export default PasswordResetToken; 