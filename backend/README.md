# Voting System Backend

A robust Node.js/Express backend API for the voting system with MySQL database support.

## 🚀 Features

- **Environment-based Configuration**: Support for development, test, and production environments
- **Database Optimization**: Connection pooling, proper indexing, and error handling
- **Security**: JWT authentication, password hashing, CORS protection
- **File Upload**: Secure file handling with validation
- **Testing**: Comprehensive API testing suite
- **Error Handling**: Graceful error handling and logging
- **Health Monitoring**: Health check endpoints and status monitoring

## 📋 Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **MySQL**: Version 8.0 or higher
- **npm**: Version 8.0.0 or higher

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

#### Option A: Complete Setup (Recommended)
```bash
# Create database with all tables and sample data
npm run create-db

# Add additional departments and courses
npm run seed-data

# Or run both in sequence
npm run setup-db
```

#### Option B: Automatic Setup
The server will automatically create the database and tables on first run.

#### Option C: Manual Setup
```sql
-- Connect to MySQL and run:
CREATE DATABASE voting_system;
CREATE DATABASE voting_system_test;
```

### 3. Environment Configuration

Copy the example environment file:
```bash
cp env.example .env
```

Edit `.env` with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_PORT=3306

# Environment
NODE_ENV=development
PORT=3000
```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Test Mode
```bash
npm run test:db
```

## 🧪 Testing

### Quick Health Check
```bash
npm run health
```

### API Testing
```bash
# Run comprehensive API tests
npm test

# Or run the test script directly
node scripts/test-api.js
```

### Test Database Setup
```bash
# Set up test database with sample data
npm run test:setup
```

## 📊 API Endpoints

### Health & Status
- `GET /health` - Health check endpoint
- `GET /` - API status and version

### Authentication
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/login` - Voter login
- `GET /api/auth/profile` - Get user profile

### Elections
- `GET /api/elections` - Get all elections
- `POST /api/elections` - Create election
- `PUT /api/elections/:id` - Update election
- `DELETE /api/elections/:id` - Delete election

### Positions
- `GET /api/positions` - Get all positions
- `POST /api/positions` - Create position
- `PUT /api/positions/:id` - Update position
- `DELETE /api/positions/:id` - Delete position

### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### Voters
- `GET /api/voters` - Get all voters
- `POST /api/voters` - Create voter
- `PUT /api/voters/:id` - Update voter
- `DELETE /api/voters/:id` - Delete voter

### Voting
- `POST /api/votes` - Cast vote
- `GET /api/votes` - Get vote results

### Password Reset
- `POST /api/password-reset/forgot-password` - Request password reset
- `GET /api/password-reset/verify-token/:token` - Verify reset token
- `POST /api/password-reset/reset-password` - Reset password

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `3000` | Server port |
| `DB_HOST` | `localhost` | Database host |
| `DB_USER` | `root` | Database user |
| `DB_PASSWORD` | `root` | Database password |
| `DB_PORT` | `3306` | Database port |
| `IS_TEST` | `false` | Test mode flag |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend URL for CORS |

### Database Configuration

The system supports two database modes:

1. **Production Database** (`voting_system`)
   - Used for actual voting operations
   - Contains real voter and election data

2. **Test Database** (`voting_system_test`)
   - Used for testing and development
   - Contains sample data for testing
   - Activated with `IS_TEST=true`

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```
❌ Database connection failed: connect ECONNREFUSED
```

**Solution:**
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify MySQL port (default: 3306)

#### 2. Port Already in Use
```
❌ Port 3000 is already in use
```

**Solution:**
- Change port in `.env`: `PORT=3001`
- Or kill the process using the port

#### 3. Permission Denied
```
❌ ER_ACCESS_DENIED_ERROR
```

**Solution:**
- Check MySQL user permissions
- Verify username/password in `.env`
- Create MySQL user if needed

#### 4. Module Not Found
```
❌ Cannot find module 'dotenv'
```

**Solution:**
```bash
npm install
# or
npm run install:clean
```

### Debug Mode

Enable detailed logging:
```bash
NODE_ENV=development npm run dev
```

### Database Reset

To reset the database:
```bash
# Drop and recreate database
mysql -u root -p
DROP DATABASE voting_system;
CREATE DATABASE voting_system;
exit

# Restart server
npm run dev
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/             # Route controllers
├── middleware/              # Custom middleware
├── models/                  # Database models
├── routes/                  # API routes
├── scripts/                 # Utility scripts
│   ├── setup-test-db.js    # Test database setup
│   └── test-api.js         # API testing
├── services/                # Business logic
├── uploads/                 # File uploads
├── utils/                   # Utility functions
├── .env                     # Environment variables
├── env.example             # Environment template
├── package.json            # Dependencies
├── README.md               # This file
└── server.js               # Main server file
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Configurable cross-origin requests
- **Input Validation**: Request data validation
- **SQL Injection Protection**: Parameterized queries
- **File Upload Security**: Type and size validation

## 📈 Performance Optimizations

- **Connection Pooling**: Efficient database connections
- **Database Indexing**: Optimized query performance
- **Request Logging**: Performance monitoring
- **Error Handling**: Graceful error recovery
- **Caching Headers**: Static file optimization

## 🧪 Testing Strategy

### Test Types
1. **Unit Tests**: Individual function testing
2. **Integration Tests**: API endpoint testing
3. **Database Tests**: Data persistence testing
4. **Security Tests**: Authentication and authorization

### Running Tests
```bash
# Full test suite
npm test

# Database tests only
npm run test:db

# API tests only
npm run test:api
```

## 📝 Logging

The server provides comprehensive logging:

- **Request Logging**: All API requests with timestamps
- **Error Logging**: Detailed error information
- **Database Logging**: Connection and query status
- **Performance Logging**: Response times and metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the logs for error details
3. Test with the provided test scripts
4. Create an issue with detailed information 