USE english_tranning_center;

-- Add numberOfStudents column to classes table
ALTER TABLE `classes` ADD COLUMN `number_of_students` int(11) DEFAULT 0; 