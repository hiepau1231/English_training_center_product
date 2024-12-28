import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimeColumnToClassSchedule1703000000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE class_schedules
            ADD COLUMN time VARCHAR(255) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE class_schedules
            DROP COLUMN time
        `);
    }
}
