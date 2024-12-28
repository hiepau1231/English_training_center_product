import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateShiftTimes1703000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update NULL values to default times
        await queryRunner.query(`
            UPDATE shifts
            SET 
                start_time = '08:00:00',
                end_time = '09:30:00'
            WHERE start_time IS NULL OR end_time IS NULL
        `);

        // Apply NOT NULL constraints
        await queryRunner.query(`
            ALTER TABLE shifts
            MODIFY start_time TIME NOT NULL,
            MODIFY end_time TIME NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the NOT NULL constraints
        await queryRunner.query(`
            ALTER TABLE shifts
            MODIFY start_time TIME NULL,
            MODIFY end_time TIME NULL
        `);
    }
}
