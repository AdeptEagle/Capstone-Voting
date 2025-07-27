# Voting System Backend

This is the optimized backend for the Voting System application, organized with a clean architecture pattern.

## Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── database.js        # Database configuration and initialization
│   └── constants.js       # Application constants
├── middleware/            # Express middleware
│   ├── auth.js           # Authentication and authorization middleware
│   └── upload.js         # File upload middleware
├── models/               # Database models (data access layer)
│   ├── PositionModel.js
│   ├── CandidateModel.js
│   ├── VoterModel.js
│   ├── VoteModel.js
│   ├── ElectionModel.js
│   ├── AdminModel.js
│   └── index.js
├── controllers/          # Request handlers (business logic)
│   ├── PositionController.js
│   ├── CandidateController.js
│   ├── VoterController.js
│   ├── VoteController.js
│   ├── ElectionController.js
│   ├── AuthController.js
│   ├── AdminController.js
│   └── index.js
├── services/            # Business logic services
│   ├── AuthService.js
│   └── VotingService.js
├── routes/              # Express routes
│   ├── positionRoutes.js
│   ├── candidateRoutes.js
│   ├── voterRoutes.js
│   ├── electionRoutes.js
│   ├── authRoutes.js
│   ├── voteRoutes.js
│   └── adminRoutes.js
├── utils/               # Utility functions and helpers
│   ├── validation.js
│   └── logger.js
├── uploads/             # File upload directory
├── server.js            # Main application file
└── package.json
```

## Architecture Overview

### Layers

1. **Routes Layer** (`/routes/`)
   - Defines API endpoints
   - Handles HTTP methods and URL patterns
   - Applies middleware (authentication, file upload, etc.)

2. **Controllers Layer** (`/controllers/`)
   - Handles HTTP requests and responses
   - Validates input data
   - Calls appropriate services
   - Returns formatted responses

3. **Services Layer** (`/services/`)
   - Contains business logic
   - Orchestrates multiple models
   - Handles complex operations

4. **Models Layer** (`/models/`)
   - Database operations
   - Data access logic
   - Query building

5. **Middleware Layer** (`/middleware/`)
   - Authentication and authorization
   - File upload handling
   - Request processing

6. **Configuration Layer** (`/config/`)
   - Database configuration
   - Application constants
   - Environment settings

7. **Utilities Layer** (`/utils/`)
   - Validation functions
   - Logging utilities
   - Helper functions

## Key Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (superadmin, admin, user)
- Middleware for protecting routes

### File Upload
- Multer configuration for image uploads
- File size and type validation
- Automatic file naming and storage

### Database
- MySQL database with proper indexing
- Connection pooling
- Automatic table creation and migration

### Error Handling
- Centralized error handling
- Proper HTTP status codes
- Detailed error messages

### Logging
- Structured logging system
- Configurable log levels
- Specialized logging for votes and authentication

## API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/user/register` - User registration
- `POST /api/auth/user/login` - User login

### Positions
- `GET /api/positions` - Get all positions
- `POST /api/positions` - Create position
- `PUT /api/positions/:id` - Update position
- `DELETE /api/positions/:id` - Delete position

### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create candidate (with photo upload)
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### Voters
- `GET /api/voters` - Get all voters
- `POST /api/voters` - Create voter
- `PUT /api/voters/:id` - Update voter
- `DELETE /api/voters/:id` - Delete voter

### Elections
- `GET /api/elections` - Get all elections
- `GET /api/elections/active` - Get active election
- `POST /api/elections` - Create election (admin only)
- `PUT /api/elections/:id` - Update election (admin only)
- `DELETE /api/elections/:id` - Delete election (admin only)

### Votes
- `GET /api/votes` - Get all votes
- `POST /api/votes` - Submit vote
- `GET /api/votes/results` - Get voting results

### Admin Management
- `GET /api/admins` - Get all admins (superadmin only)
- `POST /api/admins` - Create admin (superadmin only)
- `PUT /api/admins/:id` - Update admin (superadmin only)
- `DELETE /api/admins/:id` - Delete admin (superadmin only)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure database:
   - Update database settings in `config/database.js`
   - Ensure MySQL server is running

3. Start the server:
   ```bash
   npm start
   ```

4. The server will run on `http://localhost:3000`

## Environment Variables

- `LOG_LEVEL` - Set logging level (ERROR, WARN, INFO, DEBUG)
- Database credentials in `config/database.js`

## Benefits of This Structure

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Maintainability**: Easy to locate and modify specific functionality
3. **Scalability**: Easy to add new features and endpoints
4. **Testability**: Each layer can be tested independently
5. **Reusability**: Services and utilities can be reused across controllers
6. **Readability**: Clear file organization makes code easy to understand

## Migration from Monolithic Structure

The original `server.js` file was 847 lines long and contained all functionality mixed together. This new structure:

- Reduces the main server file to ~60 lines
- Separates concerns into logical modules
- Makes the codebase more maintainable and scalable
- Improves code reusability and testability
- Follows industry best practices for Node.js applications 