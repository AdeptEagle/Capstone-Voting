-- Add displayOrder columns to existing tables
-- Run this script in your MySQL database

USE voting_system;

-- Add displayOrder column to positions table
ALTER TABLE positions ADD COLUMN displayOrder INT NOT NULL DEFAULT 0;

-- Add displayOrder column to candidates table  
ALTER TABLE candidates ADD COLUMN displayOrder INT NOT NULL DEFAULT 0;

-- Update existing positions with sequential display order
UPDATE positions SET displayOrder = 1 WHERE name = 'President';
UPDATE positions SET displayOrder = 2 WHERE name = 'Vice President';
UPDATE positions SET displayOrder = 3 WHERE name = 'Secretary';
UPDATE positions SET displayOrder = 4 WHERE name = 'Treasurer';
UPDATE positions SET displayOrder = 5 WHERE name = 'Auditor';
UPDATE positions SET displayOrder = 6 WHERE name = 'Public Information Officer (Internal)';
UPDATE positions SET displayOrder = 7 WHERE name = 'Public Information Officer (External)';

-- Update existing candidates with sequential display order within each position
UPDATE candidates SET displayOrder = 1 WHERE positionId = 'president-001' AND name = 'John Doe';
UPDATE candidates SET displayOrder = 2 WHERE positionId = 'president-001' AND name = 'Jane Smith';

-- Add indexes for better performance
CREATE INDEX idx_positions_display_order ON positions(displayOrder);
CREATE INDEX idx_candidates_display_order ON candidates(displayOrder);

-- Verify the columns were added
DESCRIBE positions;
DESCRIBE candidates; 