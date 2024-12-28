USE english_tranning_center;

-- Drop existing table
DROP TABLE IF EXISTS `class_schedules`;

-- Create new table with correct structure
CREATE TABLE `class_schedules` (
    `id` int NOT NULL AUTO_INCREMENT,
    `class_id` int NOT NULL,
    `schedule_date` date NOT NULL,
    `shift_id` int NOT NULL,
    `course_id` int NOT NULL,
    `room_id` int NOT NULL,
    `teacher_id` int NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    `is_deleted` tinyint(1) DEFAULT '0',
    PRIMARY KEY (`id`),
    KEY `FK_class_schedules_class` (`class_id`),
    KEY `FK_class_schedules_shift` (`shift_id`),
    KEY `FK_class_schedules_course` (`course_id`),
    KEY `FK_class_schedules_room` (`room_id`),
    KEY `FK_class_schedules_teacher` (`teacher_id`),
    CONSTRAINT `FK_class_schedules_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
    CONSTRAINT `FK_class_schedules_shift` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`),
    CONSTRAINT `FK_class_schedules_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
    CONSTRAINT `FK_class_schedules_room` FOREIGN KEY (`room_id`) REFERENCES `classrooms` (`id`),
    CONSTRAINT `FK_class_schedules_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; 