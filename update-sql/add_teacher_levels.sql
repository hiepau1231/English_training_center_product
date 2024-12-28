USE english_tranning_center;

-- Create teacher_levels table
CREATE TABLE IF NOT EXISTS `teacher_levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add level_id column to teachers table if it doesn't exist
SET @dbname = 'english_tranning_center';
SET @tablename = 'teachers';
SET @columnname = 'level_id';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' int(11) DEFAULT NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add foreign key if it doesn't exist
SET @fkname = 'fk_teachers_level';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND CONSTRAINT_NAME = @fkname
  ) > 0,
  'SELECT 1',
  'ALTER TABLE teachers ADD CONSTRAINT fk_teachers_level FOREIGN KEY (level_id) REFERENCES teacher_levels (id) ON DELETE SET NULL ON UPDATE CASCADE'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Insert default teacher levels if they don't exist
INSERT IGNORE INTO `teacher_levels` (`level_name`, `description`) VALUES
('Beginner', 'Teaching experience less than 1 year'),
('Intermediate', 'Teaching experience between 1-3 years'),
('Advanced', 'Teaching experience more than 3 years'); 