-- Migration: Update voter_groups table to use custom IDs
-- Run this script to allow custom IDs for voter groups

USE voting_system;

-- First, check if we need to update the column size
ALTER TABLE voter_groups MODIFY COLUMN id VARCHAR(20);

-- Update candidates table voterGroupId column size
ALTER TABLE candidates MODIFY COLUMN voterGroupId VARCHAR(20);

-- Update voters table voterGroupId column size
ALTER TABLE voters MODIFY COLUMN voterGroupId VARCHAR(20);

-- Update voter_group_members table voterGroupId column size
ALTER TABLE voter_group_members MODIFY COLUMN voterGroupId VARCHAR(20);

-- Add some sample voter groups with custom IDs
INSERT IGNORE INTO voter_groups (id, name, description, type, created_by) VALUES
('CCS', 'College of Computer Studies', 'Computer Science and IT programs', 'department', 'superadmin-001'),
('COE', 'College of Engineering', 'Engineering programs', 'department', 'superadmin-001'),
('CBM', 'College of Business and Management', 'Business and management programs', 'department', 'superadmin-001'),
('CAS', 'College of Arts and Sciences', 'Liberal arts and sciences programs', 'department', 'superadmin-001'),
('2024', 'Class of 2024', 'Senior students graduating in 2024', 'year', 'superadmin-001'),
('2025', 'Class of 2025', 'Junior students graduating in 2025', 'year', 'superadmin-001'),
('2026', 'Class of 2026', 'Sophomore students graduating in 2026', 'year', 'superadmin-001'),
('2027', 'Class of 2027', 'Freshman students graduating in 2027', 'year', 'superadmin-001');

-- Add index for voter group ID queries
CREATE INDEX IF NOT EXISTS idx_voter_groups_id ON voter_groups(id); 