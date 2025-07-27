-- Migration script to add displayOrder columns
-- Run this script on existing databases to add priority ordering

-- Add displayOrder column to positions table
ALTER TABLE positions ADD COLUMN IF NOT EXISTS displayOrder INT NOT NULL DEFAULT 0;

-- Add displayOrder column to candidates table  
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS displayOrder INT NOT NULL DEFAULT 0;

-- Update existing positions with default display order based on current order
-- This will set displayOrder to 1, 2, 3, etc. based on current alphabetical order
SET @row_number = 0;
UPDATE positions 
SET displayOrder = (@row_number:=@row_number + 1) 
ORDER BY name;

-- Update existing candidates with default display order based on current order
-- This will set displayOrder to 1, 2, 3, etc. within each position
SET @row_number = 0;
UPDATE candidates 
SET displayOrder = (@row_number:=@row_number + 1) 
WHERE positionId = 'president-001'
ORDER BY name;

SET @row_number = 0;
UPDATE candidates 
SET displayOrder = (@row_number:=@row_number + 1) 
WHERE positionId = 'vice-president-001'
ORDER BY name;

SET @row_number = 0;
UPDATE candidates 
SET displayOrder = (@row_number:=@row_number + 1) 
WHERE positionId = 'secretary-001'
ORDER BY name;

SET @row_number = 0;
UPDATE candidates 
SET displayOrder = (@row_number:=@row_number + 1) 
WHERE positionId = 'treasurer-001'
ORDER BY name;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_positions_display_order ON positions(displayOrder);
CREATE INDEX IF NOT EXISTS idx_candidates_display_order ON candidates(displayOrder); 