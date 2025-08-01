# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v16+)
- MySQL (v8.0+)
- Git

## Quick Setup Steps

### 1. Clone & Install
```bash
git clone <repository-url>
cd VotingSystem
cd backend && npm install
cd ../frontend && npm install
```

### 2. Database Setup
```bash
# Option 1: Automatic setup (recommended)
cd backend
npm run setup-db

# Option 2: Manual setup
mysql -u root -p
CREATE DATABASE voting_system;
exit;
```

### 3. Configure Database (if needed)
Edit `backend/config/database.js`:
```javascript
const dbConfig = {
  host: "localhost",
  user: "root", 
  password: "your-mysql-password", // Change this
  port: 3306
};
```

### 4. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Default Login Credentials

### Superadmin
- Username: `superadmin`
- Password: `superadmin123`

### Admin
- Username: `admin1` 
- Password: `admin123`

## Your Current Data Will Be Loaded
- 4 Admins (including superadmin)
- 13 Departments
- 15 Courses
- 15 Positions
- 18 Candidates
- 21 Voters
- 21 Elections
- 147 Election Positions
- 367 Election Candidates

## Troubleshooting

### Database Connection Issues
```bash
cd backend
npm run setup-db      # Complete database setup
npm run troubleshoot  # Database connection diagnostics
npm run fix-db        # Auto-fix common database issues
npm run reset-db      # Reset database completely
```

### Reset Database
```bash
cd backend
npm run reset-db
```

## Available Scripts

```bash
# Database
npm run setup-db          # Complete database setup
npm run setup-superadmin  # Set up default superadmin credentials
npm run seed              # Seed with clean data
npm run reset-db          # Reset database
npm run troubleshoot      # Database help
npm run fix-db            # Auto-fix database issues
```

## Setting Up Default Credentials

After cloning the system, run this command to ensure the default superadmin credentials are properly set:

```bash
cd backend
npm run setup-superadmin
```

This will create/update the superadmin account with:
- **Username:** `superadmin`
- **Password:** `superadmin123` 