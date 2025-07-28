# Voting System

A complete role-based voting system with backend API and frontend interface built with Node.js, Express, MySQL, and React. Features SuperAdmin, Admin, and User roles with different permissions and capabilities.

## 🚀 Recent Major Upgrades (Latest Session)

### 📅 Upgrade Session: Comprehensive Default Data & Database Seeding
**Date:** Current Session  
**Focus:** Complete database seeding with realistic default data for immediate system use

### 🌱 Database Seeding System

#### **1. Comprehensive Default Data**
**New Feature:** Complete database seeding with realistic sample data

**Seeded Data Includes:**
- **👑 Admin Accounts**: 1 SuperAdmin + 3 Admin accounts
- **🏢 Departments**: 12 comprehensive departments (CS, IT, Engineering, Business, Arts & Sciences)
- **📚 Courses**: 15 courses across all departments
- **🏛️ Positions**: 15 positions (President, VP, Secretary, Treasurer, etc.)
- **👥 Candidates**: 18 realistic candidates with detailed descriptions
- **🗳️ Voters**: 18 sample voters across all departments
- **🗳️ Elections**: 1 sample election ready for testing

#### **2. Default Login Credentials**
```
SuperAdmin: superadmin / superadmin123
Admin: admin1 / admin123
Voter: Any voter email / voter123
```

#### **3. Seed Data Scripts**
**New Scripts:**
- `npm run seed` - Run comprehensive database seeding
- `npm run seed:reset` - Reset and seed database with fresh data
- Automatic seeding on database initialization

#### **4. Realistic Sample Data**
**Departments:** Computer Science, IT, Civil Engineering, Mechanical Engineering, Electrical Engineering, Business Administration, Accountancy, Marketing Management, Psychology, English Literature, Mathematics, Biology

**Courses:** BS Computer Science, BS Information Technology, BS Civil Engineering, BS Mechanical Engineering, BS Business Administration, BS Accountancy, BS Psychology, BA English Literature, BS Mathematics, BS Biology, and more

**Positions:** President, Vice President, Secretary, Treasurer, Auditor, Public Relations Officer, Board Members (with vote limits)

**Candidates:** 18 realistic candidates with:
- Diverse backgrounds across all departments
- Detailed descriptions and qualifications
- Proper position assignments
- Realistic Filipino names and backgrounds

**Voters:** 18 sample voters with:
- Realistic student IDs and email addresses
- Department and course assignments
- Ready for immediate voting

#### **5. Sample Election**
- **Title**: "Student Council Election 2024"
- **Status**: Pending (starts tomorrow)
- **Duration**: 7 days
- **Positions**: President, VP, Secretary, Treasurer, Auditor, PRO, Board Members
- **Candidates**: All 18 candidates assigned to election

#### **6. How to Use Seed Data**
**For New Users:**
1. Run `npm run setup` to initialize the system
2. Database will automatically be seeded with comprehensive data
3. Login with default credentials to start using the system immediately

**For Existing Users:**
1. Run `npm run seed` to add comprehensive sample data
2. Or run `npm run seed:reset` to reset and seed with fresh data
3. All existing data will be preserved (uses INSERT IGNORE)

**For Development:**
1. Run `npm run seed` anytime to populate test data
2. Use the sample election for testing voting functionality
3. Use sample voters to test the voting process

**Benefits:**
- ✅ **Immediate Use**: System ready to use out of the box
- ✅ **Realistic Data**: Comprehensive sample data for testing
- ✅ **No Setup Required**: Automatic seeding on initialization
- ✅ **Safe**: Uses INSERT IGNORE to preserve existing data
- ✅ **Comprehensive**: Covers all system features and roles

### 📅 Upgrade Session: Backend Optimization & Frontend Routing Restructure
**Date:** Current Session  
**Focus:** Backend modularization, error handling, and complete frontend routing separation

### 🔧 Backend Architecture Overhaul

#### **1. Modular Backend Structure**
**Before:** Monolithic `server.js` (847 lines)  
**After:** Modular architecture with separate concerns

**New Backend Structure:**
```
backend/
├── config/
│   ├── database.js          # Database connection & initialization
│   └── constants.js         # Application constants (JWT_SECRET, etc.)
├── middleware/
│   ├── auth.js              # Authentication & authorization middleware
│   └── upload.js            # File upload handling (Multer)
├── models/
│   ├── PositionModel.js     # Position CRUD operations
│   ├── CandidateModel.js    # Candidate CRUD operations
│   ├── VoterModel.js        # Voter CRUD operations
│   ├── VoteModel.js         # Vote CRUD operations
│   ├── ElectionModel.js     # Election CRUD operations
│   ├── AdminModel.js        # Admin CRUD operations
│   ├── ResultsModel.js      # Results aggregation (NEW)
│   └── index.js             # Model exports
├── services/
│   ├── AuthService.js       # Authentication business logic
│   └── VotingService.js     # Voting business logic
├── controllers/
│   ├── PositionController.js
│   ├── CandidateController.js
│   ├── VoterController.js
│   ├── VoteController.js
│   ├── ElectionController.js
│   ├── AuthController.js
│   └── AdminController.js
├── routes/
│   ├── positionRoutes.js
│   ├── candidateRoutes.js
│   ├── voterRoutes.js
│   ├── electionRoutes.js
│   ├── authRoutes.js
│   ├── voteRoutes.js
│   └── adminRoutes.js
├── utils/
│   ├── validation.js        # Data validation utilities
│   └── logger.js            # Logging utility
└── server.js                # Main entry point (68 lines)
```

#### **2. Enhanced Error Handling**
- **Centralized Error Handling**: Consistent error responses across all endpoints
- **Null Value Protection**: Comprehensive null checks throughout the application
- **Graceful Degradation**: Fallback values for missing or corrupted data
- **Try-Catch Blocks**: Proper error handling in all async operations

#### **3. Authentication & Authorization Improvements**
- **JWT Token Validation**: Enhanced token checking with expiration handling
- **Role-Based Access Control**: Improved middleware for role validation
- **SuperAdmin Privileges**: Full access without restrictions
- **Token Interceptor**: Automatic JWT token attachment to API requests

### 🎨 Frontend Enhancements

#### **1. Component Error Handling**
**Fixed Components:**
- **ElectionStatus.jsx**: Added null checks for election properties
- **Elections.jsx**: Fixed status preservation during edit operations
- **AdminDashboard.jsx**: Improved quick actions navigation
- **SuperAdminDashboard.jsx**: Fixed "View Results" button routing

#### **2. Election History System**
**New Components:**
- **ElectionHistory.jsx**: Dedicated page for viewing completed elections
- **ElectionHistory.css**: Styled components for history display
- **Enhanced Elections.jsx**: Added "End Election" and "View History" functionality
- **Updated Sidebar.jsx**: Added "Election History" navigation link

**Key Features:**
- **Preserved Elections**: Ended elections saved to history instead of deletion
- **Historical Data**: Complete election data including votes, results, statistics
- **Single Active Policy**: Only one active election allowed at a time
- **End vs Delete**: Clear distinction between preserving and permanent removal

#### **2. API Service Layer**
**Enhanced `frontend/src/services/api.js`:**
- **Admin Management Functions**: `getAdmins`, `createAdmin`, `updateAdmin`, `deleteAdmin`
- **Authentication Functions**: `adminLogin`, `userRegister`, `userLogin`
- **Election Functions**: `getElections`, `createElection`, `updateElection`, `deleteElection`
- **Results Function**: `getResults` with proper endpoint
- **Token Interceptor**: Automatic JWT token attachment

#### **3. Authentication Service**
**Enhanced `frontend/src/services/auth.js`:**
- **checkCurrentUser()**: JWT token decoding and validation
- **hasRole()**: Role checking utility
- **isSuperAdmin()**: SuperAdmin role verification
- **isAdmin()**: Admin role verification

#### **4. Routing Improvements**
**Fixed `frontend/src/App.jsx`:**
- **Route Order**: Fixed `/results` route positioning to prevent conflicts
- **Role Protection**: Proper role-based route protection
- **PrivateRoute Component**: Enhanced authentication and authorization logic

### 🛣️ Frontend Routing Restructure (Major Upgrade)

#### **1. Complete Route Separation**
**Before:** Confusing shared routes with conditional logic  
**After:** Clean role-based route separation

**New Route Structure:**
```
Frontend Routes:
├── Public Routes
│   ├── /              # User Login (default)
│   ├── /admin-login   # Admin Login
│   ├── /user-login    # User Login
│   └── /register      # User Registration
├── SuperAdmin Routes (/superadmin/*)
│   ├── /superadmin              # SuperAdmin Dashboard
│   └── /superadmin/manage-admins # Manage Admins (exclusive)
├── Admin Routes (/admin/*)
│   ├── /admin                   # Admin Dashboard
│   ├── /admin/positions         # Manage Positions
│   ├── /admin/candidates        # Manage Candidates
│   ├── /admin/voters            # Manage Voters
│   ├── /admin/elections         # Manage Elections
│   ├── /admin/results           # View Results
│   └── /admin/vote-traceability # Vote Traceability
└── User Routes (/user/*)
    ├── /user/dashboard          # User Dashboard
    ├── /user/vote               # Vote Interface
    ├── /user/candidates         # View Candidates (read-only)
    └── /user/results            # View Results (read-only)
```

#### **2. Route Protection Components**
**New Protection Components:**
- **`AdminRoute`**: Protects routes for both `admin` and `superadmin` roles
- **`SuperAdminRoute`**: Protects routes for `superadmin` only
- **`UserRoute`**: Protects routes for `user` only

#### **3. Layout Components**
**New Layout Components:**
- **`AdminLayout`**: Shared layout for admin and superadmin pages
- **`UserLayout`**: Dedicated layout for user pages

#### **4. Updated Components**
**Navigation Updates:**
- **Sidebar**: Updated all navigation links to use new routes
- **UserDashboard**: All buttons now navigate to `/user/*` routes
- **AdminDashboard**: All buttons now navigate to `/admin/*` routes
- **SuperAdminDashboard**: All buttons now navigate to `/admin/*` routes (except manage-admins)

**Login Redirects:**
- **AdminLogin**: Redirects to `/superadmin` or `/admin` based on role
- **UserLogin**: Redirects to `/user/dashboard`
- **UserRegister**: Redirects to `/user/dashboard`

#### **5. Backward Compatibility**
**Legacy Route Redirects:**
- `/dashboard` → `/user/dashboard`
- `/vote` → `/user/vote`
- `/candidates` → `/user/candidates`
- `/results` → `/user/results`
- `/positions` → `/admin/positions`
- `/voters` → `/admin/voters`
- `/elections` → `/admin/elections`
- `/vote-traceability` → `/admin/vote-traceability`

#### **6. Key Benefits**
- **🔒 Clear Separation**: No more confusing shared routes with conditional logic
- **🛡️ Better Security**: Role-specific route protection
- **🧹 Cleaner Code**: No more "wacky what ifs and whens"
- **👥 Better UX**: Users and admins have distinct navigation paths
- **🔧 Easier Maintenance**: Clear separation of concerns
- **🔄 Backward Compatible**: Legacy routes redirect to new structure
- **Redirect Logic**: Improved login redirects based on intended role

### 🐛 Critical Bug Fixes

#### **1. Election Status Preservation**
**Issue:** Ballot status lost during edit operations  
**Fix:** Preserve `editingElection.status` during update operations  
**Impact:** Restart buttons now remain visible after editing

#### **2. Null Value Crashes**
**Issue:** `Cannot read properties of null (reading 'charAt')` errors  
**Fix:** Comprehensive null checks in ElectionStatus and Elections components  
**Impact:** No more blue screen crashes on incomplete data

#### **3. Admin Dashboard Routing**
**Issue:** "View Results" button redirecting to login page  
**Fix:** Reordered routes and fixed role checking logic  
**Impact:** Proper navigation for admin and superadmin users

#### **4. SuperAdmin Access**
**Issue:** SuperAdmin "View Results" button going to admin page  
**Fix:** Corrected navigation path from `/admin` to `/results`  
**Impact:** SuperAdmin now has full access to all features

### 📊 Performance Improvements

#### **1. Backend Performance**
- **Modular Architecture**: Better code organization and maintainability
- **Database Connection Pooling**: Improved database performance
- **Error Handling**: Reduced server crashes and improved stability
- **Logging**: Better debugging and monitoring capabilities

#### **2. Frontend Performance**
- **API Service Layer**: Centralized API calls with better error handling
- **Component Optimization**: Reduced unnecessary re-renders
- **Route Optimization**: Faster navigation and better user experience
- **State Management**: Improved component state handling

### 🔒 Security Enhancements

#### **1. Authentication**
- **JWT Token Validation**: Enhanced token security and expiration handling
- **Role Verification**: Improved role-based access control
- **Token Interceptor**: Secure automatic token management

#### **2. Data Validation**
- **Input Validation**: Enhanced data validation throughout the application
- **Null Safety**: Protection against null/undefined value attacks
- **Error Boundaries**: Graceful error handling without exposing sensitive data

### 🧪 Testing & Quality Assurance

#### **1. Error Scenarios Tested**
- ✅ **Null Election Status**: Handles missing status gracefully
- ✅ **Invalid Dates**: Proper error handling for date operations
- ✅ **Missing User Data**: Fallback values for incomplete user information
- ✅ **Authentication Failures**: Proper redirects and error messages
- ✅ **Route Conflicts**: Fixed navigation issues between different user roles

#### **2. User Experience Improvements**
- ✅ **Loading States**: Better user feedback during operations
- ✅ **Error Messages**: Clear and helpful error messages
- ✅ **Navigation**: Smooth navigation between different sections
- ✅ **Responsive Design**: Consistent experience across devices

### 📈 Code Quality Metrics

#### **Before vs After**
- **Backend Lines of Code**: 847 → 68 (main server.js)
- **Modular Components**: 0 → 15+ separate modules
- **Error Handling**: Basic → Comprehensive
- **Code Maintainability**: Low → High
- **Debugging Capability**: Limited → Extensive

### 🎯 Key Benefits Achieved

1. **Maintainability**: Modular architecture makes code easier to maintain
2. **Scalability**: New features can be added without affecting existing code
3. **Reliability**: Comprehensive error handling prevents crashes
4. **Security**: Enhanced authentication and authorization
5. **User Experience**: Smooth navigation and better error feedback
6. **Developer Experience**: Better debugging and development workflow

### 🔄 Migration Notes

**For Existing Users:**
- No database changes required
- Backward compatible with existing data
- Enhanced security and performance
- Improved user experience

**For Developers:**
- New modular structure for easier development
- Enhanced error handling for better debugging
- Improved API documentation and consistency
- Better separation of concerns

## 📋 Version History

### 🏷️ Version 2.1.0 (Current) - Complete Frontend Routing Restructure & Enhanced Documentation
**Date:** Current Session  
**Type:** Major Release  
**Focus:** Complete frontend routing separation, enhanced error handling, and comprehensive documentation

#### **🔧 Major Changes**
- **Complete Frontend Routing Restructure**: Full separation of admin and user routes
- **Enhanced Error Handling**: Comprehensive null checks and error boundaries
- **Election History System**: New components for historical data preservation
- **API Service Layer**: Centralized API calls with better error handling
- **Authentication Service**: Enhanced JWT token management
- **Documentation Overhaul**: Comprehensive README files for all components

#### **🛣️ New Frontend Routing Structure**
```
Frontend Routes:
├── Public Routes
│   ├── /              # User Login (default)
│   ├── /admin-login   # Admin Login
│   ├── /user-login    # User Login
│   └── /register      # User Registration
├── SuperAdmin Routes (/superadmin/*)
│   ├── /superadmin              # SuperAdmin Dashboard
│   └── /superadmin/manage-admins # Manage Admins (exclusive)
├── Admin Routes (/admin/*)
│   ├── /admin                   # Admin Dashboard
│   ├── /admin/positions         # Manage Positions
│   ├── /admin/candidates        # Manage Candidates
│   ├── /admin/voters            # Manage Voters
│   ├── /admin/elections         # Manage Elections
│   ├── /admin/results           # View Results
│   └── /admin/vote-traceability # Vote Traceability
└── User Routes (/user/*)
    ├── /user/dashboard          # User Dashboard
    ├── /user/vote               # Vote Interface
    ├── /user/candidates         # View Candidates (read-only)
    └── /user/results            # View Results (read-only)
```

#### **📁 New Documentation Structure**
```
Documentation:
├── README.md                    # Main project documentation
├── backend/README.md            # Backend architecture & API docs
└── frontend/README.md           # Frontend structure & features
```

#### **🐛 Critical Fixes**
- Election status preservation during edits
- Null value crash prevention
- Admin/SuperAdmin routing issues
- SuperAdmin access restrictions
- **Complete route separation for better security and UX**
- **Enhanced error handling for all components**

#### **📊 Metrics**
- **Route Clarity**: Confusing shared routes → Clean role-based separation
- **Error Handling**: Basic → Comprehensive
- **User Experience**: Improved navigation and feedback
- **Code Maintainability**: Enhanced separation of concerns
- **Documentation**: Complete coverage of all components and features

---

### 🏷️ Version 2.0.0 - Backend Optimization & Frontend Enhancements
**Date:** 27/7/25  
**Type:** Major Release  
**Focus:** Backend modularization, error handling, and routing fixes

#### **🔧 Major Changes**
- **Backend Architecture**: Complete modularization from monolithic to layered architecture
- **Error Handling**: Comprehensive null checks and error boundaries
- **Authentication**: Enhanced JWT validation and role-based access control
- **Routing**: Fixed navigation issues and route conflicts
- **Frontend Routing**: Complete separation of admin and user routes

#### **📁 New Backend Structure**
```
backend/
├── config/          # Database & constants
├── middleware/      # Auth & upload middleware
├── models/          # Database models (7 modules)
├── services/        # Business logic layer
├── controllers/     # Request handlers (7 modules)
├── routes/          # API routes (7 modules)
├── utils/           # Validation & logging
└── server.js        # Main entry (68 lines vs 847)
```

#### **🛣️ New Frontend Routing Structure**
```
Frontend Routes:
├── Public Routes
│   ├── /              # User Login (default)
│   ├── /admin-login   # Admin Login
│   ├── /user-login    # User Login
│   └── /register      # User Registration
├── SuperAdmin Routes (/superadmin/*)
│   ├── /superadmin              # SuperAdmin Dashboard
│   └── /superadmin/manage-admins # Manage Admins (exclusive)
├── Admin Routes (/admin/*)
│   ├── /admin                   # Admin Dashboard
│   ├── /admin/positions         # Manage Positions
│   ├── /admin/candidates        # Manage Candidates
│   ├── /admin/voters            # Manage Voters
│   ├── /admin/elections         # Manage Elections
│   ├── /admin/results           # View Results
│   └── /admin/vote-traceability # Vote Traceability
└── User Routes (/user/*)
    ├── /user/dashboard          # User Dashboard
    ├── /user/vote               # Vote Interface
    ├── /user/candidates         # View Candidates (read-only)
    └── /user/results            # View Results (read-only)
```

#### **🐛 Critical Fixes**
- Election status preservation during edits
- Null value crash prevention
- Admin/SuperAdmin routing issues
- SuperAdmin access restrictions
- **User "View Candidates" routing fix**
- **Complete route separation for better security and UX**

#### **📊 Metrics**
- **Backend LOC**: 847 → 68 (main server.js)
- **Modular Components**: 0 → 15+ modules
- **Error Handling**: Basic → Comprehensive
- **Code Maintainability**: Low → High
- **Route Clarity**: Confusing shared routes → Clean role-based separation

---

### 🏷️ Version 1.0.0 (Initial Release) - Basic Voting System
**Date:** Initial Development  
**Type:** Initial Release  
**Focus:** Core voting functionality with role-based access

#### **🎯 Core Features Implemented**
- **Role-Based Authentication**: SuperAdmin, Admin, User roles
- **JWT Authentication**: Secure token-based login system
- **Position Management**: Create, edit, delete voting positions
- **Candidate Management**: Add candidates with photos
- **Voter Management**: Register voters with voting lockout
- **Voting System**: One-time voting with automatic lockout
- **Real-time Results**: Live voting results with charts
- **Responsive Design**: Desktop and mobile compatibility

#### **🏗️ Architecture**
- **Backend**: Monolithic Node.js/Express server (847 lines)
- **Frontend**: React with React Router and Bootstrap
- **Database**: MySQL with auto-creation scripts
- **Authentication**: JWT with bcrypt password hashing

#### **📁 Initial Structure**
```
VotingSystem/
├── backend/
│   ├── server.js              # Monolithic server
│   ├── package.json
│   └── database_setup.sql     # Database initialization
├── frontend/
│   ├── src/
│   │   ├── Pages/             # Role-based pages
│   │   ├── services/          # API services
│   │   └── App.jsx            # Routing
│   └── package.json
└── README.md
```

#### **🔐 Security Features**
- JWT token authentication
- Password hashing with bcryptjs
- Role-based authorization
- Voting lockout mechanism
- Protected routes

#### **🎨 User Interface**
- **SuperAdmin Dashboard**: Admin management, system overview
- **Admin Dashboard**: Election management, results viewing
- **User Dashboard**: Voting interface, candidate browsing
- **Responsive Design**: Bootstrap-based UI

#### **📊 Database Schema**
- **admins**: Admin accounts with roles
- **positions**: Voting positions with vote limits
- **candidates**: Candidates with photos and descriptions
- **voters**: Registered voters with hasVoted flag
- **votes**: Individual vote records

#### **🚀 Deployment Ready**
- **Default SuperAdmin**: `superadmin` / `superadmin123`
- **Auto Database Setup**: Tables created on server start
- **CORS Configuration**: Frontend-backend communication
- **Error Handling**: Basic error responses

---

### 📈 Version Evolution Summary

| Version | Date | Type | Focus | Key Achievement |
|---------|------|------|-------|-----------------|
| 1.0.0 | Initial | Release | Core Features | Basic voting system with role-based access |
| 2.0.0 | 27/7/25 | Major | Architecture | Modular backend, enhanced error handling |
| 2.1.0 | Current | Major | Frontend & Docs | Complete routing restructure & documentation |

### 🔄 Breaking Changes

#### **Version 2.1.0**
- **None**: Backward compatible with existing data
- **Frontend Routes**: Legacy routes redirect to new structure
- **API Endpoints**: Same endpoints, enhanced error handling
- **Database**: No schema changes required
- **Documentation**: Comprehensive coverage of all features

#### **Version 2.0.0**
- **None**: Backward compatible with existing data
- **API Endpoints**: Same endpoints, enhanced error handling
- **Database**: No schema changes required
- **Frontend**: Enhanced components, same functionality

### 🎯 Future Roadmap

#### **Version 2.2.0 (Planned)**
- **Real-time Updates**: WebSocket integration for live results
- **Advanced Analytics**: Detailed voting statistics and reports
- **Email Notifications**: Automated email alerts for election events
- **Audit Logging**: Comprehensive activity tracking

#### **Version 2.3.0 (Planned)**
- **Multi-language Support**: Internationalization (i18n)
- **Advanced Security**: Rate limiting, input sanitization
- **Mobile App**: React Native mobile application
- **API Documentation**: Swagger/OpenAPI documentation

#### **Version 3.0.0 (Planned)**
- **Microservices Architecture**: Service-oriented backend
- **Cloud Deployment**: Docker containers and cloud infrastructure
- **Advanced Features**: Multi-election support, advanced voting methods
- **Integration APIs**: Third-party system integrations

## Features

### 🔐 Role-Based Authentication
- **SuperAdmin**: Manage admin accounts, full system access
- **Admin**: Manage elections, candidates, voters, view results
- **User**: Register, vote (once), view candidates and results

### 🎯 Core Features
- **JWT Authentication** - Secure token-based login system
- **Position Management** - Create, edit, and delete voting positions
- **Candidate Management** - Add candidates with photos and descriptions
- **Voter Management** - Register voters with voting lockout
- **Voting System** - One-time voting with automatic lockout
- **Real-time Results** - Live voting results with visual charts
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- CORS

### Frontend
- React
- React Router (v6)
- React Bootstrap
- Axios
- FontAwesome (icons)

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

### 1. Clone and Setup

```bash
# Navigate to the voting system directory
cd VotingSystem

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

The database and tables are automatically created when you start the backend server. However, you can also run the setup manually:

```bash
mysql -u root -p < backend/database_setup.sql
```

### 3. Configuration

Update the database connection in `backend/server.js` if needed:

```javascript
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "your_password"
};
```

## Running the Application

### 1. Start the Backend Server

```bash
cd backend
npm start
```

The server will run on `http://localhost:3000`

### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or similar Vite port)

## Usage

### Login Credentials

#### SuperAdmin (Default)
- **URL:** http://localhost:5173/login
- **Username:** `superadmin`
- **Password:** `superadmin123`
- **Access:** Full system control, admin management

#### Admin (Create via SuperAdmin)
- **Username:** `admin1` (or any created admin)
- **Password:** `adminpass123` (or set during creation)
- **Access:** Election management, results viewing

### Role-Based Access

#### SuperAdmin Dashboard (`/superadmin`)
- **Statistics Overview**: View system-wide stats
- **Admin Management**: Create, edit, delete admin accounts
- **Quick Actions**: Navigate to different management areas
- **System Status**: Monitor database and API status

#### Admin Dashboard (`/admin`)
- **Election Management**: Manage positions, candidates, voters
- **Results Viewing**: View real-time voting results
- **Voter Management**: Track voting status and participation

#### User Dashboard (`/dashboard`)
- **Voting Interface**: Cast votes (one-time only)
- **Candidate Viewing**: Browse candidates and positions
- **Results Viewing**: View election results
- **Account Management**: Update profile information

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin/SuperAdmin login (returns JWT token and role)

### Admin Management (SuperAdmin Only)
- `GET /api/admins` - Get all admin accounts
- `POST /api/admins` - Create new admin account
- `PUT /api/admins/:id` - Update admin account
- `DELETE /api/admins/:id` - Delete admin account

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

### Votes (with Lockout)
- `GET /api/votes` - Get all votes
- `POST /api/votes` - Create vote (automatically locks voter after voting)

### Results
- `GET /api/results` - Get voting results

## Database Schema

### Tables
- **admins** - Admin accounts with roles (superadmin/admin)
- **positions** - Voting positions with vote limits
- **candidates** - Candidates running for positions
- **voters** - Registered voters with hasVoted flag
- **votes** - Individual votes cast

### Key Features
- **hasVoted**: Boolean flag preventing multiple votes per voter
- **Role-based access**: ENUM('superadmin', 'admin') for admin accounts
- **JWT tokens**: Secure authentication with role information

## Project Structure

```
VotingSystem/
├── backend/
│   ├── server.js              # Main server with JWT auth
│   ├── package.json
│   └── database_setup.sql     # Auto-creates tables and default superadmin
├── frontend/
│   ├── src/
│   │   ├── Pages/
│   │   │   ├── SuperAdmin/    # SuperAdmin dashboard and admin management
│   │   │   ├── Admin/         # Admin dashboard and election management
│   │   │   ├── User/          # User dashboard and voting interface
│   │   │   └── Login.jsx      # JWT-based login
│   │   ├── services/
│   │   │   └── api.js         # API service with JWT interceptor
│   │   └── App.jsx            # Role-based routing
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Testing with Postman

### 1. Login to Get JWT Token
```http
POST http://localhost:3000/api/admin/login
Content-Type: application/json

{
  "username": "superadmin",
  "password": "superadmin123"
}
```

### 2. Use Token for Protected Endpoints
```http
GET http://localhost:3000/api/admins
Authorization: Bearer <your_jwt_token>
```

### 3. Test Admin Management
```http
POST http://localhost:3000/api/admins
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "id": "admin-001",
  "username": "admin1",
  "password": "adminpass123",
  "role": "admin"
}
```

## Security Features

### Implemented
- **JWT Authentication**: Secure token-based sessions
- **Password Hashing**: bcryptjs for secure password storage
- **Role-based Authorization**: Different access levels per role
- **Voting Lockout**: One-time voting with automatic lockout
- **Protected Routes**: Frontend and backend route protection

### For Production
- HTTPS implementation
- Rate limiting
- Input validation and sanitization
- Session management
- Audit logging

## Troubleshooting

### Common Issues

1. **JWT Token Errors**
   - Check token expiration (8 hours default)
   - Verify Authorization header format: `Bearer <token>`
   - Ensure backend JWT_SECRET is consistent

2. **Database Connection**
   - MySQL server must be running
   - Check database credentials in `server.js`
   - Tables auto-create on server start

3. **CORS Errors**
   - Backend includes CORS middleware
   - Frontend makes requests to `http://localhost:3000`

4. **Voting Lockout**
   - Voters can only vote once per election
   - `hasVoted` flag prevents multiple votes
   - Check voter status before allowing vote

### Development Tips

1. **Check Browser Console** for frontend errors
2. **Check Network Tab** for API request/response details
3. **Verify localStorage** for stored JWT token and role
4. **Test with Postman** for backend API validation

## License

This project is for educational purposes. 