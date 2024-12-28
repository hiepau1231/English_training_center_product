USE english_tranning_center;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Update foreign key references in classes table
ALTER TABLE `classes` DROP FOREIGN KEY `classes_ibfk_349`;
ALTER TABLE `classes` ADD CONSTRAINT `classes_ibfk_349` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`id`);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1; 