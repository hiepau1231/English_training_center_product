"use strict";
// import {
//   Column,
//   CreateDateColumn,
//   DeleteDateColumn,
//   Entity,
//   ManyToMany,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Teacher } from './teacherEntity';
// @Entity('level')
// export class Level {
//   @PrimaryGeneratedColumn()
//   id!: number;
//   @Column({ name: 'level_name', type: 'varchar', length: 100, nullable: false })
//   levelName!: string;
//   @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt!: Date;
//   @UpdateDateColumn({
//     name: 'updated_at',
//     type: 'timestamp',
//     default: () => 'CURRENT_TIMESTAMP',
//     onUpdate: 'CURRENT_TIMESTAMP',
//   })
//   updatedAt!: Date;
//   @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
//   deletedAt!: Date;
//   @Column({ name: 'is_deleted', type: 'boolean', default: false })
//   isDeleted!: boolean;
//   @ManyToMany(() => Teacher, (teacher) => teacher.levels)
//   associatedTeachers!: Teacher[];
//   teachers: any;
//   teacherLevels: any;
// }
//# sourceMappingURL=levelEntity.js.map