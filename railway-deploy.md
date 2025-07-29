# Railway Deployment Guide

This guide provides step-by-step instructions for deploying the Voting System on Railway.

## 🚀 Quick Start

### Prerequisites
- Railway account (free tier available)
- GitHub repository with your code
- Railway CLI (optional but recommended)

## 📋 Railway Setup

### 1. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### 2. Connect Your Repository
1. Click "Deploy from GitHub repo"
2. Select your Voting System repository
3. Railway will automatically detect the services

## 🔧 Service Configuration

### Backend Service

#### Environment Variables (Set in Railway Dashboard)
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

# Security Configuration
BCRYPT_ROUNDS=10
SESSION_SECRET=your-session-secret-key-change-this-in-production

# File Upload Configuration
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif
UPLOAD_DESTINATION=uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# API Configuration
API_VERSION=v1
API_PREFIX=/api

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.railway.app
```

#### Railway Configuration
- **Build Command**: `npm ci --only=production`
- **Start Command**: `npm start`
- **Health Check Path**: `/health`
- **Port**: `3000`

### Frontend Service

#### Environment Variables (Set in Railway Dashboard)
```bash
# API Configuration
VITE_API_BASE_URL=https://your-backend-domain.railway.app/api
VITE_API_VERSION=v1
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Voting System
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Secure Online Voting System

# Environment
VITE_NODE_ENV=production
VITE_APP_ENV=production

# Authentication Configuration
VITE_JWT_STORAGE_KEY=voting_system_token
VITE_REFRESH_TOKEN_KEY=voting_system_refresh_token
VITE_TOKEN_EXPIRY_CHECK_INTERVAL=60000

# File Upload Configuration
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif
VITE_UPLOAD_ENDPOINT=/api/upload

# UI Configuration
VITE_THEME=light
VITE_LANGUAGE=en
VITE_TIMEZONE=UTC
VITE_DATE_FORMAT=YYYY-MM-DD
VITE_TIME_FORMAT=HH:mm:ss

# Feature Flags
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_PASSWORD_RESET=true
VITE_ENABLE_FILE_UPLOAD=true
VITE_ENABLE_REAL_TIME_UPDATES=false
VITE_ENABLE_ANALYTICS=false

# Security Configuration
VITE_CSP_ENABLED=true
VITE_XSS_PROTECTION=true
VITE_CONTENT_TYPE_OPTIONS=true

# Performance Configuration
VITE_ENABLE_SERVICE_WORKER=false
VITE_ENABLE_PWA=false
VITE_CACHE_STRATEGY=network-first
```

#### Railway Configuration
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm run preview`
- **Health Check Path**: `/`
- **Port**: `4173`

## 🗄️ Database Setup

### Option 1: Railway MySQL Plugin (Recommended)
1. In your Railway project, click "New"
2. Select "Database" → "MySQL"
3. Railway will automatically provide environment variables
4. Update your backend environment variables to use the MySQL plugin variables

### Option 2: External Database
If using an external database (like PlanetScale, Supabase, etc.):
1. Get your database connection details
2. Set the database environment variables manually in Railway

## 🔄 Deployment Process

### 1. Initial Deployment
```bash
# Clone your repository
git clone <your-repo-url>
cd VotingSystem

# Install Railway CLI (optional)
npm install -g @railway/cli

# Login to Railway
railway login

# Link your project
railway link

# Deploy
railway up
```

### 2. Environment Variables Setup
1. Go to your Railway project dashboard
2. Select the backend service
3. Go to "Variables" tab
4. Add all the environment variables listed above
5. Repeat for the frontend service

### 3. Database Initialization
After deployment:
1. Go to your backend service logs
2. Check if the database initialization script ran
3. If not, you can manually trigger it via Railway's shell

## 🔗 Service Communication

### Frontend to Backend Communication
The frontend needs to communicate with the backend. Update the `VITE_API_BASE_URL` in your frontend environment variables to point to your backend service URL.

Example:
```bash
VITE_API_BASE_URL=https://voting-system-backend-production.up.railway.app/api
```

### Custom Domains
Railway provides free custom domains:
1. Go to your service settings
2. Click "Domains"
3. Add your custom domain
4. Update CORS settings accordingly

## 📊 Monitoring and Logs

### Viewing Logs
1. Go to your Railway project dashboard
2. Select a service
3. Click "Deployments" tab
4. Click on a deployment to view logs

### Health Checks
Railway automatically monitors your services:
- Backend: `/health` endpoint
- Frontend: `/` endpoint

## 🔒 Security Considerations

### Environment Variables
- Never commit sensitive data to your repository
- Use Railway's environment variable system
- Rotate secrets regularly

### CORS Configuration
Update your backend CORS settings to allow your frontend domain:
```javascript
CORS_ORIGIN=https://your-frontend-domain.railway.app
```

### SSL/TLS
Railway automatically provides SSL certificates for all domains.

## 🚀 Deployment Commands

### Using Railway CLI
```bash
# Deploy to Railway
railway up

# View logs
railway logs

# Open Railway dashboard
railway open

# Check service status
railway status

# Redeploy
railway up --detach
```

### Using GitHub Integration
1. Push to your main branch
2. Railway automatically deploys
3. Monitor deployment in Railway dashboard

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs
railway logs

# Common fixes:
# 1. Ensure all dependencies are in package.json
# 2. Check Node.js version compatibility
# 3. Verify build commands
```

#### Database Connection Issues
```bash
# Check database environment variables
railway variables

# Verify database is running
railway logs --service mysql
```

#### Frontend Not Loading
```bash
# Check if API URL is correct
# Verify CORS settings
# Check frontend build logs
railway logs --service frontend
```

### Debug Commands
```bash
# SSH into service (if available)
railway shell

# View real-time logs
railway logs --follow

# Check service health
curl https://your-service.railway.app/health
```

## 📈 Scaling

### Railway Free Tier Limits
- **Backend**: 1 replica, 512MB RAM
- **Frontend**: 1 replica, 512MB RAM
- **Database**: 1GB storage
- **Bandwidth**: 100GB/month

### Upgrading (Paid Plans)
- More replicas for high availability
- Increased RAM and CPU
- Larger database storage
- More bandwidth

## 🔄 Updates and Maintenance

### Updating Your Application
```bash
# Push changes to GitHub
git push origin main

# Railway automatically redeploys
# Monitor deployment in dashboard
```

### Database Migrations
```bash
# Run migrations manually if needed
railway shell --service backend
node scripts/create-database.js
```

### Backup Strategy
- Railway MySQL plugin includes automatic backups
- Consider external backup solutions for critical data
- Export data regularly using Railway's export feature

## 📞 Support

### Railway Support
- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app/)

### Application Support
- Check logs: `railway logs`
- Monitor health: Visit `/health` endpoints
- Review deployment history in Railway dashboard

## 🎯 Best Practices

### Performance
- Use Railway's CDN for static assets
- Optimize build times with proper caching
- Monitor resource usage

### Security
- Rotate secrets regularly
- Use environment variables for all sensitive data
- Enable Railway's security features

### Monitoring
- Set up alerts for service health
- Monitor resource usage
- Track error rates and response times

## 📝 Default Credentials

After deployment, your application will have these default accounts:
- **Superadmin**: `superadmin` / `superadmin123`
- **Admin**: `admin1` / `admin123`

## 🌐 Accessing Your Application

Once deployed, you can access:
- **Frontend**: `https://your-frontend-service.railway.app`
- **Backend API**: `https://your-backend-service.railway.app/api`
- **Health Check**: `https://your-backend-service.railway.app/health`

## 🎉 Success Checklist

- [ ] Both services deployed successfully
- [ ] Environment variables configured
- [ ] Database connected and initialized
- [ ] Frontend can communicate with backend
- [ ] Health checks passing
- [ ] Custom domain configured (optional)
- [ ] SSL certificates working
- [ ] Default accounts accessible
- [ ] File uploads working (if enabled)
- [ ] All features tested

Your Voting System is now ready for production use on Railway! 🚀 