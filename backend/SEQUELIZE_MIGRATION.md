# Sequelize Migration Guide

This guide explains how to migrate from the current MySQL2-based database setup to Sequelize ORM.

## Overview

The migration involves:
1. **New Sequelize Configuration** - `config/sequelize.js`
2. **New Sequelize Models** - `models/sequelize/`
3. **Updated Controllers** - `controllers/sequelize/`
4. **Migration Scripts** - `scripts/migrate-to-sequelize.js`

## Benefits of Sequelize

- **Type Safety**: Better validation and type checking
- **Relationships**: Easy to define and use associations
- **Migrations**: Version-controlled database schema changes
- **Query Building**: Powerful query interface with less SQL
- **Validation**: Built-in validation rules
- **Hooks**: Automatic password hashing, timestamps, etc.

## File Structure

```
backend/
├── config/
│   ├── database.js          # Old MySQL2 setup
│   └── sequelize.js         # New Sequelize setup
├── models/
│   ├── AdminModel.js        # Old models
│   └── sequelize/           # New Sequelize models
│       ├── index.js
│       ├── Admin.js
│       ├── Department.js
│       ├── Course.js
│       ├── Position.js
│       ├── Candidate.js
│       ├── Voter.js
│       ├── Election.js
│       ├── Vote.js
│       ├── PasswordResetToken.js
│       ├── ElectionPosition.js
│       └── ElectionCandidate.js
├── controllers/
│   ├── AdminController.js   # Old controllers
│   └── sequelize/           # New Sequelize controllers
│       └── AdminController.js
└── scripts/
    └── migrate-to-sequelize.js
```

## Installation

The required packages have been installed:
- `sequelize` - The ORM
- `sequelize-cli` - Command line tools
- `mysql2` - MySQL driver (already installed)
- `dotenv` - Environment variables

## Migration Steps

### 1. Run the Migration Script

```bash
cd backend
node scripts/migrate-to-sequelize.js
```

This will:
- Test the database connection
- Create/update tables using Sequelize
- Preserve existing data

### 2. Update Controllers

Replace the old model imports with Sequelize models:

**Before:**
```javascript
import { AdminModel } from "../models/AdminModel.js";
```

**After:**
```javascript
import { Admin } from '../models/sequelize/index.js';
```

### 3. Update Database Operations

**Before (MySQL2):**
```javascript
const admins = await AdminModel.getAll();
```

**After (Sequelize):**
```javascript
const admins = await Admin.findAll({
  attributes: ['id', 'username', 'email', 'role', 'created_at']
});
```

## Model Comparisons

### Admin Model

**Old (AdminModel.js):**
```javascript
static async getAll() {
  const db = createConnection();
  return new Promise((resolve, reject) => {
    const query = "SELECT id, username, email, role, created_at FROM admins";
    db.query(query, (err, data) => {
      db.end();
      if (err) reject(err);
      else resolve(data);
    });
  });
}
```

**New (Admin.js):**
```javascript
// In controller:
const admins = await Admin.findAll({
  attributes: ['id', 'username', 'email', 'role', 'created_at'],
  order: [['created_at', 'DESC']]
});
```

### Password Hashing

**Old:** Manual hashing in controller
**New:** Automatic via Sequelize hooks

```javascript
// In Admin.js model:
hooks: {
  beforeCreate: async (admin) => {
    if (admin.password) {
      admin.password = await bcrypt.hash(admin.password, 10);
    }
  }
}
```

## Key Features

### 1. Associations

Sequelize makes relationships easy:

```javascript
// Many-to-many
Election.belongsToMany(Position, {
  through: ElectionPosition,
  foreignKey: 'electionId',
  otherKey: 'positionId',
  as: 'positions'
});

// One-to-many
Department.hasMany(Course, {
  foreignKey: 'departmentId',
  as: 'courses'
});
```

### 2. Validation

Built-in validation rules:

```javascript
username: {
  type: DataTypes.STRING(255),
  allowNull: false,
  unique: true,
  validate: {
    notEmpty: true,
    len: [3, 255]
  }
}
```

### 3. Querying

Powerful query interface:

```javascript
// Find with conditions
const admins = await Admin.findAll({
  where: {
    role: 'admin',
    username: { [Op.like]: '%john%' }
  },
  include: [
    { model: Department, as: 'departments' }
  ]
});

// Pagination
const admins = await Admin.findAndCountAll({
  limit: 10,
  offset: 20
});
```

### 4. Transactions

Easy transaction support:

```javascript
const result = await sequelize.transaction(async (t) => {
  const admin = await Admin.create(adminData, { transaction: t });
  const department = await Department.create(deptData, { transaction: t });
  return { admin, department };
});
```

## Error Handling

Sequelize provides specific error types:

```javascript
try {
  const admin = await Admin.create(req.body);
} catch (error) {
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ 
      error: 'Validation error', 
      details: error.errors.map(e => e.message) 
    });
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ 
      error: 'Username already exists' 
    });
  }
  res.status(500).json({ error: error.message });
}
```

## Migration Checklist

- [ ] Run migration script
- [ ] Test database connection
- [ ] Update AdminController (example provided)
- [ ] Update AuthController
- [ ] Update DepartmentController
- [ ] Update CourseController
- [ ] Update PositionController
- [ ] Update CandidateController
- [ ] Update VoterController
- [ ] Update ElectionController
- [ ] Update VoteController
- [ ] Update PasswordResetController
- [ ] Test all endpoints
- [ ] Remove old models
- [ ] Remove old database.js

## Testing

Test the migration:

```bash
# Test connection
node -e "import('./config/sequelize.js').then(m => m.testConnection())"

# Test models
node -e "import('./models/sequelize/index.js').then(() => console.log('Models loaded successfully'))"
```

## Rollback Plan

If issues arise:

1. Keep the old `database.js` and models
2. Gradually migrate controllers one by one
3. Test thoroughly before removing old code
4. Keep backups of the database

## Next Steps

1. **Immediate**: Run the migration script
2. **Short-term**: Update controllers one by one
3. **Medium-term**: Add Sequelize migrations for schema changes
4. **Long-term**: Consider adding TypeScript for better type safety

## Support

If you encounter issues:

1. Check the Sequelize documentation
2. Review the error messages carefully
3. Test with a small subset of data first
4. Use the migration script to reset if needed 