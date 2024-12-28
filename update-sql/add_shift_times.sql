USE english_tranning_center;

-- Add start_time and end_time columns to shifts table if they don't exist
SET @dbname = 'english_tranning_center';
SET @tablename = 'shifts';

-- Add start_time column
SET @columnname = 'start_time';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT 1',
  'ALTER TABLE shifts ADD COLUMN start_time time DEFAULT NULL'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add end_time column
SET @columnname = 'end_time';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT 1',
  'ALTER TABLE shifts ADD COLUMN end_time time DEFAULT NULL'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Update existing shifts with time values
UPDATE shifts 
SET start_time = CASE teaching_shift
    WHEN 'Morning Shift (8:00 - 10:00)' THEN '08:00:00'
    WHEN 'Morning Shift (10:15 - 12:15)' THEN '10:15:00'
    WHEN 'Afternoon Shift (14:00 - 16:00)' THEN '14:00:00'
    WHEN 'Afternoon Shift (16:15 - 18:15)' THEN '16:15:00'
    WHEN 'Evening Shift (18:30 - 20:30)' THEN '18:30:00'
    ELSE NULL
END,
end_time = CASE teaching_shift
    WHEN 'Morning Shift (8:00 - 10:00)' THEN '10:00:00'
    WHEN 'Morning Shift (10:15 - 12:15)' THEN '12:15:00'
    WHEN 'Afternoon Shift (14:00 - 16:00)' THEN '16:00:00'
    WHEN 'Afternoon Shift (16:15 - 18:15)' THEN '18:15:00'
    WHEN 'Evening Shift (18:30 - 20:30)' THEN '20:30:00'
    ELSE NULL
END
WHERE start_time IS NULL OR end_time IS NULL; 