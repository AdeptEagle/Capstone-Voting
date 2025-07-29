# Voting System Deployment Guide

This guide provides comprehensive instructions for deploying the Voting System in various environments.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git installed
- At least 2GB RAM available
- Ports 80, 3000, 3306, 6379 available

### One-Command Deployment
```bash
# Clone the repository
git clone <repository-url>
cd VotingSystem

# Run deployment script
./deploy.sh
```

## 📋 Environment Variables

### Backend Environment Variables (`backend/env.example`)

#### Database Configuration
```bash
DB_HOST=localhost          # Database host
DB_USER=root              # Database username
DB_PASSWORD=root          # Database password
DB_PORT=3306              # Database port
DB_NAME=voting_system     # Database name
DB_CHARSET=utf8mb4        # Database charset
DB_TIMEZONE=+00:00        # Database timezone
```

#### Server Configuration
```bash
NODE_ENV=development       # Environment (development/production)
PORT=3000                 # Server port
HOST=0.0.0.0             # Server host
```

#### Security Configuration
```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h       # JWT token expiry
JWT_REFRESH_EXPIRES_IN=7d # Refresh token expiry
BCRYPT_ROUNDS=10         # Password hashing rounds
SESSION_SECRET=your-session-secret-key-change-this-in-production
```

#### CORS Configuration
```bash
CORS_ORIGIN=http://localhost:5173  # Allowed origins
CORS_CREDENTIALS=true              # Allow credentials
```

#### File Upload Configuration
```bash
UPLOAD_MAX_SIZE=5242880           # Max file size (5MB)
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif
UPLOAD_DESTINATION=uploads         # Upload directory
```

#### Email Configuration (for password reset)
```bash
SMTP_HOST=smtp.gmail.com          # SMTP server
SMTP_PORT=587                     # SMTP port
SMTP_USER=your-email@gmail.com    # SMTP username
SMTP_PASS=your-app-password       # SMTP password
SMTP_FROM=noreply@votingsystem.com # From email
```

#### Rate Limiting
```bash
RATE_LIMIT_WINDOW_MS=900000       # Rate limit window (15 minutes)
RATE_LIMIT_MAX_REQUESTS=100       # Max requests per window
```

### Frontend Environment Variables (`frontend/env.example`)

#### API Configuration
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_VERSION=v1
VITE_API_TIMEOUT=10000
```

#### App Configuration
```bash
VITE_APP_NAME=Voting System
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Secure Online Voting System
```

#### Authentication Configuration
```bash
VITE_JWT_STORAGE_KEY=voting_system_token
VITE_REFRESH_TOKEN_KEY=voting_system_refresh_token
VITE_TOKEN_EXPIRY_CHECK_INTERVAL=60000
```

#### Feature Flags
```bash
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_PASSWORD_RESET=true
VITE_ENABLE_FILE_UPLOAD=true
VITE_ENABLE_REAL_TIME_UPDATES=false
VITE_ENABLE_ANALYTICS=false
```

## 🐳 Docker Deployment

### Docker Compose Services

#### MySQL Database
- **Image**: mysql:8.0
- **Port**: 3306
- **Volume**: mysql_data
- **Health Check**: MySQL ping

#### Redis Cache
- **Image**: redis:7-alpine
- **Port**: 6379
- **Volume**: redis_data
- **Health Check**: Redis ping

#### Backend API
- **Build**: Custom Dockerfile
- **Port**: 3000
- **Dependencies**: MySQL, Redis
- **Health Check**: HTTP /health endpoint

#### Frontend
- **Build**: Custom Dockerfile with Nginx
- **Ports**: 80, 443
- **Dependencies**: Backend
- **Health Check**: HTTP /health endpoint

#### Nginx Reverse Proxy (Optional)
- **Image**: nginx:alpine
- **Port**: 8080
- **SSL Support**: Yes
- **Rate Limiting**: Yes

#### Monitoring (Optional)
- **Prometheus**: Port 9090
- **Grafana**: Port 3001
- **Profile**: monitoring

### Deployment Commands

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

## 🔧 Manual Deployment

### 1. Environment Setup
```bash
# Copy environment templates
cp backend/env.example .env
cp frontend/env.example frontend/.env

# Edit environment variables
nano .env
nano frontend/.env
```

### 2. Database Setup
```bash
# Start MySQL
docker-compose up -d mysql

# Wait for MySQL to be ready
docker-compose exec mysql mysqladmin ping -h"localhost"

# Initialize database
docker-compose exec backend node scripts/create-database.js
```

### 3. Backend Deployment
```bash
# Build backend image
docker build -t voting-system-backend ./backend

# Start backend service
docker-compose up -d backend

# Check backend health
curl http://localhost:3000/health
```

### 4. Frontend Deployment
```bash
# Build frontend image
docker build -t voting-system-frontend ./frontend

# Start frontend service
docker-compose up -d frontend

# Check frontend health
curl http://localhost/health
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
The application includes the following security headers:
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

### Prometheus Configuration
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'voting-system-backend'
    static_configs:
      - targets: ['backend:3000']
    metrics_path: '/metrics'

  - job_name: 'voting-system-frontend'
    static_configs:
      - targets: ['frontend:80']
    metrics_path: '/health'
```

### Grafana Setup
- **URL**: http://localhost:3001
- **Username**: admin
- **Password**: admin (change on first login)

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

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check MySQL status
docker-compose exec mysql mysqladmin ping -h"localhost"

# Check database logs
docker-compose logs mysql

# Reset database
docker-compose down
docker volume rm votingsystem_mysql_data
docker-compose up -d mysql
```

#### Backend Issues
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Check backend health
curl http://localhost:3000/health
```

#### Frontend Issues
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :80
netstat -tulpn | grep :3000

# Change ports in docker-compose.yml if needed
```

### Log Locations
- **Backend logs**: `backend/logs/`
- **Frontend logs**: Docker container logs
- **MySQL logs**: Docker container logs
- **Nginx logs**: `/var/log/nginx/` (inside container)

## 📈 Performance Optimization

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_votes_election_id ON votes(election_id);
CREATE INDEX idx_votes_voter_id ON votes(voter_id);
CREATE INDEX idx_candidates_election_id ON candidates(election_id);
```

### Nginx Optimization
- Gzip compression enabled
- Static file caching (1 year)
- HTML files no-cache
- Rate limiting configured

### Docker Optimization
- Multi-stage builds
- Alpine Linux base images
- Non-root user execution
- Health checks implemented

## 🔧 Development Setup

### Local Development
```bash
# Start only database and Redis
docker-compose up -d mysql redis

# Run backend in development mode
cd backend
npm install
npm run dev

# Run frontend in development mode
cd frontend
npm install
npm run dev
```

### Environment Variables for Development
```bash
# Backend
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root

# Frontend
VITE_API_BASE_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

## 📝 Default Credentials

### Superadmin
- **Username**: superadmin
- **Password**: superadmin123
- **Role**: superadmin

### Admin
- **Username**: admin1
- **Password**: admin123
- **Role**: admin

## 🌐 Production Checklist

- [ ] Update all environment variables
- [ ] Set strong JWT secrets
- [ ] Configure SSL certificates
- [ ] Set up monitoring
- [ ] Configure backup schedule
- [ ] Set up logging
- [ ] Configure rate limiting
- [ ] Test all functionality
- [ ] Set up domain and DNS
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Monitor system resources

## 📞 Support

For deployment issues:
1. Check the logs: `./deploy.sh logs`
2. Verify environment variables
3. Check Docker and Docker Compose versions
4. Ensure all ports are available
5. Verify sufficient system resources

## 📄 License

This deployment guide is part of the Voting System project. 