# Voting System

A complete role-based voting system with backend API and frontend interface built with Node.js, Express, MySQL, and React. Features SuperAdmin, Admin, and User roles with different permissions and capabilities.

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