# Deployment Guide

## Database Setup for New Deployments

When deploying this voting system to a new cloud platform, you need to set up the database with the required data.

### Quick Setup (Recommended)

After deploying to your cloud platform, run these commands in the Railway terminal or your cloud platform's terminal:

```bash
# Navigate to backend directory
cd backend

# Set up database with all required data
npm run setup-db-fresh
```

### Manual Setup Steps

If you prefer to run steps individually:

```bash
# 1. Create database tables
npm run create-db

# 2. Reset and populate departments and courses
npm run reset-db

# 3. Create superadmin account
npm run seed-superadmin
```

### What Gets Created

The setup scripts will create:

#### Departments
- **COE** - College of Engineering
- **CBM** - College of Business and Management  
- **CCS** - College of Computer Studies
- **CEA** - College of Education and Arts

#### Courses by Department

**College of Engineering (COE):**
- BS in Electrical Engineering
- BS in Civil Engineering
- BS in Mechanical Engineering
- BS in Industrial Engineering

**College of Business and Management (CBM):**
- BS in Hospitality Management
- BS in Accountancy
- BS in Business Administration Major in Marketing Management
- BS in Business Administration Major in Human Resource Development Management

**College of Computer Studies (CCS):**
- BS in Information Technology

**College of Education and Arts (CEA):**
- Bachelor in Elementary Education
- General Education
- Bachelor in Secondary Education Major in English
- Bachelor in Mass Communications

### Verification

After running the setup, you can verify the data by:

1. **Check the admin dashboard** - Departments should show with courses
2. **Try user registration** - Should work with any department/course combination
3. **Check API endpoints**:
   - `GET /api/departments` - Should return 4 departments
   - `GET /api/departments/COE/courses` - Should return 4 engineering courses

### Troubleshooting

If you encounter issues:

1. **Database connection errors**: Check your environment variables
2. **Permission errors**: Ensure your database user has CREATE/INSERT permissions
3. **Foreign key errors**: Run the scripts in order (create-db → reset-db → seed-superadmin)

### Environment Variables Required

Make sure these are set in your cloud platform:

```
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_PORT=3306
DB_NAME=voting_system
JWT_SECRET=your-jwt-secret
```

### Notes

- The `reset-db` script will clear existing departments and courses before creating new ones
- This ensures consistent data structure across all deployments
- The superadmin account will be created with default credentials (check the seed script for details) 