# 🚀 Voting System - Pull & Setup Guide

A comprehensive guide for setting up the Voting System on a new machine or after pulling from repository.

## 📋 Prerequisites

### **Required Software:**
- **Node.js** (v18.0.0 or higher)
- **MySQL** (or XAMPP/WAMP)
- **Git** (for pulling from repository)

### **Recommended MySQL Solutions:**
- **XAMPP** (includes MySQL, Apache, PHP): https://www.apachefriends.org/
- **WAMP** (Windows): https://www.wampserver.com/
- **MySQL Direct**: https://dev.mysql.com/downloads/
- **Docker**: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0`

## 🔄 Pull & Setup Process

### **Step 1: Clone/Pull Repository**
```bash
# If cloning for the first time
git clone <repository-url>
cd VotingSystem

# If pulling updates
git pull origin main
```

### **Step 2: Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Test database connection
npm run troubleshoot

# If database issues found, try auto-fix
npm run fix-db

# Reset database (if needed)
npm run reset-db

# Seed with comprehensive data
npm run seed

# Start development server
npm run dev
```

### **Step 3: Frontend Setup**
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Database Troubleshooting

### **If Database Connection Fails:**

#### **Option 1: Auto-Fix**
```bash
cd backend
npm run fix-db
```

#### **Option 2: Manual Troubleshooting**
```bash
cd backend
npm run troubleshoot
```

#### **Option 3: Reset Database**
```bash
cd backend
npm run reset-db
npm run seed
```

### **Common Database Issues:**

**Issue: "ECONNREFUSED"**
- MySQL service not running
- Wrong port (try 3306 or 3307)

**Issue: "Access denied"**
- Wrong password (try empty password or "root")
- Wrong username (should be "root")

**Issue: "Unknown database"**
- Database will be created automatically
- This is normal for first-time setup

## 🌱 Default Data Included

### **Admin Accounts:**
```
SuperAdmin: superadmin / superadmin123
Admin: admin1 / admin123
Admin: admin2 / admin123
Admin: admin3 / admin123
```

### **Sample Voters:**
```
Any voter email / voter123
Examples:
- alexandra.santos@student.edu / voter123
- miguel.cruz@student.edu / voter123
- isabella.reyes@student.edu / voter123
```

### **Comprehensive Data:**
- **12 Departments** (CS, IT, Engineering, Business, Arts & Sciences)
- **15 Courses** across all departments
- **15 Positions** (President, VP, Secretary, Treasurer, etc.)
- **18 Realistic Candidates** with detailed descriptions
- **18 Sample Voters** ready for testing
- **1 Sample Election** (starts tomorrow, runs 7 days)

## 🛠️ Available Scripts

### **Database Scripts:**
```bash
npm run troubleshoot    # Test database connections
npm run fix-db          # Auto-fix database configuration
npm run reset-db        # Reset database structure
npm run seed            # Seed with comprehensive data
npm run seed:reset      # Reset and seed database
```

### **Development Scripts:**
```bash
npm run dev             # Start development server
npm run start           # Start production server
npm run health          # Check server health
npm run status          # Check server status
```

### **Setup Scripts:**
```bash
npm run install:clean   # Clean install dependencies
```

## 🎯 Quick Start Commands

### **For New Installation:**
```bash
# Backend
cd backend
npm install
npm run setup-db

# Frontend
cd ../frontend
npm install
npm run dev
```

### **For Existing Installation:**
```bash
# Backend
cd backend
npm install
npm run seed
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev
```

### **For Database Issues:**
```bash
cd backend
npm run troubleshoot
npm run fix-db
npm run reset-db
npm run seed
npm run dev
```

## 🔍 Verification Steps

### **1. Check Backend:**
```bash
# Should show: "Server running on port 3000"
npm run dev

# Test health endpoint
curl http://localhost:3000/health
```

### **2. Check Frontend:**
```bash
# Should open in browser at http://localhost:5173
npm run dev
```

### **3. Test Login:**
- Go to http://localhost:5173
- Try logging in with default credentials
- Test different user roles

## 🚨 Troubleshooting

### **If Backend Won't Start:**
1. Check if MySQL is running
2. Run `npm run troubleshoot`
3. Run `npm run fix-db`
4. Check port 3000 is available

### **If Frontend Won't Start:**
1. Check if Node.js is installed
2. Run `npm install` in frontend directory
3. Check port 5173 is available

### **If Database Issues:**
1. Install XAMPP/WAMP if MySQL not installed
2. Start MySQL service
3. Run `npm run reset-db`
4. Run `npm run seed`

### **If Dependencies Issues:**
```bash
# Clean install
npm run install:clean

# Or manually
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

### **Common Error Messages:**

**"Database connection failed"**
- Run `npm run troubleshoot`
- Install MySQL/XAMPP if not installed

**"Table doesn't exist"**
- Run `npm run reset-db`
- Run `npm run seed`

**"Port already in use"**
- Change port in server.js
- Or kill process using the port

**"Module not found"**
- Run `npm install`
- Check Node.js version (requires 18+)

### **Getting Help:**
1. Check the main README.md for detailed documentation
2. Run troubleshooting scripts
3. Check console output for specific error messages
4. Verify all prerequisites are installed

## ✅ Success Checklist

- [ ] Repository pulled successfully
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Database connection working
- [ ] Database seeded with sample data
- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 5173
- [ ] Can login with default credentials
- [ ] All user roles working (SuperAdmin, Admin, Voter)
- [ ] Sample election visible and functional

## 🎉 You're Ready!

Once all steps are completed, your Voting System will be fully functional with:
- Complete user management
- Election creation and management
- Voting functionality
- Results tracking
- Comprehensive sample data for testing

Happy voting! 🗳️ 