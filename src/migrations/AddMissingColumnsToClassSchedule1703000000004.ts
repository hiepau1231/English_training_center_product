import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingColumnsToClassSchedule1703000000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE class_schedules
            ADD COLUMN schedule_date DATE NOT NULL,
            ADD COLUMN shift_id INT NOT NULL,
            ADD COLUMN course_id INT NOT NULL,
            ADD COLUMN room_id INT NOT NULL,
            ADD COLUMN teacher_id INT NOT NULL,
            ADD COLUMN course_name VARCHAR(255) NOT NULL,
            ADD COLUMN class_name VARCHAR(255) NOT NULL,
            ADD COLUMN main_teacher VARCHAR(255) NOT NULL,
            ADD COLUMN number_of_students INT NOT NULL DEFAULT 0,
            ADD COLUMN start_date DATE NOT NULL,
            ADD COLUMN end_date DATE NOT NULL,
            ADD FOREIGN KEY (shift_id) REFERENCES shifts(id),
            ADD FOREIGN KEY (course_id) REFERENCES courses(id),
            ADD FOREIGN KEY (room_id) REFERENCES classrooms(id),
            ADD FOREIGN KEY (teacher_id) REFERENCES teachers(id)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE class_schedules
            DROP FOREIGN KEY FK_class_schedules_shift,
            DROP FOREIGN KEY FK_class_schedules_course,
            DROP FOREIGN KEY FK_class_schedules_room,
            DROP FOREIGN KEY FK_class_schedules_teacher,
            DROP COLUMN schedule_date,
            DROP COLUMN shift_id,
            DROP COLUMN course_id,
            DROP COLUMN room_id,
            DROP COLUMN teacher_id,
            DROP COLUMN course_name,
            DROP COLUMN class_name,
            DROP COLUMN main_teacher,
            DROP COLUMN number_of_students,
            DROP COLUMN start_date,
            DROP COLUMN end_date
        `);
    }
} 