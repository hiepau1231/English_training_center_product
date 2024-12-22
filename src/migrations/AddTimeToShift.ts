import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTimeToShift1703000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("shifts", [
            new TableColumn({
                name: "start_time",
                type: "time",
                isNullable: false,
                default: "'08:00:00'"
            }),
            new TableColumn({
                name: "end_time",
                type: "time",
                isNullable: false,
                default: "'09:30:00'"
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("shifts", "start_time");
        await queryRunner.dropColumn("shifts", "end_time");
    }
} 