-- Migration: Replace department column with voterGroupId in candidates table
-- Run this script to update the candidates table to reference voter groups

USE voting_system;

-- First, add the new voterGroupId column
ALTER TABLE candidates ADD COLUMN voterGroupId VARCHAR(36) AFTER positionId;

-- Add foreign key constraint to voter_groups table
ALTER TABLE candidates ADD CONSTRAINT fk_candidates_voter_group 
FOREIGN KEY (voterGroupId) REFERENCES voter_groups(id) ON DELETE SET NULL;

-- Add index for voterGroupId queries
CREATE INDEX idx_candidates_voter_group ON candidates(voterGroupId);

-- Note: If you had existing department data, you might want to migrate it
-- For example, if you had departments like 'Computer Science', 'Engineering', etc.
-- you could create corresponding voter groups and update the references
-- This is optional and depends on your existing data structure 