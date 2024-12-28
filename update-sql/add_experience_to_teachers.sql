USE english_tranning_center;

-- Add experience column to teachers table
ALTER TABLE `teachers` ADD COLUMN `experience` varchar(255) DEFAULT NULL; 