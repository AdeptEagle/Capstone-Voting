-- Database setup script for the voting system
-- Run this script in your MySQL database to create the necessary tables

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS voting_system;
USE voting_system;

-- Create positions table
CREATE TABLE IF NOT EXISTS positions (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    voteLimit INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    positionId VARCHAR(36) NOT NULL,
    photoUrl TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE
);

-- Create voters table
CREATE TABLE IF NOT EXISTS voters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    studentId VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255),
    hasVoted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
    id VARCHAR(36) PRIMARY KEY,
    voterId INT NOT NULL,
    candidateId VARCHAR(36) NOT NULL,
    electionId VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voterId) REFERENCES voters(id) ON DELETE CASCADE,
    FOREIGN KEY (candidateId) REFERENCES candidates(id) ON DELETE CASCADE,
    UNIQUE KEY unique_vote (voterId, candidateId, electionId)
);

-- Create elections table
CREATE TABLE IF NOT EXISTS elections (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    status ENUM('draft', 'active', 'ended', 'cancelled') DEFAULT 'draft',
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE CASCADE
);

-- Create election_positions table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS election_positions (
    id VARCHAR(36) PRIMARY KEY,
    electionId VARCHAR(36) NOT NULL,
    positionId VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (electionId) REFERENCES elections(id) ON DELETE CASCADE,
    FOREIGN KEY (positionId) REFERENCES positions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_election_position (electionId, positionId)
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'admin') NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default superadmin (password should be hashed in production)
INSERT IGNORE INTO admins (id, username, password, role) VALUES
('superadmin-001', 'superadmin', 'superadmin123', 'superadmin');

-- Insert some initial positions
INSERT IGNORE INTO positions (id, name, voteLimit) VALUES
('president-001', 'President', 1),
('vice-president-001', 'Vice President', 1),
('secretary-001', 'Secretary', 1),
('treasurer-001', 'Treasurer', 1),
('auditor-001', 'Auditor', 1),
('pio-internal-001', 'Public Information Officer (Internal)', 1),
('pio-external-001', 'Public Information Officer (External)', 1),
('senator-001', 'Senator 1', 1),
('senator-002', 'Senator 2', 1),
('senator-003', 'Senator 3', 1),
('senator-004', 'Senator 4', 1),
('senator-005', 'Senator 5', 1),
('senator-006', 'Senator 6', 1),
('senator-007', 'Senator 7', 1),
('senator-008', 'Senator 8', 1);

-- Insert some sample candidates
INSERT IGNORE INTO candidates (id, name, positionId, description) VALUES
('candidate-001', 'John Doe', 'president-001', 'Experienced leader with strong communication skills'),
('candidate-002', 'Jane Smith', 'president-001', 'Dedicated student advocate with innovative ideas'),
('candidate-003', 'Mike Johnson', 'vice-president-001', 'Organized and detail-oriented team player'),
('candidate-004', 'Sarah Wilson', 'secretary-001', 'Excellent record-keeping and organizational skills'),
('candidate-005', 'David Brown', 'treasurer-001', 'Strong financial management background');

-- Insert some sample voters
INSERT IGNORE INTO voters (id, name, email, studentId, password) VALUES
('voter-001', 'Alice Cooper', 'alice.cooper@student.edu', '2021-001', 'password1'),
('voter-002', 'Bob Davis', 'bob.davis@student.edu', '2021-002', 'password2'),
('voter-003', 'Carol Evans', 'carol.evans@student.edu', '2021-003', 'password3'),
('voter-004', 'Dan Foster', 'dan.foster@student.edu', '2021-004', 'password4'),
('voter-005', 'Eva Green', 'eva.green@student.edu', '2021-005', 'password5');

-- Create indexes for better performance
CREATE INDEX idx_candidates_position ON candidates(positionId);
CREATE INDEX idx_votes_voter ON votes(voterId);
CREATE INDEX idx_votes_candidate ON votes(candidateId);
CREATE INDEX idx_voters_email ON voters(email);
CREATE INDEX idx_voters_student_id ON voters(studentId); 