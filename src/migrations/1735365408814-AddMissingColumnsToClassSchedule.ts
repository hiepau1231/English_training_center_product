import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingColumnsToClassSchedule1735365408814 implements MigrationInterface {
    name = 'AddMissingColumnsToClassSchedule1735365408814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`class_schedules\` ADD \`course_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` ADD \`class_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` ADD \`main_teacher\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` ADD \`number_of_students\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` ADD \`start_date\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` ADD \`end_date\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_7400a31f7e26c287426c2e999a8\` FOREIGN KEY (\`classroom_id\`) REFERENCES \`classrooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` ADD CONSTRAINT \`FK_51930701cbb636b9ae192a92d5f\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` ADD CONSTRAINT \`FK_7076d3ab46bf81309e9a6c5567d\` FOREIGN KEY (\`room_id\`) REFERENCES \`classrooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` ADD CONSTRAINT \`FK_ecee5b7068cd5c579525803c44b\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` ADD CONSTRAINT \`FK_8311cc83d9350de70f2a77e8c5e\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` ADD CONSTRAINT \`FK_6087b3a96d1312b5de3524038db\` FOREIGN KEY (\`shift_id\`) REFERENCES \`shifts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`teachers\` ADD CONSTRAINT \`FK_c9bfbeb8a6fc8094304630cfdfe\` FOREIGN KEY (\`courses_level_id\`) REFERENCES \`teacher_levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teachers\` DROP FOREIGN KEY \`FK_c9bfbeb8a6fc8094304630cfdfe\``);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` DROP FOREIGN KEY \`FK_6087b3a96d1312b5de3524038db\``);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` DROP FOREIGN KEY \`FK_8311cc83d9350de70f2a77e8c5e\``);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` DROP FOREIGN KEY \`FK_ecee5b7068cd5c579525803c44b\``);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` DROP FOREIGN KEY \`FK_7076d3ab46bf81309e9a6c5567d\``);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` DROP FOREIGN KEY \`FK_51930701cbb636b9ae192a92d5f\``);
        await queryRunner.query(`ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_7400a31f7e26c287426c2e999a8\``);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` DROP COLUMN \`end_date\``);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` DROP COLUMN \`start_date\``);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` DROP COLUMN \`number_of_students\``);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` DROP COLUMN \`main_teacher\``);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` DROP COLUMN \`class_name\``);
        await queryRunner.query(`ALTER TABLE \`class_schedules\` DROP COLUMN \`course_name\``);
    }

}
