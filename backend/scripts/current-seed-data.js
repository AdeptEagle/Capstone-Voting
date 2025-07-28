// Current Database Data as Default Seed Data
// Generated on: 2025-07-28T20:23:44.775Z

export const currentSeedData = {
  superadmins: [],
  
  admins: [
  {
    "id": "admin-001",
    "username": "admin1123",
    "email": "admin1123@votingsystem.com",
    "password": "$2b$10$bPYyvJ99TicH6hviI6bZ1OQ8BM60xF/KU29gpEl5aQZTKYXM5JkAS",
    "role": "admin",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T20:16:48.000Z"
  },
  {
    "id": "admin-002",
    "username": "admin2",
    "email": "admin2@votingsystem.com",
    "password": "$2b$10$865cIoKXjrNw1Bit5OQyHu4/OHpmpNwgSDEEkrC.VN5g4KglkardW",
    "role": "admin",
    "created_at": "2025-07-28T20:20:51.000Z",
    "updated_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "admin-003",
    "username": "admin3",
    "email": "admin3@votingsystem.com",
    "password": "$2b$10$bKiewgfLtQx8Pi73XXawMOBpVIXUc0E3fUtR9rTxaOj9Y1UntPpdy",
    "role": "admin",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "superadmin-001",
    "username": "superadmin",
    "email": "superadmin@votingsystem.com",
    "password": "$2b$10$iEKbBdMsWDP789SUOCvu1ueZtKvMzIuNlOFLf8dMLTMl9gkZnTVT2",
    "role": "superadmin",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T20:17:20.000Z"
  }
],
  
  departments: [
  {
    "id": "dept-001",
    "name": "Computer Science",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "dept-002",
    "name": "Information Technology",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "dept-003",
    "name": "Civil Engineering",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "dept-004",
    "name": "Mechanical Engineering",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "dept-005",
    "name": "Electrical Engineering",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "dept-006",
    "name": "Business Administration",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "dept-007",
    "name": "Accountancy",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "dept-008",
    "name": "Marketing Management",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "dept-009",
    "name": "Psychology",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "dept-010",
    "name": "English Literature",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "dept-011",
    "name": "Mathematics",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "dept-012",
    "name": "Biology",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "TD",
    "name": "Test123",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:11:44.000Z",
    "updated_at": "2025-07-28T20:12:05.000Z"
  }
],
  
  courses: [
  {
    "id": "course-001",
    "name": "BS Computer Science",
    "departmentId": "dept-001",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-002",
    "name": "BS Information Technology",
    "departmentId": "dept-002",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-003",
    "name": "BS Computer Engineering",
    "departmentId": "dept-001",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-004",
    "name": "BS Civil Engineering",
    "departmentId": "dept-003",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-005",
    "name": "BS Mechanical Engineering",
    "departmentId": "dept-004",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-006",
    "name": "BS Electrical Engineering",
    "departmentId": "dept-005",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-007",
    "name": "BS Industrial Engineering",
    "departmentId": "dept-004",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-008",
    "name": "BS Business Administration",
    "departmentId": "dept-006",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-009",
    "name": "BS Accountancy",
    "departmentId": "dept-007",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-010",
    "name": "BS Marketing Management",
    "departmentId": "dept-008",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-011",
    "name": "BS Entrepreneurship",
    "departmentId": "dept-006",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-012",
    "name": "BS Psychology",
    "departmentId": "dept-009",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-013",
    "name": "BA English Literature",
    "departmentId": "dept-010",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-014",
    "name": "BS Mathematics",
    "departmentId": "dept-011",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "course-015",
    "name": "BS Biology",
    "departmentId": "dept-012",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  }
],
  
  positions: [
  {
    "id": "pos-001",
    "name": "President",
    "voteLimit": 1,
    "displayOrder": 1,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T20:13:57.000Z"
  },
  {
    "id": "pos-002",
    "name": "Vice President",
    "voteLimit": 1,
    "displayOrder": 2,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "pos-003",
    "name": "Secretary",
    "voteLimit": 1,
    "displayOrder": 3,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "pos-004",
    "name": "Assistant Secretary",
    "voteLimit": 1,
    "displayOrder": 4,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "pos-005",
    "name": "Treasurer",
    "voteLimit": 1,
    "displayOrder": 5,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "pos-006",
    "name": "Assistant Treasurer",
    "voteLimit": 1,
    "displayOrder": 6,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "pos-007",
    "name": "Auditor",
    "voteLimit": 1,
    "displayOrder": 7,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "pos-008",
    "name": "Assistant Auditor",
    "voteLimit": 1,
    "displayOrder": 8,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "pos-009",
    "name": "Public Relations Officer",
    "voteLimit": 1,
    "displayOrder": 9,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "pos-010",
    "name": "Assistant Public Relations Officer",
    "voteLimit": 1,
    "displayOrder": 10,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "pos-011",
    "name": "Business Manager",
    "voteLimit": 1,
    "displayOrder": 11,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "pos-012",
    "name": "Assistant Business Manager",
    "voteLimit": 1,
    "displayOrder": 12,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "pos-013",
    "name": "Sergeant-at-Arms",
    "voteLimit": 1,
    "displayOrder": 13,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "pos-014",
    "name": "Assistant Sergeant-at-Arms",
    "voteLimit": 1,
    "displayOrder": 14,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "pos-015",
    "name": "Board Member",
    "voteLimit": 3,
    "displayOrder": 15,
    "created_at": "2025-07-28T20:08:26.000Z",
    "updated_at": "2025-07-28T20:08:26.000Z"
  }
],
  
  candidates: [
  {
    "id": "cand-001",
    "name": "John Michael Santos",
    "positionId": "pos-001",
    "departmentId": "dept-001",
    "courseId": "course-001",
    "photoUrl": null,
    "description": "Experienced leader with strong communication skills. Committed to transparency and student welfare.",
    "displayOrder": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "cand-002",
    "name": "Maria Isabella Cruz",
    "positionId": "pos-001",
    "departmentId": "dept-006",
    "courseId": "course-008",
    "photoUrl": null,
    "description": "Innovative thinker with excellent organizational skills. Focused on academic excellence and student development.",
    "displayOrder": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "cand-003",
    "name": "Carlos Antonio Reyes",
    "positionId": "pos-001",
    "departmentId": "dept-003",
    "courseId": "course-004",
    "photoUrl": null,
    "description": "Dedicated student leader with proven track record. Committed to building a stronger student community.",
    "displayOrder": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "cand-004",
    "name": "Ana Sofia Mendoza",
    "positionId": "pos-002",
    "departmentId": "dept-007",
    "courseId": "course-009",
    "photoUrl": "candidate-1753733659835-347341412.png",
    "description": "Team player with excellent coordination skills. Passionate about student representation. 123123",
    "displayOrder": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T20:14:19.000Z"
  },
  {
    "id": "cand-005",
    "name": "Luis Miguel Torres",
    "positionId": "pos-002",
    "departmentId": "dept-004",
    "courseId": "course-005",
    "photoUrl": null,
    "description": "Dynamic leader with strong problem-solving abilities. Committed to student advocacy.",
    "displayOrder": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "cand-006",
    "name": "Gabriela Nicole Fernandez",
    "positionId": "pos-003",
    "departmentId": "dept-007",
    "courseId": "course-009",
    "photoUrl": null,
    "description": "Detail-oriented with excellent documentation skills. Committed to maintaining accurate records.",
    "displayOrder": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "cand-007",
    "name": "Roberto Carlos Lopez",
    "positionId": "pos-003",
    "departmentId": "dept-010",
    "courseId": "course-013",
    "photoUrl": null,
    "description": "Strong communication skills with attention to detail. Dedicated to efficient record-keeping.",
    "displayOrder": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "cand-008",
    "name": "Isabella Grace Santos",
    "positionId": "pos-005",
    "departmentId": "dept-007",
    "courseId": "course-009",
    "photoUrl": null,
    "description": "Financial management expert with strong analytical skills. Committed to transparent financial reporting.",
    "displayOrder": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "cand-009",
    "name": "Diego Alejandro Martinez",
    "positionId": "pos-005",
    "departmentId": "dept-006",
    "courseId": "course-008",
    "photoUrl": null,
    "description": "Experienced in budget planning and financial oversight. Dedicated to fiscal responsibility.",
    "displayOrder": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "cand-010",
    "name": "Valentina Sofia Ramirez",
    "positionId": "pos-007",
    "departmentId": "dept-007",
    "courseId": "course-009",
    "photoUrl": null,
    "description": "Strong analytical skills with attention to detail. Committed to ensuring financial accountability.",
    "displayOrder": 0,
    "created_at": "2025-07-28T20:16:19.000Z",
    "updated_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "cand-011",
    "name": "Santiago Jose Gonzalez",
    "positionId": "pos-007",
    "departmentId": "dept-011",
    "courseId": "course-014",
    "photoUrl": null,
    "description": "Mathematical precision with auditing expertise. Dedicated to maintaining financial integrity.",
    "displayOrder": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "cand-012",
    "name": "Camila Elena Rodriguez",
    "positionId": "pos-009",
    "departmentId": "dept-008",
    "courseId": "course-010",
    "photoUrl": null,
    "description": "Excellent communication skills with creative marketing ideas. Committed to enhancing student engagement.",
    "displayOrder": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "cand-013",
    "name": "Andres Felipe Herrera",
    "positionId": "pos-009",
    "departmentId": "dept-009",
    "courseId": "course-012",
    "photoUrl": null,
    "description": "Strong interpersonal skills with media experience. Dedicated to effective student communication.",
    "displayOrder": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": "cand-014",
    "name": "Sofia Alejandra Morales",
    "positionId": "pos-015",
    "departmentId": "dept-001",
    "courseId": "course-001",
    "photoUrl": null,
    "description": "Tech-savvy leader with innovative ideas for student services.",
    "displayOrder": 0,
    "created_at": "2025-07-28T20:08:26.000Z",
    "updated_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "cand-015",
    "name": "Javier Enrique Silva",
    "positionId": "pos-015",
    "departmentId": "dept-003",
    "courseId": "course-004",
    "photoUrl": null,
    "description": "Engineering student with strong problem-solving skills and community focus.",
    "displayOrder": 0,
    "created_at": "2025-07-28T20:08:26.000Z",
    "updated_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "cand-016",
    "name": "Daniela Patricia Castro",
    "positionId": "pos-015",
    "departmentId": "dept-006",
    "courseId": "course-008",
    "photoUrl": null,
    "description": "Business student with leadership experience and strategic thinking abilities.",
    "displayOrder": 0,
    "created_at": "2025-07-28T20:08:26.000Z",
    "updated_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "cand-017",
    "name": "Ricardo Manuel Vargas",
    "positionId": "pos-015",
    "departmentId": "dept-012",
    "courseId": "course-015",
    "photoUrl": null,
    "description": "Science student with research background and analytical approach to student issues.",
    "displayOrder": 0,
    "created_at": "2025-07-28T20:08:26.000Z",
    "updated_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "cand-018",
    "name": "Natalia Sofia Jimenez",
    "positionId": "pos-015",
    "departmentId": "dept-010",
    "courseId": "course-013",
    "photoUrl": null,
    "description": "Literature student with strong communication skills and cultural awareness.",
    "displayOrder": 0,
    "created_at": "2025-07-28T20:08:26.000Z",
    "updated_at": "2025-07-28T20:08:26.000Z"
  }
],
  
  voters: [
  {
    "id": 1,
    "name": "Alexandra Marie Santos",
    "email": "alexandra.santos@student.edu",
    "studentId": "2024-00001",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-001",
    "courseId": "course-001",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": 2,
    "name": "Miguel Angel Cruz",
    "email": "miguel.cruz@student.edu",
    "studentId": "2024-00002",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-001",
    "courseId": "course-001",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": 3,
    "name": "Isabella Grace Reyes",
    "email": "isabella.reyes@student.edu",
    "studentId": "2024-00003",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-001",
    "courseId": "course-001",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": 4,
    "name": "Carlos Eduardo Mendoza",
    "email": "carlos.mendoza@student.edu",
    "studentId": "2024-00004",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-002",
    "courseId": "course-002",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": 5,
    "name": "Sofia Alejandra Torres",
    "email": "sofia.torres@student.edu",
    "studentId": "2024-00005",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-002",
    "courseId": "course-002",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": 6,
    "name": "Luis Fernando Fernandez",
    "email": "luis.fernandez@student.edu",
    "studentId": "2024-00006",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-003",
    "courseId": "course-004",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": 7,
    "name": "Ana Gabriela Lopez",
    "email": "ana.lopez@student.edu",
    "studentId": "2024-00007",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-003",
    "courseId": "course-004",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:24.000Z",
    "updated_at": "2025-07-28T19:48:24.000Z"
  },
  {
    "id": 8,
    "name": "Roberto Carlos Silva",
    "email": "roberto.silva@student.edu",
    "studentId": "2024-00008",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-004",
    "courseId": "course-005",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:25.000Z",
    "updated_at": "2025-07-28T19:48:25.000Z"
  },
  {
    "id": 9,
    "name": "Maria Elena Castro",
    "email": "maria.castro@student.edu",
    "studentId": "2024-00009",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-004",
    "courseId": "course-005",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:25.000Z",
    "updated_at": "2025-07-28T19:48:25.000Z"
  },
  {
    "id": 10,
    "name": "Diego Alejandro Vargas",
    "email": "diego.vargas@student.edu",
    "studentId": "2024-00010",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-005",
    "courseId": "course-006",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:25.000Z",
    "updated_at": "2025-07-28T19:48:25.000Z"
  },
  {
    "id": 11,
    "name": "Valentina Sofia Jimenez",
    "email": "valentina.jimenez@student.edu",
    "studentId": "2024-00011",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-006",
    "courseId": "course-008",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:25.000Z",
    "updated_at": "2025-07-28T19:48:25.000Z"
  },
  {
    "id": 12,
    "name": "Santiago Jose Morales",
    "email": "santiago.morales@student.edu",
    "studentId": "2024-00012",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-006",
    "courseId": "course-008",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:25.000Z",
    "updated_at": "2025-07-28T19:48:25.000Z"
  },
  {
    "id": 13,
    "name": "Camila Elena Rodriguez",
    "email": "camila.rodriguez@student.edu",
    "studentId": "2123-00013",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-007",
    "courseId": "course-009",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:25.000Z",
    "updated_at": "2025-07-28T20:18:05.000Z"
  },
  {
    "id": 14,
    "name": "Andres Felipe ",
    "email": "andres.herrera@student.edu",
    "studentId": "2024-00014",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-005",
    "courseId": "course-006",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:25.000Z",
    "updated_at": "2025-07-28T20:07:01.000Z"
  },
  {
    "id": 15,
    "name": "Natalia Sofia Gonzalez",
    "email": "natalia.gonzalez@student.edu",
    "studentId": "2024-00015",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-008",
    "courseId": "course-010",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:25.000Z",
    "updated_at": "2025-07-28T19:48:25.000Z"
  },
  {
    "id": 17,
    "name": "Daniela Patricia Martinez",
    "email": "daniela.martinez@student.edu",
    "studentId": "2024-00017",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-010",
    "courseId": "course-013",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:25.000Z",
    "updated_at": "2025-07-28T19:48:25.000Z"
  },
  {
    "id": 18,
    "name": "Javier Enrique Santos",
    "email": "javier.santos@student.edu",
    "studentId": "2024-00018",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-011",
    "courseId": "course-014",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:25.000Z",
    "updated_at": "2025-07-28T19:48:25.000Z"
  },
  {
    "id": 19,
    "name": "Sofia Alejandra Cruz",
    "email": "sofia.cruz@student.edu",
    "studentId": "2024-00019",
    "password": "$2b$10$gJKDUzgzJcRnhZWjOfzA/ez6GzQTrQbWjrKRRilpWxRrcyUFAl2oC",
    "departmentId": "dept-012",
    "courseId": "course-015",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:48:25.000Z",
    "updated_at": "2025-07-28T19:48:25.000Z"
  },
  {
    "id": 212,
    "name": "TestUserFromUserSide",
    "email": "Testvoter@gmail.com",
    "studentId": "1200-00223",
    "password": "$2b$10$iIOgXRItHAcgyJ3.FZdexujbTyJ5kOvZ1.82kqneucWkE.KJF8H.G",
    "departmentId": "dept-007",
    "courseId": "course-009",
    "hasVoted": 0,
    "created_at": "2025-07-28T19:56:56.000Z",
    "updated_at": "2025-07-28T19:56:56.000Z"
  },
  {
    "id": 384,
    "name": "TestFromUserSide",
    "email": "Testuser@mail.com",
    "studentId": "0099-99000",
    "password": "$2b$10$4FazdGryjkX31tLlxgNGFOxzNH4ZbppaAzZMXrju5K2g4odTbPa.S",
    "departmentId": "dept-007",
    "courseId": "course-009",
    "hasVoted": 0,
    "created_at": "2025-07-28T20:03:21.000Z",
    "updated_at": "2025-07-28T20:03:21.000Z"
  },
  {
    "id": 685,
    "name": "Ricardo Manuel Ramirez",
    "email": "ricardo.ramirez@student.edu",
    "studentId": "2024-00016",
    "password": "$2b$10$UGsaNSAP2Zej0W.1n3GO.OR0JaCuZ2Z4BNYQ/t5ZaURV6imph1TE2",
    "departmentId": "dept-009",
    "courseId": "course-012",
    "hasVoted": 0,
    "created_at": "2025-07-28T20:20:51.000Z",
    "updated_at": "2025-07-28T20:20:51.000Z"
  }
],
  
  elections: [
  {
    "id": "090945d6-c646-4966-b352-531b89efd58c",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:21:56.000Z",
    "endTime": "2025-08-05T12:21:56.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:21:55.000Z",
    "updated_at": "2025-07-28T20:21:55.000Z"
  },
  {
    "id": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:23:19.000Z",
    "endTime": "2025-08-05T12:23:19.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:23:18.000Z",
    "updated_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:09:28.000Z",
    "endTime": "2025-08-05T12:09:28.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:09:28.000Z",
    "updated_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:11:30.000Z",
    "endTime": "2025-08-05T12:11:30.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:11:29.000Z",
    "updated_at": "2025-07-28T20:11:29.000Z"
  },
  {
    "id": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:09:35.000Z",
    "endTime": "2025-08-05T12:09:35.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:09:34.000Z",
    "updated_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "29c67246-4165-48c7-9506-e09ba27ff207",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:11:04.000Z",
    "endTime": "2025-08-05T12:11:04.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:11:04.000Z",
    "updated_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "306f8e72-f27d-4822-913a-403f156f034d",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:20:52.000Z",
    "endTime": "2025-08-05T12:20:52.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:20:51.000Z",
    "updated_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:09:36.000Z",
    "endTime": "2025-08-05T12:09:36.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:09:35.000Z",
    "updated_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "729cce5c-270c-4b48-a810-49507df757b6",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:08:27.000Z",
    "endTime": "2025-08-05T12:08:27.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:08:26.000Z",
    "updated_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:10:25.000Z",
    "endTime": "2025-08-05T12:10:25.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:10:25.000Z",
    "updated_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "95939296-220b-48ab-8891-ba404686d545",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:23:16.000Z",
    "endTime": "2025-08-05T12:23:16.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:23:16.000Z",
    "updated_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "9e9941ef-32dc-413a-ac43-056037a01443",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:09:13.000Z",
    "endTime": "2025-08-05T12:09:13.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:09:13.000Z",
    "updated_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:16:20.000Z",
    "endTime": "2025-08-05T12:16:20.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:16:19.000Z",
    "updated_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:11:22.000Z",
    "endTime": "2025-08-05T12:11:22.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:11:21.000Z",
    "updated_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:20:55.000Z",
    "endTime": "2025-08-05T12:20:55.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:20:55.000Z",
    "updated_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:16:36.000Z",
    "endTime": "2025-08-05T12:16:36.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:16:35.000Z",
    "updated_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:16:33.000Z",
    "endTime": "2025-08-05T12:16:33.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:16:33.000Z",
    "updated_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:16:41.000Z",
    "endTime": "2025-08-05T12:16:41.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:16:40.000Z",
    "updated_at": "2025-07-28T20:16:40.000Z"
  },
  {
    "id": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:21:03.000Z",
    "endTime": "2025-08-05T12:21:03.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:21:03.000Z",
    "updated_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:09:26.000Z",
    "endTime": "2025-08-05T12:09:26.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:09:26.000Z",
    "updated_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "title": "Student Council Election 2024",
    "description": "Annual election for the Student Council Executive Board. All registered students are eligible to vote.",
    "startTime": "2025-07-29T12:11:19.000Z",
    "endTime": "2025-08-05T12:11:19.000Z",
    "status": "pending",
    "created_by": "superadmin-001",
    "created_at": "2025-07-28T20:11:18.000Z",
    "updated_at": "2025-07-28T20:11:18.000Z"
  }
],
  
  election_positions: [
  {
    "id": "02260573-e4ee-407d-b2ca-e4ac2f40f0b3",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "04fd48e4-1c75-48ae-b3ef-24536b2e2901",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "06025607-f2cf-439a-a564-2145a1a653c8",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "0792baa9-4e34-42ad-993b-06cdc8140244",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "07af3054-c826-41ad-81c8-d11c342c1021",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "0c0e3b1e-a095-47ab-90f7-30ea26c6b8aa",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "0c4a7e29-d4e0-479a-9efe-b161ab9d17bd",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:16:40.000Z"
  },
  {
    "id": "0ed6a250-7a72-42c4-9776-7bd77b936434",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "11a26428-3f3e-4f87-a23d-69b1da6ff93b",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "13421f3e-d5e3-4db6-ade5-43065c8802c1",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "13a9752b-607c-4b8e-9cea-a36d3732742d",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "177f4870-ab34-42d9-a5ae-2b90ee469c6e",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "19155412-4e31-4c6f-94f3-56eb98ddc8ac",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "1a58dd01-8d64-4696-a892-c775149f369d",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "1bd9b310-2b9d-4ae5-b54c-8cd5bfbfb7a2",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "1c21ac3f-92e0-4ef3-9379-8a561424ee07",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "1cd8d95a-7528-4a13-956a-733d3c984519",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "1e83e558-a7a1-40c5-8df8-fbfefe53ea67",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "22634f0b-e7f8-407c-8afc-4c94ba70d9df",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "24945387-ec2d-40e9-a70e-148aa6378b2c",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "255995e9-4454-4255-b04f-b2dbe7ead920",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "27926fe6-20da-47a6-9c84-170c23acc6a8",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "290ed5f9-7598-4042-8b75-edf91f4b7565",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "2c2a793c-cc93-441d-8042-a6c74f53d39a",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "2c308fcf-fba7-4fe6-81cb-705cdaf85ef7",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "2d76a5f7-e6b0-4d56-b8bf-26f6feaf5060",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "2e553dbd-8d6f-439e-b4d0-7e43a878ad26",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "3227a32f-2853-43bc-b6fb-438cbb457410",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "32e56c5e-e89c-4b3b-a357-1cfbe81dedbc",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "32f8dab5-504b-4efe-a481-3db11f4d2047",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "35aed070-c03e-42da-8b17-795f97ac6fc5",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "36b160ec-100f-48c8-b64b-ab97f1c961de",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "37a074a1-759d-44f0-b0ec-cd8fcc6fcafd",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "3a6524ad-af79-4d9d-b044-271121be0f41",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "3ce93529-46ad-44d7-8959-bd572d659634",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "3d5f323c-39d8-4abd-8561-991fc19b2b06",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "3da6f817-19b0-4591-9c28-7cd5a8e406c7",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "3fb465d5-5d75-4a54-8bf7-7a477a33c533",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "441dceaa-24ba-4c91-9870-19c6ad541e55",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "48e42301-cb59-4388-a2ea-81dbf5e89feb",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "495139b2-a4b3-4c5e-9947-a9bca803ccf6",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "4a40393b-deae-43f2-a3ce-3f550da7c908",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:21:55.000Z"
  },
  {
    "id": "4ada845a-c8ab-4fcf-959b-d860ef2631d4",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "4b575590-d7ae-40d1-9b93-3fd232c94533",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "4c122a49-17dc-48e2-b90d-c3607a576fc7",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "4ce06528-1851-4c33-ac4d-a51553c5b223",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "4e89a55a-3a6e-450a-8a3f-41ffb466f598",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "4e9891af-b32b-48ae-842f-f537ee5f7494",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "4f648527-8e11-4ca9-a41c-18f5388110db",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "4fff3d52-95fc-4a46-8395-906684bc480b",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "5656f38c-0a0c-470d-bc83-28968b81dc22",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "57706125-102c-49e9-8b3b-226e329975b1",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "57bb8579-7983-44b4-a999-c55a20915a6e",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "5e591950-3b88-4ed7-931c-4658d0b93840",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:21:55.000Z"
  },
  {
    "id": "5e7c8790-0e51-4209-8cbd-9f81d74e525b",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "60aff0a5-5a79-4c0c-94d6-1adec83a7927",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "61e3b710-38e7-4e68-af6e-7e49abadde1f",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "65bbbc00-a5fe-47ee-852a-f76921c002e9",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "65eeada6-a222-4fc1-abde-cdeba7390f18",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "6875a2e1-2d61-406f-a4ae-8afa98c33aa1",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "6882106d-fca4-4de3-929f-643b61b0d66b",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "69a1db88-53db-48eb-b947-1b9ed0a247e4",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "6a11e513-faf6-4281-8c92-e80424b7aefe",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "6bdeee8c-3326-4f07-b56d-c6b053352d69",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "6ef96008-52cd-4446-9aff-120a389c74bd",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "7549b6a1-73bf-4c3e-949b-430dada58c3a",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "76381117-fe1f-4375-8b64-fda5b7581b40",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "7781055e-e7d0-4d1e-baff-47c99dc66e76",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "783a9bb4-b92d-4d37-b80c-8c1e750a1ecd",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "7e83a35b-f846-48f6-bc93-456d72a381e5",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:21:55.000Z"
  },
  {
    "id": "7eb66b93-5087-42aa-b781-b094d65571b9",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "8365f7b3-616b-4bc2-a00a-28d137b6bb18",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "83839267-2fb0-4b81-97b7-ab14ce7a0a00",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "8471ba0d-4237-4a02-9667-2e10451acb52",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "84976357-43fd-467b-9f74-ef9726dbe444",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "888e5876-bf6e-4a79-9caf-d8118db6243a",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "8acc5a87-23bd-433b-bcc8-95feb09d94c1",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:11:29.000Z"
  },
  {
    "id": "8b82ec4e-8a6b-49c7-85c8-b4c2692d2102",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "8d06d265-fea2-432d-95e9-225aefcd2564",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "8fceaeec-1f3a-4ed2-89c4-db562f042906",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "932c9810-11a8-4c35-8bf8-ca1f52106f88",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "9456163a-ce32-44b5-8e00-d7ed34a303e4",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "96719a22-1fb6-4563-bd53-748717d925a4",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "99bca094-eec7-4d8d-b880-66ceaf846b4e",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "9ac43284-465b-46b4-bbed-a3fe6404a2e4",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "9b860275-4467-4f44-8579-631ee673f90d",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "9c2b9f5f-f58d-4d0d-8088-d9c8f0891431",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "9eb2e94c-ce91-4750-a0c1-56a0bf9437ca",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "a2863dd8-0956-4583-a43c-d2ea2ad5607b",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "a37dd4be-b46a-4882-a8cd-dc7083c5e719",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "a3fd5188-d0dd-4db9-b5e2-923f56581bb5",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "a6c1b38a-be62-4924-a2ba-764241113ec1",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "a8bf9399-63c2-4da6-861c-c2f461483c33",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "ab495aae-f9e7-4a2c-8bb1-3ad3bd502ae4",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "abe80f4a-4910-42f7-8608-ba43747a0f10",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "b028bc21-2b09-44b8-b08e-4df1aa9ee7af",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "b1c20128-442c-41c3-a985-3c5b34e3638c",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "b27f8765-00c4-4f45-87a7-ab882b9af1d9",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "b286b70d-f48f-4919-8d83-960a6741a614",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "b298b818-6479-4069-bb76-bc35c4b8d88c",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "b64e11bc-e1b6-40e8-97d0-77b3e6a2c5dd",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:11:29.000Z"
  },
  {
    "id": "b7038acf-2571-41c6-a744-fac57cbf9833",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "b71f48c4-89e1-4f03-8c34-cf339fd73f00",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "b8af582c-2a9f-4796-918a-d9733aa6ca90",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:16:40.000Z"
  },
  {
    "id": "bb20537e-e498-4ed5-b551-d019fc40b914",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "bb2be138-6f57-437e-96a8-b86f29b47920",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:21:55.000Z"
  },
  {
    "id": "bbfa602d-e2ad-4478-8efc-d33e2eb60c85",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:21:55.000Z"
  },
  {
    "id": "c01ec1b0-ee43-4b02-9ff1-cb4142108cd8",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "c12dbb62-92f9-4508-b4c0-4208f3cba99f",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "c1c797ef-6ead-41e9-b78b-22cc0d499d11",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "c4ae7786-e36f-4978-a20a-aec3d822506e",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "c4b4d5a4-3755-4115-8334-b98443658010",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "c54412ad-46d0-4159-bd01-b5c35c1e2ad5",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "c5d26724-e3ab-4cbd-a8b3-247b27435f2b",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:11:29.000Z"
  },
  {
    "id": "c80acb4d-a1c9-44ef-8849-34e72250c38a",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "c84d2f31-4200-4915-9345-ea340b04e2e9",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "c8dee647-92a4-471b-a21b-60cd5b38c12e",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:21:55.000Z"
  },
  {
    "id": "ca1ae59e-65b6-4204-986e-a72155b7bc4f",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "caaf25ea-ae49-4caa-b1e2-b0e9ac945c9f",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "cbdc1c36-81c8-4e81-b80b-bbdcb30e032c",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "cd6ccc4f-4e58-4de2-9810-27de7f5d314f",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "d05fd6d1-9578-420f-a40a-c404a78edbed",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "d1aa1055-fe86-4f9c-a845-7494af22c60c",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "d2398d60-693e-43fe-af3a-cdbdb1d99e70",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "d50b0df8-7435-47c2-934c-db12d3e98ea8",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "d608d74f-e8cd-443d-9375-53c5e5b36791",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "d78e4720-e500-4ffd-b18d-1a8f6830b4bf",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "positionId": "pos-015",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "d8cbc4cf-ec8c-4911-ab74-331f9737bd1c",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "ded4590f-937d-4b2f-ba1b-a88cb713370f",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "df7db264-51d1-4b4e-95ac-1eb9c4d858d4",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "e107acbd-d05e-48ad-ae40-68ea29617b2c",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "e331de23-503d-4c3c-b405-cfcf8c8afa13",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "e368090f-7d86-499f-9c1d-9b201aba079d",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "e41d0e5b-2108-4b4d-bebf-ddd9ba1aa63b",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "e46d6216-59ad-4993-af02-d0d2d561bca3",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "e80bde40-03e8-4e08-bd85-bdf068626035",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "ebeea597-42dd-4bc6-832b-734088c6bd69",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "ed2c2c25-74cb-4369-8f47-7c625761020a",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "efd33059-49f7-48f0-8938-bee711fd59da",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "positionId": "pos-007",
    "created_at": "2025-07-28T20:21:55.000Z"
  },
  {
    "id": "f0201317-7647-4bbe-8dbc-830662b7ce87",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "f03e051c-42ee-4f32-bc76-9f1458be424d",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "positionId": "pos-002",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "f542fc54-0743-405a-90c0-7088e520aa4e",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "f76ecbcb-c7d1-4831-aab6-440f477b7589",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "positionId": "pos-001",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "f96693b5-a058-4877-8c10-f2069793d191",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "fa95ebf7-ab13-4061-b844-14ea834fe0ea",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "positionId": "pos-003",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "fb819196-0e02-4127-bde9-bb9ad2a3b0da",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "positionId": "pos-009",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "fcd2f9b4-48b5-4892-a4dc-8e34ac957a78",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "positionId": "pos-005",
    "created_at": "2025-07-28T20:08:26.000Z"
  }
],
  
  election_candidates: [
  {
    "id": "01d15578-0006-4cab-b9e2-a058c14eade4",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "01f7074c-f18b-4cde-8a11-60573b68195b",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "026dd390-4429-428f-b7ea-862490d1ed76",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "02b0f32c-617d-4936-affe-ade83f49f398",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "02e64814-b911-456d-b171-a22dc52cc7a0",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "0385c2aa-50d2-4d5a-bd3a-f8901a92519e",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "03938ad8-8774-49b5-b118-a2b2922c9405",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "0484f075-4369-424e-8f28-f1e00569bdbe",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "04e7497d-9c49-42f7-860d-1b41097d7164",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "04f85d7c-e22b-4134-8b28-02752bc31e8a",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "054e2666-625b-4ab5-bdad-872ab87a1b35",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "08873368-d188-4bed-b57c-5adde47831ec",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "095d277c-776b-4f98-bc80-bd9b186f0d22",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-010",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "095fe973-4aa7-494f-85f8-ba51639237b6",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "09f7a1c6-e98e-4229-99c6-b6c6de7b8572",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "09fdad74-6a7d-4bb7-9af4-26845a63db30",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "0a1f4faf-79e6-4383-90fa-a8ca9f6cb4df",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "0a531db4-ba18-425e-bd00-7338ca232089",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:21:55.000Z"
  },
  {
    "id": "0af24fb6-b381-4dc7-88f0-f1d60a1e178e",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "0af5fd1d-7829-46bf-ab15-2b9a0241569d",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "0b031481-35e4-4038-a39a-24133c9778d9",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "0b453108-bd80-4648-824f-adcfb79ccc9d",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:23:19.000Z"
  },
  {
    "id": "0b9802b6-8ef1-40af-bab4-cb7f63a50906",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-010",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "0c79a1d2-ae8c-42b6-9902-c05733cfc84b",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "0cbcd6ef-6204-4ff4-ac7e-d1f2800786a2",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "0d169d1d-658b-45ba-9192-e845d78e6682",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "0d60e872-6dfd-470c-a120-10854ea248f2",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "0ea3886c-4b14-4b2d-a874-066242b85504",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "0f423b6e-5e63-44ee-b915-4262701a3860",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-010",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "0f663a60-f2e4-45e5-9f0c-664b1a8a6512",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "0f9bab3d-daae-4695-b330-b79110a16af5",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "0fe59354-4c2e-428d-91e4-3df60839b63a",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-010",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "10aef5ba-b2b5-4d37-bd9d-7855b84e5ff4",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "12324154-38db-4648-ac70-4ff6a3a5e3cd",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "124dbd98-728e-4abd-b556-bf35dfd461d3",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "12cf8fc0-31cc-4a2e-8da4-3ce7efa0f295",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "131a41e1-9fb4-4850-bb21-c3b275207b64",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "133d5890-42f7-47a9-8fbd-77a00ebe49e5",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "14d39bc0-8f7f-48a4-99dc-50a8a6a41118",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "17ce8bdb-568b-4886-8847-c09452babe6b",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "17e695cb-2574-426f-8fce-1c03d0b799a2",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "186cf8cd-523e-4d5e-8e5b-d3bce0ab6e5d",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "1a308f41-3a60-4b90-a6c8-478906176d04",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "1ab7bf50-3f1e-48d7-8131-07b046efc4f7",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "1b543b53-3d12-45fb-8b69-efa2fba514ca",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "1cd5e8ab-bfac-4d6f-85a8-f833c8389c69",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "1d3f4e9c-ef03-48ad-b5b7-c78822e2ffce",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "1d6aae01-e266-41d5-ad90-704db9bad6de",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "1d881407-8933-4118-bfe2-0539e8157b24",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "1f865f8b-55c9-40ae-ba1d-b76c1b0b81c2",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "2137c13b-bd18-45ec-a4a7-6a44459669d6",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "214e7f51-99d3-43d4-9556-99e139bb08d9",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "21578997-8948-421b-b0c2-408de248e914",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "2185063c-3d10-4a65-94d6-f94010708e9e",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "22b33e18-4c37-4970-8850-5d9e4fecd8cb",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "2344a9b9-1ad0-4972-a864-9b0f9aa09c0f",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "23d23f90-bbf6-4bcf-874b-348ea2a756cf",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "25177d1c-ab24-4e6d-b36e-6fe3d4fa3984",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "252e2fd8-ddcd-4893-a4a3-9d636bb41d08",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "25831c74-ab58-4f58-b42a-6e49fa4df461",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "2625155d-7827-4494-8f40-96e9a9604c1b",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "266c1bc5-9bea-403f-bd03-1120515eee29",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "26edf958-367a-495a-a864-46cdadb4e06b",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "28b96259-a4be-4705-9cc9-8430ea1468b9",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "29509f69-33dd-47c0-888b-b49cba5dbb25",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "29e49b2b-b68d-4311-961a-bbe9a930b812",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "2a8488e4-2ea4-46a9-9193-7758c02a4761",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "2aae6abc-a52f-4607-85b6-0bf9e62f9fe6",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "2ab3b3f3-e394-4e6b-84ed-f92d53c7fdea",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "2b6220f5-cd97-41f5-93ae-169b9640f02a",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-010",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "2b62fc7e-1fa4-49d1-ba74-8d887562534f",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "2bed83ef-8ae5-49e8-9adc-b07750fdaf4d",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "2c199d5d-35a6-42eb-bc5f-dee30c938007",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "2c60c87d-794b-4c2d-8224-419987651da6",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "2c7c4b4e-e447-4a32-8c24-1538163c8cd0",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "2d53b0ec-43de-4ce5-941c-4419e6850b09",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "31674ab0-d171-45f9-a24b-9373b5ec6ef4",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "31ab4d29-c837-4a36-b07b-66c581c504c0",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "3252aa1e-8683-4bba-b6ac-dbeba2261dfd",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:20:52.000Z"
  },
  {
    "id": "33c8be36-75ef-4575-9d2c-0b1096e57b80",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:23:19.000Z"
  },
  {
    "id": "33d3821b-dd5b-422a-af06-e3dddc1629fc",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "3441fadc-4e04-478e-97e1-07298dddbad3",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "34c28def-ced9-4972-a60a-a420d1522ccb",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "35a1219b-ca56-4825-a0fd-497a02792d43",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "3717746d-b8d6-462b-836c-904c0e9e4023",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "3a17553c-a60a-4255-a73c-de3964ffd66e",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:11:19.000Z"
  },
  {
    "id": "3b088aa4-6936-4982-8244-90804e465b6b",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "3b8daef1-1264-4d83-ac3b-d091c11d7907",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "3b9888f0-e73f-4066-bc2a-225b6409f3bc",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "3c570cd8-fe63-4d60-9484-faa45b27787a",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "3d9f2226-a97f-42e0-83d2-23971461d72e",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "3dc40181-c9aa-409c-884a-fcabe45b3087",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "3e0d6146-5a0c-48b9-93de-8466c2a23a52",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "3e7337e6-0d96-480d-be47-f2645cb6fa7e",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "3ecf0c65-6fff-4ee9-a908-f807fac0b99d",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "3f7c165d-4778-47dd-88e2-b09d791cf352",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "41042ccc-1b19-4ed4-984f-1adfcc5aa4eb",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "421dffc8-5a0c-4110-a450-a3de87b7455a",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "42de1778-fc4f-4821-8de2-7fbf1ea7b63a",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "4446e5dd-2518-4610-8465-41547aac1960",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "4460dbeb-f782-45dd-84f5-5c8dc5d1cb34",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "44735a24-457f-477d-8232-43da81b93a79",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "448916ca-726d-42e0-b772-200f6d2f0971",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "44ce4a94-d8e9-4785-a8cf-b0f169d0fdd7",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "45378abf-69c0-4381-9f86-41ce90b1add4",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "4640b5b9-a173-472f-9746-7628e137c553",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "47011f54-7094-44d2-8d98-197ab16a4290",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "47303dd4-ce22-48fc-bdb9-e693165fba12",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "48cd1492-e062-4eb1-a69f-a0a3eea26e89",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "49f3ef50-2119-448e-a844-18c8332802bc",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "4a03cd36-7106-49cc-a1bd-3771e8a32b09",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "4b55aa85-2e74-4d62-973b-6f6f7153c5f1",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "4c0ad017-b581-4200-a2f9-becf4da5be3c",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "4c34bc19-5e53-4bef-82a4-5ff2e1e1e61e",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "4c7fbbe5-03f9-4ccd-9686-4710cc95953c",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "4ccae5f0-ed80-43da-8427-5acbb1a3134c",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "4d960e46-2cd2-470f-9bce-51399c2cb3b8",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "4d96f617-a565-4be4-9822-1416d3577f96",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "4e4ad444-4aa5-4740-b2ab-b47becdee18f",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "4fc96df9-1879-4be8-ac88-72bacdfda1bc",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "508eed63-7112-4583-84ed-df4e85177b07",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "50ff4846-52ad-454c-aa44-316ce92a0a90",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "518ffc32-71d1-48f9-8dd1-198f995ce15b",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "567b540f-32c5-4f27-b855-33ff3b1a1470",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "5741064c-91ed-4d5a-b2da-0eedf62f754d",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "5774859b-bec3-4308-b379-f0d58e34e370",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "58cf8e1f-d4d4-4669-b9a2-8557c0b71bef",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "59c78483-0f66-450b-a38b-0485c09c9bef",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "5a413680-c516-4c41-8c1b-d7d1e35a3f1e",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "5a62a190-b8e1-4918-a85c-fdaac767ef70",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "5adfbc6c-9872-4d2a-b763-4f4528beb8de",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "5c1aa8c6-c71d-443f-adee-c1a1157252f2",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "5cdb1348-1ec5-414f-b5d8-2c89dfb28512",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "5d4fba70-ee2b-4948-942d-9869f9f2ecf0",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:23:19.000Z"
  },
  {
    "id": "5da76e02-b47e-458f-829f-fa7a1710ab24",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "5e238f39-7dd2-4c06-aedd-cfbb856c1722",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "5e57aba6-05c6-421a-8b80-6223b325f0d5",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "5e853f0f-1f4f-43e2-810f-483f37eeb722",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "5e965b80-b9df-44f6-a529-5db949f48487",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:11:19.000Z"
  },
  {
    "id": "5f1d8a0b-ee5f-4515-9995-2c58557605f0",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "5f2cfc27-15a3-4efe-9d06-31a4c407ced3",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "5f548130-ea09-432f-b428-a9e316a0121a",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "5f88d9e9-d607-449c-a842-bbc8c1edbb6b",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "60a1ee55-269c-47e0-ae1a-8f3933da0c0a",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:11:19.000Z"
  },
  {
    "id": "60cda1c8-4f03-4d80-9ff0-c5effefcea6e",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:23:19.000Z"
  },
  {
    "id": "620ae1c8-135d-46af-9cb8-4672552aadb9",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "62a2d346-fb13-4055-8c2e-1fc304041162",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "62ae3113-f457-4fc2-bc60-ecaec2231149",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "6363ecc6-fb3f-4d0c-8e96-615400ba6d15",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "63b37414-a02e-4f1c-949a-8becab31f880",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "64423dc4-3590-4f4d-adae-2177c2792f38",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "6589c86c-7692-4321-aee5-471082341f21",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "6653701b-3d8a-429f-a7d8-ee9f943591a0",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "67065ff4-7d58-4bf7-994d-de2a2e3ebb82",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "6878df15-ad9d-4b16-aa7d-6e91eca0bc14",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "6934c35f-d96a-4d32-abfe-8f66d6e036a5",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "69b48164-b099-4ce1-a763-02d3ea6ba27a",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "69f18fbc-e959-4b09-af74-9dfa484818c7",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "6a05b0c2-e58a-44f7-a8c3-801e167d708a",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "6a963ced-b6ac-4b69-85ce-7c508a7c373e",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "6b34aae9-8abb-4bc1-8c8e-18ae98d92997",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "6b5b2010-f299-4769-884d-b5a3581e9892",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-010",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "6bfd1310-e1bc-4ba5-8203-f47365719709",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "6ce9fe49-b794-4806-91b9-9757d1796fb6",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "6cf742a6-45ef-48b5-a9a7-9fbf78552017",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "6d0b24f9-2628-4cf4-b4af-8faa2888bb1e",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "6d7a77fb-5407-4ab5-ae0f-b3f354b143f8",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "6eb2f4da-566e-4451-b967-6d054013d73c",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "6f213a0c-1eb5-4478-a0b3-b889ce8523aa",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "706b3e38-034d-4f80-90b5-bebd3452976d",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "717c589f-8607-40fb-84da-36341fc43626",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "75bd2122-1193-4c6c-9f17-be9003c89b55",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "75e6cce0-9115-4c08-b5e7-222ae9f44889",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "76202993-e37f-4c38-b7da-d0c834eea4ad",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "7653fd7d-c764-45be-bb1f-c1f89b08176e",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "7770d069-af30-4921-a8f2-ca0381db3d4a",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "7785ca89-f24d-4f4f-a05f-1a60a9e2fdc4",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:23:19.000Z"
  },
  {
    "id": "77cfdb37-292a-4baf-a352-f15954c14063",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "7807e59d-58e7-4071-b870-3386ccb966fd",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "78852244-310c-472c-8358-775cbacd9d42",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "789b5bf0-bc96-451e-b133-4f6fee5745ee",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "79f60a34-351c-4d52-b7a7-16e3a047e7ff",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "7aea8ade-a781-4e94-9398-1da729bd427f",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:11:19.000Z"
  },
  {
    "id": "7d578f77-0d53-4ab2-a09a-9d0780e90655",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "7e3e577d-919b-4754-9a1e-951d8a725ab3",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "7e4e0a34-b21c-4f0b-8ba1-bfcfcd26f0e1",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "7f2399f8-9020-4cd5-8018-b8022b597fa0",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "7f37b3cc-f336-49e7-be9d-288eb05032d8",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "81250283-4bc1-428d-ac46-ea61d332a503",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "815fa5ca-2048-4bba-9ec8-49fd58fbb312",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "823e81de-e943-477e-a56f-4630cd6ff9d0",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "82e2ef63-9104-4065-a8f3-8ef634800b5b",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:21:55.000Z"
  },
  {
    "id": "854e103c-4666-4f92-97de-bcfe5a9d2caf",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "866d09a4-ac51-4b5b-9003-88ef82488aa4",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "876f1a9c-a358-4c82-800f-44b6c5bc9131",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "87736b13-f63b-483c-baa1-891fe193d9ee",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "87bf7b55-7a34-41d7-a633-2541b2b93048",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "886c0148-bf18-4a6c-9ff3-a171a4c6bae3",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "8928ef4b-9abb-440f-9b94-27068bad32d0",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "8974b704-d86d-4e50-8257-0849317c75dd",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "89b6863a-abb1-4b05-ac32-73af52ecc62d",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "89f61ea9-6aa3-427b-8220-7c00a9d91556",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "8b439f2b-fe02-406b-872d-a8a57ed1b2b3",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "8b67c0c8-d561-44e0-8cbc-771563a8fb44",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "8d0a33dd-6636-4e90-b01f-6f9f3ea135c5",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "8dbb903e-1e70-4748-b765-e6ca30ddde6d",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "8ea247a1-6c1a-4d23-8f14-052dc9581a04",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "8ee29181-6855-4f44-94ee-5c582f47aee3",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "8f84c2cd-29c8-4b50-b6fe-630aad2db128",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "8f8ef48b-6109-42cb-b75b-e31c426200ea",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "8f9a87c1-10a5-4b3d-8e4c-d1bc7d5271c0",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "8ff2ae89-17a0-41e1-8ec1-494619b44160",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "9135d6ea-7336-424c-9b8d-761447040061",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "913f4c8d-89a2-409e-9312-3358d2dedddc",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "93747fb8-e7de-4373-9eed-456209a14d5a",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "93a6aa21-23fd-48ab-a06a-b0d70335a0f0",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "958c075e-d259-4ec8-8449-815afbc9984f",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-010",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "9661dab4-8fab-4bb5-9d71-2c9cd566d816",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "96897718-eeaa-43de-b79d-1aa74c7b8314",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "96cb1c96-7c7a-4227-aaef-05320fd64ea1",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "971d5831-912b-4516-9395-1c1b907a49d9",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "974a79e4-f48d-4908-bd28-dcd974a6dba1",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "97af9d77-9573-465c-986f-73f641207d4b",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "989241ad-7fd6-443f-abc6-04c9b7825689",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "994f4869-c82a-4bd5-bbe4-d40ef63d29e3",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "9a2b6a20-c7b5-4569-b266-6c8295c6ad94",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "9b50647c-f854-450b-8988-72d114179abc",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:23:19.000Z"
  },
  {
    "id": "9c2cbb9f-bd55-43f5-88aa-5613814631a6",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "9c6b0477-0be3-4d83-9249-44e91c180ad7",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "9da8e68a-4f65-4e52-95f1-7f7bebe904b2",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "9df196d7-aca6-427d-92da-d85458004ffc",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "9f8f8fdb-e0fc-403c-bf68-e81bf4ca138e",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "9fc43932-04ba-4ec5-82ca-058f944c7a04",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "a11373e9-5adf-4c46-968a-f1b7cb745559",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "a1620ee6-9900-4e70-b9be-ffd9863edb76",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "a24c812e-04e8-4dda-af95-27124e5b7bae",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "a2f60375-2582-41d7-aba8-9c095b23c07c",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "a321b536-0fef-4bbb-bbe0-2e8cd3354ea7",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "a5be63ff-86b5-4868-b40d-db01b0adf187",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "a63f52a0-a301-4995-94b7-d8599d2b1e47",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "a718aefa-c0f0-4aeb-806a-1c623e03feff",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "a951967c-d11e-44ee-84bf-96073ee7df23",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "aa349ebe-7929-471c-8859-7dc61bbe17c1",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "ac295392-275b-45ff-9626-3314beaba506",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "ae6fdcea-2a87-4abd-992e-19f7aaa45141",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "ae7bafc5-41af-4060-b57b-6abc2c363467",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "af9328c3-4c23-40cf-a1cd-7194ac0612b8",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "afcf8956-cdbf-4501-89c0-3fa7a6b0ea59",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "afd3b4d2-f71d-47bf-b0e7-b4b2d55de0f9",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "b15ddd39-1e63-4e46-93cd-3a637049765f",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-010",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "b1cbeaef-14fb-4738-9ae5-3881bfbf606f",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "b20abf9e-f87f-4d8f-9cd0-9fa5eeefe724",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "b3ab5028-9f2c-4c99-806d-f5073fdc89c4",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "b3bcaee2-3c01-48a9-a6c5-fb64059e00c4",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "b3ee07e9-0992-4644-a600-276827413576",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "b4040e90-45bd-4ca6-9f7a-b38e37d44b17",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "b44e7e6b-930b-41cc-aa77-b33d11bdcc9b",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "b538287a-eed5-42d8-a7ae-d6455e9d16d7",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "b6aa8587-b61d-4670-b171-da1828cd8098",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "b73dbc40-9e6f-4fba-8b0b-0f9fe28dab12",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "b7547996-4b36-4dc7-b64f-b80df5ec2208",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "b8ecee7a-6191-4507-9508-f1469f17ba96",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "b933ed9a-0fbb-4e38-a43e-4ebde4fe76aa",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:11:19.000Z"
  },
  {
    "id": "b9e7876e-99d8-4d28-b535-403fca1be313",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "baf56fe6-e5d7-42c3-8ec4-37b8005e2f41",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "bb1fd442-2ded-4fe1-bffd-5841198acb5b",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "bb4089cb-2737-40eb-a69d-c08006ff0f8c",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "bb863026-1ea0-48f9-aaa0-a25fa8c78309",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "bc387edf-4cab-4746-bdfb-f5d9b96d7cd9",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "bc524e27-a5ba-444a-b1b0-d13c61102af4",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "bd490634-d9c7-4496-a30c-10e9bca0fb50",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "bd642782-e3d3-42f1-82bb-1ad2c950dba1",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "bd7402c4-b2fb-49d2-833b-31ebd08bc7ec",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "bdfcace6-c1c4-40b6-9db3-977fc7a435e5",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "be98c99f-0581-4908-a894-4268cc9c0065",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "bf5eafab-2dd3-4c92-b5bb-eae7dc76c995",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "bfa56797-d9c4-4eed-b269-ef9c52703518",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "bfc2defe-087c-4a4d-878d-f142c3ce2f1e",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "c040ff49-01b5-4133-ae37-7e3adf4f7483",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "c0d29a03-275d-4473-ba72-ebea47c5ffbc",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "c1f1e7ca-6444-45ba-9391-17b9dbaed21a",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "c4431d95-235c-47af-8f48-ec221ce5cc85",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "c46ab449-281a-4ac0-869c-e5014864c2a3",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "c583e6ef-2b41-4917-9d5a-95d2c47cf35d",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "c90f272a-e935-4219-82dc-799cdf62d42d",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "ca02a04d-f52c-4f6c-9191-76a1cba99e1a",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "ca868e7c-0a77-4b77-b07c-abf8a3c7503f",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "cb7efc23-4299-4158-af12-d79c17bd1eec",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "cba780d1-25c6-416d-8420-f45ba448e190",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "cc81a558-b124-47ed-9c81-9f652ac60cfc",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-010",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "ccdce6d1-2f8f-4e76-997d-5f389c5ee771",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:21:56.000Z"
  },
  {
    "id": "cd40d81c-b550-4eb1-8fcf-69482b946a94",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "cdd8a4db-a161-434c-8748-591142c0bf07",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "ce94302d-828e-43b2-8da2-d3a1c06574ff",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "cf16457a-fce5-44ba-8e05-0ea13a311b2f",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "d067ba9b-7d24-4ece-bd3f-afa050868690",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "d080e8cd-00f6-45de-8951-7915fb4864e8",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "d130254c-b182-4f23-b2b5-65ac0a2cac20",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "d1425568-c72c-49b3-9bf1-8f316d355d2b",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "d27312ff-ea7b-4a28-a2bf-b7df03e9e98d",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "d2906111-3400-4e8c-8bed-31080d9e49cc",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "d358f710-42a4-4072-bb44-7922823bfd95",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "d3f2c7bf-8f7e-4317-89d3-07a57769c383",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "d407d9df-87f4-4e9c-86da-71a381ae4ebb",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "d46da0cc-03c7-4be8-8a46-990f32cee085",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "d5b11af3-8cc6-4841-912e-32cfd5db0ce8",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-009",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "d6dfa697-4d70-49c9-b6f9-b24920acb93e",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "d6eae262-71c6-4a65-b1d6-dd99d98f1122",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "d7076ad2-e169-4999-b53a-c2f29c3e3276",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "d712c6bb-cd96-4833-8cbe-e4a500412946",
    "electionId": "306f8e72-f27d-4822-913a-403f156f034d",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:20:51.000Z"
  },
  {
    "id": "d88f415a-2b9b-4be7-b9ea-d3322aed681d",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "d8d98305-9381-47a9-b37f-664b7c08869e",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "d8deb049-b7fc-49cc-ac43-2fd39a64ee19",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "d980016e-ee98-43bc-ae98-b179201d19f5",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "d9be0db7-c0cc-4667-b384-8d62286be0af",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "da3e3b7b-f0d2-49d7-9866-e45e73d4d17e",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:23:19.000Z"
  },
  {
    "id": "da8da34a-9f31-4b08-9213-dac6366772c5",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "dbe314b5-a56a-4ac2-89bc-5f3bd5213bc5",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-006",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "dc2e30fe-52ba-4958-9aa3-f5266db0d6aa",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "dc4482f4-bf7b-4c65-8f69-a636e838bab5",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "dd802df3-1434-41ad-96f1-bc6aba2f6eec",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "dfffdcf3-4a37-47b3-b644-73759042e169",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "e0404629-cfd6-4c83-9726-eb60316ffc2b",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "e1cfd5df-90a9-469a-999b-38af90b99b6a",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "e26463bd-51d0-4048-bd79-faddebe5d5ec",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "e28ebcf1-ef2b-4c05-a21d-c7361ec6e504",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "e29b8cb0-8bf2-410e-96af-c0f8bd2fccc1",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-003",
    "created_at": "2025-07-28T20:11:18.000Z"
  },
  {
    "id": "e29bf564-a803-4695-9aab-3403a08410dd",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "e3260652-b944-4b9d-a941-b1fc0317ad2d",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "e40fb67e-2bc4-4287-af63-a0ddd610470d",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "e57e3940-3657-464d-bd28-c5c73de8d5af",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-017",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "e5bba73a-4ff8-4f3f-9b06-e2725538c577",
    "electionId": "29222e43-1986-4102-b60f-7bfb0d3dfcb3",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:09:34.000Z"
  },
  {
    "id": "e5cb4333-cc19-4e09-ae18-19e4e1cc8d93",
    "electionId": "9e9941ef-32dc-413a-ac43-056037a01443",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:09:13.000Z"
  },
  {
    "id": "e5d73cd8-cfba-4694-a5c0-778487e3d43c",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "e6b60f55-3801-4fdc-8f5c-cc8cdc9266bf",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "e7a89451-674c-400a-92b6-f26eca441f4f",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "e885effa-bcad-4e61-bd7d-cc875492866d",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "e9823ab3-8b94-4162-88ea-14af2ba35a43",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-001",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "e9d813fb-0454-4ca9-8525-ab79d98304ec",
    "electionId": "bfd17122-4cc2-4e6d-b6e2-f2f16e43640b",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:16:33.000Z"
  },
  {
    "id": "ea0b0493-f2ea-4fa1-8f61-ee9f0285da81",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "ebb74fce-3855-4b51-8c7a-d5740473bd25",
    "electionId": "17a22a5d-fbbb-4ac1-916b-33926ea9ddc8",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:11:30.000Z"
  },
  {
    "id": "ec7439cd-7da3-4048-b436-024f0d8aaa39",
    "electionId": "95939296-220b-48ab-8891-ba404686d545",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:23:16.000Z"
  },
  {
    "id": "ef5cc39a-0993-48a9-a0c6-882df1fd2d42",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "eff552cc-a6a0-40e3-91c7-9b84b6d3ac33",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "f25d135d-e07d-4c1e-bd1a-a6d2d9f81e6f",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-016",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "f2779b29-f349-4f92-9c07-d2ca2ea029dd",
    "electionId": "a9b94848-7b93-41ee-860c-8bbf66ab73e4",
    "candidateId": "cand-011",
    "created_at": "2025-07-28T20:16:19.000Z"
  },
  {
    "id": "f3942523-704e-40e0-86a4-5281012a8b63",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "f400a368-ba27-433c-bfff-134a5e109747",
    "electionId": "122ed208-9891-461c-ba13-d2cd4b53befd",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:09:28.000Z"
  },
  {
    "id": "f4292164-1692-4d77-bff9-c0932761e4db",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "f525f47a-9e5f-4ca5-9217-b15f63ab2ad3",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "f5953c26-38e2-4498-b014-7f73bc59391f",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:23:18.000Z"
  },
  {
    "id": "f691ce48-b47b-49f1-a538-c8a49b8bb00c",
    "electionId": "def2ae23-6280-49cb-93d5-8f94b48d7eaa",
    "candidateId": "cand-014",
    "created_at": "2025-07-28T20:11:19.000Z"
  },
  {
    "id": "f6bfef77-5c30-4bfb-8d86-4d7e57aba159",
    "electionId": "729cce5c-270c-4b48-a810-49507df757b6",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:08:26.000Z"
  },
  {
    "id": "f70e822a-adc7-4abe-9d97-2db5026c409d",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "f744ec73-4f88-4b3b-a94b-8f3466b8910b",
    "electionId": "090945d6-c646-4966-b352-531b89efd58c",
    "candidateId": "cand-002",
    "created_at": "2025-07-28T20:21:55.000Z"
  },
  {
    "id": "f767e43c-d218-4d7e-af11-29b10b49abb7",
    "electionId": "accc894b-c91f-4351-98e3-4be85fc3c28d",
    "candidateId": "cand-010",
    "created_at": "2025-07-28T20:20:55.000Z"
  },
  {
    "id": "f7aafc99-6e96-47f9-bc9d-9290cf543f9e",
    "electionId": "d09c2072-9714-4431-b9be-9b0b7e9536bf",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:21:03.000Z"
  },
  {
    "id": "f8d2afc1-657f-4001-9ff2-00d155cbfa7d",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-008",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "f9b37309-221b-422c-90b2-a1b0391e281b",
    "electionId": "d51ff58c-3b9c-4704-be69-8b7be795b9d5",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:09:26.000Z"
  },
  {
    "id": "f9c9dedf-ebd9-4888-be75-d8de091e8202",
    "electionId": "77715170-d0e7-4c33-a5d5-adf63af970c0",
    "candidateId": "cand-012",
    "created_at": "2025-07-28T20:10:25.000Z"
  },
  {
    "id": "fa2b2ec3-5b83-46e4-babb-4267abb2de9a",
    "electionId": "29c67246-4165-48c7-9506-e09ba27ff207",
    "candidateId": "cand-018",
    "created_at": "2025-07-28T20:11:04.000Z"
  },
  {
    "id": "faed81e0-1222-49a8-8a8b-23af904e3053",
    "electionId": "aa4170b8-5cfd-46c4-8518-eed4de69c8ed",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:11:21.000Z"
  },
  {
    "id": "fb052134-c7e3-481c-bc37-bf92837a53f0",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-013",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "fb508499-4d98-434f-acd3-77bfe280757e",
    "electionId": "c2627f5b-f4df-4e40-b03f-b5a3f6c44cf1",
    "candidateId": "cand-004",
    "created_at": "2025-07-28T20:16:41.000Z"
  },
  {
    "id": "fc6fd37c-1157-4e23-b331-2f19bda20173",
    "electionId": "b4a670dc-a30a-4fe8-8d83-b7490e2828b4",
    "candidateId": "cand-007",
    "created_at": "2025-07-28T20:16:35.000Z"
  },
  {
    "id": "fd523a27-e4c3-4567-be20-87ecbc67b1ea",
    "electionId": "394de1f3-6c55-42e5-a6f7-e6e81685cf80",
    "candidateId": "cand-005",
    "created_at": "2025-07-28T20:09:35.000Z"
  },
  {
    "id": "ffc6e012-f360-438c-9fc1-38b113ee3a43",
    "electionId": "10d26aec-a4df-4487-ae90-abbc4ca6855f",
    "candidateId": "cand-015",
    "created_at": "2025-07-28T20:23:19.000Z"
  }
]
};

export async function seedWithCurrentData(connection) {
  console.log('🌱 Seeding database with current data...');
  
  try {
    // Insert superadmins
    if (currentSeedData.superadmins.length > 0) {
      console.log('👑 Inserting superadmins...');
      for (const superadmin of currentSeedData.superadmins) {
        await connection.execute(
          'INSERT IGNORE INTO superadmins (id, username, email, password, created_at) VALUES (?, ?, ?, ?, ?)',
          [superadmin.id, superadmin.username, superadmin.email, superadmin.password, superadmin.created_at]
        );
      }
    }
    
    // Insert admins
    if (currentSeedData.admins.length > 0) {
      console.log('👨‍💼 Inserting admins...');
      for (const admin of currentSeedData.admins) {
        await connection.execute(
          'INSERT IGNORE INTO admins (id, username, email, password, created_at) VALUES (?, ?, ?, ?, ?)',
          [admin.id, admin.username, admin.email, admin.password, admin.created_at]
        );
      }
    }
    
    // Insert departments
    if (currentSeedData.departments.length > 0) {
      console.log('🏢 Inserting departments...');
      for (const dept of currentSeedData.departments) {
        await connection.execute(
          'INSERT IGNORE INTO departments (id, name, created_at) VALUES (?, ?, ?)',
          [dept.id, dept.name, dept.created_at]
        );
      }
    }
    
    // Insert courses
    if (currentSeedData.courses.length > 0) {
      console.log('📚 Inserting courses...');
      for (const course of currentSeedData.courses) {
        await connection.execute(
          'INSERT IGNORE INTO courses (id, name, departmentId, created_at) VALUES (?, ?, ?, ?)',
          [course.id, course.name, course.departmentId, course.created_at]
        );
      }
    }
    
    // Insert positions
    if (currentSeedData.positions.length > 0) {
      console.log('🏛️ Inserting positions...');
      for (const position of currentSeedData.positions) {
        await connection.execute(
          'INSERT IGNORE INTO positions (id, title, description, created_at) VALUES (?, ?, ?, ?)',
          [position.id, position.title, position.description, position.created_at]
        );
      }
    }
    
    // Insert candidates
    if (currentSeedData.candidates.length > 0) {
      console.log('👥 Inserting candidates...');
      for (const candidate of currentSeedData.candidates) {
        await connection.execute(
          'INSERT IGNORE INTO candidates (id, name, positionId, created_at) VALUES (?, ?, ?, ?)',
          [candidate.id, candidate.name, candidate.positionId, candidate.created_at]
        );
      }
    }
    
    // Insert voters
    if (currentSeedData.voters.length > 0) {
      console.log('🗳️ Inserting voters...');
      for (const voter of currentSeedData.voters) {
        await connection.execute(
          'INSERT IGNORE INTO voters (id, name, email, studentId, hasVoted, departmentId, courseId, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [voter.id, voter.name, voter.email, voter.studentId, voter.hasVoted, voter.departmentId, voter.courseId, voter.created_at]
        );
      }
    }
    
    // Insert elections
    if (currentSeedData.elections.length > 0) {
      console.log('🗳️ Inserting elections...');
      for (const election of currentSeedData.elections) {
        await connection.execute(
          'INSERT IGNORE INTO elections (id, title, description, startDate, endDate, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [election.id, election.title, election.description, election.startDate, election.endDate, election.status, election.created_at]
        );
      }
    }
    
    // Insert election_positions
    if (currentSeedData.election_positions.length > 0) {
      console.log('📋 Inserting election positions...');
      for (const ep of currentSeedData.election_positions) {
        await connection.execute(
          'INSERT IGNORE INTO election_positions (id, electionId, positionId, created_at) VALUES (?, ?, ?, ?)',
          [ep.id, ep.electionId, ep.positionId, ep.created_at]
        );
      }
    }
    
    // Insert election_candidates
    if (currentSeedData.election_candidates.length > 0) {
      console.log('👥 Inserting election candidates...');
      for (const ec of currentSeedData.election_candidates) {
        await connection.execute(
          'INSERT IGNORE INTO election_candidates (id, electionId, candidateId, created_at) VALUES (?, ?, ?, ?)',
          [ec.id, ec.electionId, ec.candidateId, ec.created_at]
        );
      }
    }
    
    console.log('✅ Current data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding current data:', error);
    throw error;
  }
}
