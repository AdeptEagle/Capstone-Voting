# 📚 Voting System - Guides & Documentation

Comprehensive guides for setting up, troubleshooting, and deploying the Voting System.

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MySQL** (v8.0.0 or higher) or XAMPP/WAMP
- **Git** (for repository management)

### Quick Setup
```bash
# 1. Clone the repository
git clone <repository-url>
cd VotingSystem

# 2. Backend setup
cd backend
npm install
npm run setup-db  # Creates database and seeds data

# 3. Frontend setup
cd ../frontend
npm install
npm run dev

# 4. Access the application
# Backend: http://localhost:3000
# Frontend: http://localhost:5173
```

## 🗄️ Database Management

### Database Seeding & Data Persistence

The Voting System includes comprehensive database seeding capabilities that ensure data persists across deployments, cloning, and cloud migrations.

#### Available Seeding Scripts

```bash
# Create complete database with sample data
npm run create-db

# Add specific departments and courses
npm run seed-data

# Ensure SuperAdmin account exists
npm run seed-superadmin

# Run all in sequence (recommended)
npm run setup-db
```

#### What Gets Seeded

**Default Data:**
- Admin accounts (1 superadmin, 3 admins)
- 12 sample departments
- 15 sample courses
- 15 voting positions
- 18 sample candidates
- 21 sample voters
- 2 sample elections

**Additional Data (via seed-data):**
- 4 College departments
- 13 specific courses

**Permanent SuperAdmin (via seed-superadmin):**
- SuperAdmin account with full system access
- Username: Super admin -DevKerbs
- Password: superadmin123

#### Data Persistence Features

✅ **Survives Cloning**: Data remains when repository is cloned  
✅ **Cloud Deployments**: Persists across Railway, Vercel, etc.  
✅ **System Migrations**: Survives database migrations  
✅ **Fresh Installations**: Automatically added on new setups  
✅ **Environment Changes**: Works across different environments  

#### Technical Implementation

The seeding system uses:
- **ON DUPLICATE KEY UPDATE**: Prevents duplicate entries
- **Environment Variables**: Configurable database connections
- **Error Handling**: Graceful failure with troubleshooting
- **Logging**: Detailed progress and status reporting

#### Customizing Seeded Data

To add your own departments and courses:

1. **Edit the seeding script**:
   ```bash
   # Modify: backend/scripts/seed-departments-courses.js
   ```

2. **Add your data**:
   ```javascript
   const departments = [
     { id: 'dept-your-id', name: 'Your Department', created_by: superadminId }
   ];
   
   const courses = [
     { id: 'course-your-id', name: 'Your Course', departmentId: 'dept-your-id', created_by: superadminId }
   ];
   ```

3. **Run the script**:
   ```bash
   npm run seed-data
   ```

#### Database Scripts Reference

| Script | Purpose | Command |
|--------|---------|---------|
| `create-database.js` | Complete database setup | `npm run create-db` |
| `seed-departments-courses.js` | Add departments/courses | `npm run seed-data` |
| `seed-superadmin.js` | Ensure SuperAdmin exists | `npm run seed-superadmin` |
| `add-superadmin.js` | Add admin accounts | `node scripts/add-superadmin.js` |

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
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 🔧 Pull & Setup Guide

### After Pulling Updates
```bash
# Pull latest changes
git pull origin main

# Backend setup
cd backend
npm install
npm run troubleshoot
npm run seed

# Frontend setup
cd ../frontend
npm install
npm run dev
```

### Database Troubleshooting
```bash
# If database connection fails
cd backend
npm run fix-db

# Manual troubleshooting
npm run troubleshoot

# Reset database
npm run reset-db
npm run seed
```

### Common Database Issues

**Issue: "ECONNREFUSED"**
- MySQL service not running
- Wrong port (try 3306 or 3307)

**Issue: "Access denied"**
- Wrong password (try empty password or "root")
- Wrong username (should be "root")

**Issue: "Unknown database"**
- Database will be created automatically
- This is normal for first-time setup

## 🌱 Default Data

### Admin Accounts
```
SuperAdmin: superadmin / superadmin123
Admin: admin1 / admin123
Admin: admin2 / admin123
Admin: admin3 / admin123
```

### Sample Voters
```
Any voter email / voter123
Examples:
- alexandra.santos@student.edu / voter123
- miguel.cruz@student.edu / voter123
- isabella.reyes@student.edu / voter123
```

### Comprehensive Sample Data
- **12 Departments** (CS, IT, Engineering, Business, Arts & Sciences)
- **15 Courses** across all departments
- **15 Positions** (President, VP, Secretary, Treasurer, etc.)
- **18 Realistic Candidates** with detailed descriptions
- **18 Sample Voters** ready for testing
- **1 Sample Election** (starts tomorrow, runs 7 days)

## 🛠️ Available Scripts

### Database Scripts
```bash
npm run troubleshoot    # Test database connections
npm run fix-db          # Auto-fix database configuration
npm run reset-db        # Reset database structure
npm run seed            # Seed with comprehensive data
npm run seed:reset      # Reset and seed database
npm run setup-db        # Complete database setup
```

### Development Scripts
```bash
npm run dev             # Start development server
npm run start           # Start production server
npm run health          # Check server health
npm run status          # Check server status
```

### Setup Scripts
```bash
npm run install:clean   # Clean install dependencies
```

## 🚨 Troubleshooting Guide

### Backend Issues

#### Server Won't Start
```bash
# Check if MySQL is running
# Check port 3000 availability
npm run troubleshoot
npm run fix-db
```

#### Database Connection Issues
```bash
# Test database connection
npm run troubleshoot

# Auto-fix common issues
npm run fix-db

# Reset database completely
npm run reset-db
npm run seed
```

#### Dependencies Issues
```bash
# Clean install
npm run install:clean

# Manual clean install
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

#### Build Failures
```bash
# Check Node.js version (requires 18+)
node --version

# Clean install
rm -rf node_modules package-lock.json
npm install

# Check port 5173 availability
```

#### API Connection Issues
```bash
# Verify backend is running
curl http://localhost:3000/health

# Check environment variables
# Verify API_BASE_URL in frontend
```

### Common Error Messages

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

## 🐳 Docker Deployment Guide

### Prerequisites
- Docker and Docker Compose installed
- Git installed
- At least 2GB RAM available
- Ports 80, 3000, 3306, 6379 available

### One-Command Deployment
```bash
# Clone repository
git clone <repository-url>
cd VotingSystem

# Run deployment script
./deploy.sh
```

### Manual Docker Setup
```bash
# Start services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs

# Stop services
docker-compose down
```

### Docker Commands
```bash
# Full deployment
./deploy.sh

# Update services
./deploy.sh update

# Stop services
./deploy.sh stop

# View logs
./deploy.sh logs

# Restart services
./deploy.sh restart

# Backup database
./deploy.sh backup
```

## 🚀 Railway Deployment Guide

### Prerequisites
- Railway account (free tier available)
- GitHub repository with your code
- Railway CLI (optional but recommended)

### Railway Setup
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project
4. Click "Deploy from GitHub repo"
5. Select your Voting System repository

### Environment Variables

#### Backend Service Variables
```bash
# Database Configuration (Railway MySQL Plugin)
DB_HOST=${MYSQL_HOST}
DB_USER=${MYSQL_USER}
DB_PASSWORD=${MYSQL_PASSWORD}
DB_PORT=${MYSQL_PORT}
DB_NAME=${MYSQL_DATABASE}

# Server Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.railway.app
CORS_CREDENTIALS=true
```

#### Frontend Service Variables
```bash
# API Configuration
VITE_API_BASE_URL=https://your-backend-domain.railway.app/api
VITE_API_VERSION=v1
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Voting System
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
```

### Railway CLI Commands
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link your project
railway link

# Deploy
railway up

# View logs
railway logs

# Open Railway dashboard
railway open
```

## 🌐 Vercel Frontend Deployment

### Prerequisites
- Vercel account
- Railway backend deployed
- Vercel CLI (optional)

### Vercel Setup
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Add environment variable `VITE_API_BASE_URL`
5. Deploy!

### Environment Variables
```bash
# Vercel Environment Variables
VITE_API_BASE_URL=https://your-railway-backend-url.railway.app/api
```

### Vercel CLI Commands
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
cd frontend
vercel --prod

# Check deployment
vercel ls

# Check environment variables
vercel env ls
```

## 🔒 Security Configuration

### SSL/TLS Setup
```bash
# Generate SSL certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem \
    -out ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=your-domain.com"
```

### Security Headers
The application includes:
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Content-Security-Policy: default-src 'self'
- Strict-Transport-Security: max-age=31536000

### Rate Limiting
- API endpoints: 10 requests/second
- Login endpoints: 5 requests/minute
- Burst allowance: 20 requests

## 📊 Monitoring Setup

### Health Checks
```bash
# Backend health check
curl http://localhost:3000/health

# Frontend health check
curl http://localhost:5173/
```

### Log Monitoring
```bash
# View backend logs
docker-compose logs backend

# View frontend logs
docker-compose logs frontend

# View database logs
docker-compose logs mysql
```

## 💾 Backup and Recovery

### Database Backup
```bash
# Create backup
./deploy.sh backup

# Manual backup
docker-compose exec mysql mysqldump -u root -p${DB_PASSWORD} ${DB_NAME} > backup.sql
```

### Database Restore
```bash
# Restore from backup
docker-compose exec -T mysql mysql -u root -p${DB_PASSWORD} ${DB_NAME} < backup.sql
```

### Full System Backup
```bash
# Backup all data
tar -czf voting-system-backup-$(date +%Y%m%d).tar.gz \
    backend/uploads \
    backend/backups \
    backend/logs \
    ssl \
    monitoring
```

## 🔄 Update Process

### Automatic Updates
```bash
# Pull latest changes
git pull origin main

# Update services
./deploy.sh update
```

### Manual Updates
```bash
# Stop services
docker-compose down

# Pull changes
git pull origin main

# Rebuild images
docker-compose build

# Start services
docker-compose up -d

# Initialize database (if needed)
docker-compose exec backend node scripts/create-database.js
```

## 🎯 Verification Steps

### 1. Check Backend
```bash
# Should show: "Server running on port 3000"
npm run dev

# Test health endpoint
curl http://localhost:3000/health
```

### 2. Check Frontend
```bash
# Should open in browser at http://localhost:5173
npm run dev
```

### 3. Test Login
- Go to http://localhost:5173
- Try logging in with default credentials
- Test different user roles

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

## 📞 Support

### Getting Help
1. Check the main README.md for detailed documentation
2. Run troubleshooting scripts
3. Check console output for specific error messages
4. Verify all prerequisites are installed

### Common Error Messages

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

## 🎉 You're Ready!

Once all steps are completed, your Voting System will be fully functional with:
- Complete user management
- Election creation and management
- Voting functionality
- Results tracking
- Comprehensive sample data for testing

Happy voting! 🗳️ 