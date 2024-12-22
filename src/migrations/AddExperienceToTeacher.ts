import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddExperienceToTeacher1703000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "teachers",
            new TableColumn({
                name: "experience",
                type: "varchar",
                length: "255",
                isNullable: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("teachers", "experience");
    }
} 