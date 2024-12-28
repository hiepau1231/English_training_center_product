USE english_tranning_center;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop and recreate the classrooms table
DROP TABLE IF EXISTS `classrooms`;

CREATE TABLE `classrooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classroom_name` varchar(100) NOT NULL,
  `capacity` int(11) NOT NULL,
  `type` enum('Phong Nghe Nhin', 'Phong Truc Tuyen', 'Phong Online', 'Phong Cho Tre') NOT NULL DEFAULT 'Phong Truc Tuyen',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert sample data
INSERT INTO `classrooms` (`classroom_name`, `capacity`, `type`, `status`, `created_at`, `updated_at`, `deleted_at`, `is_deleted`) VALUES
('P001', 30, 'Phong Online', 0, '2024-01-17 14:30:00', '2024-01-17 14:30:00', NULL, 0),
('P002', 25, 'Phong Truc Tuyen', 0, '2024-01-17 14:30:00', '2024-01-17 14:30:00', NULL, 0),
('P003', 20, 'Phong Nghe Nhin', 0, '2024-01-17 14:30:00', '2024-01-17 14:30:00', NULL, 0),
('P004', 15, 'Phong Cho Tre', 0, '2024-01-17 14:30:00', '2024-01-17 14:30:00', NULL, 0);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1; 