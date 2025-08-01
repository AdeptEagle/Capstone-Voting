# Voting System API - Postman Testing Guide

## Base URL
```
https://backend-production-219d.up.railway.app/api
```

## Authentication

### Admin Login
**Endpoint:** `POST /auth/login`
```json
{
  "username": "admin",
  "password": "admin123"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin_id",
    "username": "admin",
    "role": "admin"
  }
}
```

### User Login
**Endpoint:** `POST /auth/user-login`
```json
{
  "studentId": "STUDENT_ID",
  "password": "password"
}
```

### Authorization Header
For all protected endpoints, include:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Positions Management

### Get All Positions
**Endpoint:** `GET /positions`
**Headers:** Authorization required

### Create Position
**Endpoint:** `POST /positions`
**Headers:** Authorization required
```json
{
  "name": "President",
  "voteLimit": 1,
  "description": "Student Body President"
}
```

### Update Position
**Endpoint:** `PUT /positions/{id}`
**Headers:** Authorization required
```json
{
  "name": "Updated Position Name",
  "voteLimit": 2,
  "description": "Updated description"
}
```

### Delete Position
**Endpoint:** `DELETE /positions/{id}`
**Headers:** Authorization required

## Candidates Management

### Get All Candidates
**Endpoint:** `GET /candidates`
**Headers:** Authorization required

### Create Candidate
**Endpoint:** `POST /candidates`
**Headers:** Authorization required
```json
{
  "name": "John Doe",
  "positionId": "position_id",
  "departmentName": "Computer Science",
  "courseName": "BS Computer Science",
  "description": "Candidate description",
  "photoUrl": "optional_photo_url"
}
```

### Update Candidate
**Endpoint:** `PUT /candidates/{id}`
**Headers:** Authorization required
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

### Delete Candidate
**Endpoint:** `DELETE /candidates/{id}`
**Headers:** Authorization required

### Delete Multiple Candidates
**Endpoint:** `DELETE /candidates/multiple`
**Headers:** Authorization required
```json
{
  "candidateIds": ["id1", "id2", "id3"]
}
```

## Elections Management

### Get All Elections
**Endpoint:** `GET /elections`
**Headers:** Authorization required

### Get Active Election
**Endpoint:** `GET /elections/active`
**Headers:** Authorization required

### Create Election
**Endpoint:** `POST /elections`
**Headers:** Authorization required
```json
{
  "title": "Student Council Election 2024",
  "description": "Annual student council election",
  "startTime": "2024-02-01T08:00:00.000Z",
  "endTime": "2024-02-01T18:00:00.000Z",
  "positionIds": ["pos1", "pos2"],
  "candidateIds": ["cand1", "cand2", "cand3"]
}
```

### Update Election
**Endpoint:** `PUT /elections/{id}`
**Headers:** Authorization required

### Delete Election
**Endpoint:** `DELETE /elections/{id}`
**Headers:** Authorization required

## Election Control

### Start Election
**Endpoint:** `POST /elections/{id}/start`
**Headers:** Authorization required

### Pause Election
**Endpoint:** `POST /elections/{id}/pause`
**Headers:** Authorization required

### Resume Election
**Endpoint:** `POST /elections/{id}/resume`
**Headers:** Authorization required

### Stop Election
**Endpoint:** `POST /elections/{id}/stop`
**Headers:** Authorization required

### End Election
**Endpoint:** `POST /elections/{id}/end`
**Headers:** Authorization required

## Voting System

### Create Vote
**Endpoint:** `POST /votes`
**Headers:** Authorization required
```json
{
  "voterId": "voter_id",
  "candidateId": "candidate_id",
  "positionId": "position_id",
  "isLastVote": false
}
```

### Get All Votes
**Endpoint:** `GET /votes`
**Headers:** Authorization required

### Get Votes by Voter
**Endpoint:** `GET /votes/voter/{voterId}`
**Headers:** Authorization required

### Get Voting Statistics
**Endpoint:** `GET /votes/statistics/{electionId}`
**Headers:** Authorization required

### Get Real-time Stats
**Endpoint:** `GET /votes/real-time-stats`
**Headers:** Authorization required

## Election Timers

### Get Election Timer
**Endpoint:** `GET /elections/{id}/timer`
**Headers:** Authorization required

### Get Election Countdown
**Endpoint:** `GET /elections/{id}/countdown`
**Headers:** Authorization required

### Get All Active Timers
**Endpoint:** `GET /elections/timers/active`
**Headers:** Authorization required

## Ballot History & Analytics

### Get All Completed Elections
**Endpoint:** `GET /ballot-history/elections`
**Headers:** Authorization required

### Get Full Election Analysis
**Endpoint:** `GET /ballot-history/elections/{electionId}/analysis`
**Headers:** Authorization required

### Get Election Results (Winners/Losers)
**Endpoint:** `GET /ballot-history/elections/{electionId}/results`
**Headers:** Authorization required

### Get Election Summary
**Endpoint:** `GET /ballot-history/elections/{electionId}/summary`
**Headers:** Authorization required

### Get Election Voters
**Endpoint:** `GET /ballot-history/elections/{electionId}/voters`
**Headers:** Authorization required

### Get Department Statistics
**Endpoint:** `GET /ballot-history/elections/{electionId}/departments`
**Headers:** Authorization required

### Get Course Statistics
**Endpoint:** `GET /ballot-history/elections/{electionId}/courses`
**Headers:** Authorization required

### Get Voting Timeline
**Endpoint:** `GET /ballot-history/elections/{electionId}/timeline`
**Headers:** Authorization required

### Get Position Analytics
**Endpoint:** `GET /ballot-history/elections/{electionId}/analytics/positions`
**Headers:** Authorization required

### Get Vote Distribution
**Endpoint:** `GET /ballot-history/elections/{electionId}/analytics/distribution`
**Headers:** Authorization required

## Voters Management

### Get All Voters
**Endpoint:** `GET /voters`
**Headers:** Authorization required

### Create Voter
**Endpoint:** `POST /voters`
**Headers:** Authorization required
```json
{
  "name": "Jane Smith",
  "studentId": "2024001",
  "departmentName": "Computer Science",
  "courseName": "BS Computer Science",
  "password": "password123"
}
```

### Update Voter
**Endpoint:** `PUT /voters/{id}`
**Headers:** Authorization required

### Delete Voter
**Endpoint:** `DELETE /voters/{id}`
**Headers:** Authorization required

## Results

### Get Active Election Results
**Endpoint:** `GET /results/active`
**Headers:** Authorization required

### Get All Election Results
**Endpoint:** `GET /results/all`
**Headers:** Authorization required

### Get Real-time Stats
**Endpoint:** `GET /results/real-time-stats`
**Headers:** Authorization required

### Get Vote Timeline
**Endpoint:** `GET /results/vote-timeline`
**Headers:** Authorization required

## Departments & Courses

### Get All Departments
**Endpoint:** `GET /departments`
**Headers:** Authorization required

### Create Department
**Endpoint:** `POST /departments`
**Headers:** Authorization required
```json
{
  "name": "Computer Science"
}
```

### Get Courses by Department
**Endpoint:** `GET /courses/department/{departmentId}`
**Headers:** Authorization required

### Create Course
**Endpoint:** `POST /courses`
**Headers:** Authorization required
```json
{
  "name": "BS Computer Science",
  "departmentId": "department_id"
}
```

## Postman Environment Setup

Create a Postman environment with these variables:

| Variable | Value |
|----------|-------|
| `base_url` | `https://backend-production-219d.up.railway.app/api` |
| `admin_token` | `(Set after admin login)` |
| `user_token` | `(Set after user login)` |
| `election_id` | `(Set after creating election)` |
| `position_id` | `(Set after creating position)` |
| `candidate_id` | `(Set after creating candidate)` |
| `voter_id` | `(Set after creating voter)` |

## Testing Workflow

### 1. Authentication
1. Send admin login request
2. Copy token from response
3. Set `admin_token` environment variable
4. Use `{{admin_token}}` in Authorization headers

### 2. Basic Setup
1. Create positions with different vote limits
2. Create candidates for each position
3. Create voters for testing
4. Create an election linking positions and candidates

### 3. Election Testing
1. Start the election
2. Test voting with different scenarios
3. Monitor timer endpoints
4. End the election
5. Check ballot history analytics

### 4. Vote Limit Testing
```json
// President (1 vote limit)
{
  "voterId": "voter1",
  "candidateId": "president_candidate1",
  "positionId": "president_position",
  "isLastVote": false
}

// Senator (multiple votes, e.g., 8 limit)
{
  "voterId": "voter1", 
  "candidateId": "senator_candidate1",
  "positionId": "senator_position",
  "isLastVote": false
}
// Repeat for up to 8 different senator candidates
```

## Error Responses

All errors return status codes with JSON:
```json
{
  "error": "Error message description",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

Common status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Notes

- All modifications through Postman affect the live production database
- Admin authentication required for most endpoints
- Vote limits are enforced per position
- Elections must be active for voting
- Timestamps should be in ISO 8601 format
- IDs are typically UUIDs or generated strings 