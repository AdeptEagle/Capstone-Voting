# Voting System Deployment Summary

## 🎯 **Project Overview**
- **Frontend:** React + Vite (Deployed on Vercel)
- **Backend:** Node.js + Express (Deployed on Railway)
- **Database:** MySQL (Railway Plugin)
- **Repository:** GitHub with `deployment` branch

## 🌐 **Live URLs**
- **Frontend:** https://capstone-voting.vercel.app
- **Backend:** https://backend-production-219d.up.railway.app
- **Health Check:** https://backend-production-219d.up.railway.app/health

## 🔑 **Permanent Login Credentials**
- **Superadmin Username:** `DevEagle`
- **Superadmin Password:** `devEagle123`
- **Email:** devEagle@votingsystem.com
- **Role:** superadmin

## 🏢 **Permanent Departments (4 Colleges)**
1. **CBM** - College of Business and Management
2. **CCS** - College of Computer Studies
3. **CEA** - College of Education and Arts
4. **CoE** - College of Engineering

## 📚 **Permanent Courses (12 Programs)**

### College of Business and Management (CBM)
- **BSHM** - BS in Hospitality Management
- **BSA** - BS in Accountancy
- **BSBA-MM** - BS in Business Administration Major in Marketing Management
- **BSBA-HRDM** - BS in Business Administration Major in Human Resource Development Management

### College of Computer Studies (CCS)
- **BSIT** - BS in Information Technology

### College of Education and Arts (CEA)
- **BEEd** - Bachelor in Elementary Education - General Education
- **BSEd-English** - Bachelor in Secondary Education Major in English
- **BMC** - Bachelor in Mass Communications

### College of Engineering (CoE)
- **BSEE** - BS in Electrical Engineering
- **BSCE** - BS in Civil Engineering
- **BSME** - BS in Mechanical Engineering
- **BSIE** - BS in Industrial Engineering

## 🗳️ **Default Data**
- **15 Positions:** President, Vice President, Secretary, Treasurer, etc.
- **1 Sample Voter:** Sample Student (BSIT)
- **No candidates or elections** (to be added manually)

## ⚙️ **Key Configuration Files**

### Railway Configuration (`railway.toml`)
```toml
[services.voting-system-backend.envs]
MYSQL_URL = "${{ MySQL.MYSQL_URL }}"

[services.voting-system-frontend.envs]
VITE_API_BASE_URL = "https://backend-production-219d.up.railway.app/api"
```

### Frontend API Configuration (`frontend/src/services/api.js`)
```javascript
const API_BASE_URL = 'https://backend-production-219d.up.railway.app/api';
```

### Backend CORS Configuration (`backend/server.js`)
```javascript
const corsOptions = {
  origin: [
    'https://capstone-voting.vercel.app',
    'https://capstone-voting.vercel.app/*'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
```

## 🔄 **Automatic Database Seeding**
- **File:** `backend/scripts/clean-seed-data.js`
- **Trigger:** Runs automatically when backend starts
- **Function:** `seedWithCleanData()` in `backend/config/database.js`
- **Behavior:** Always ensures permanent default data exists

## 🚀 **Deployment Process**

### 1. GitHub Branch
- **Default Branch:** `deployment`
- **Auto-deploy:** On push to `deployment` branch

### 2. Railway Services
- **Backend Service:** Automatically deploys from GitHub
- **MySQL Service:** Manual redeploy when needed
- **Frontend Service:** Deployed via Vercel

### 3. Database Initialization
- **Automatic:** Runs on every backend startup
- **Safe:** Uses `ON DUPLICATE KEY UPDATE`
- **Complete:** Creates all tables + permanent data

## 🛠️ **Troubleshooting Commands**

### Check Backend Health
```bash
curl https://backend-production-219d.up.railway.app/health
```

### Test Database Connection
```bash
curl https://backend-production-219d.up.railway.app/test-deployment
```

### Manual Database Seeding (if needed)
```bash
cd backend
node scripts/create-database.js
```

## 📋 **Recent Fixes Applied**

### 1. CORS Configuration
- Added explicit Vercel domain to allowed origins
- Added preflight request handling
- Fixed cross-origin communication

### 2. API Base URL
- Hardcoded API URL in frontend to bypass Vercel env issues
- Updated Railway configuration for correct backend URL

### 3. Missing API Exports
- Added all missing API functions to `frontend/src/services/api.js`
- Added array validation to prevent `.map()` errors

### 4. Database Seeding
- Created automatic seeding system
- Implemented permanent default data
- Added DevEagle superadmin account

## 🎉 **Current Status**
- ✅ **Frontend:** Deployed and working
- ✅ **Backend:** Deployed and working
- ✅ **Database:** Connected with permanent data
- ✅ **CORS:** Fixed and working
- ✅ **Login:** DevEagle superadmin working
- ✅ **Auto-seeding:** Permanent data always available

## 📞 **Support Information**
- **Repository:** https://github.com/AdeptEagle/Capstone-Voting
- **Branch:** `deployment`
- **Last Updated:** July 30, 2025
- **Version:** 1.0.1

---

**Note:** This system is now fully automated. Every deployment will automatically include the permanent default data, and you'll never need to manually run database scripts again. 