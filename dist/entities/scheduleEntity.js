"use strict";
// import {
//   Column,
//   CreateDateColumn,
//   DeleteDateColumn,
//   Entity,
//   JoinTable,
//   ManyToMany,
//   ManyToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Class } from './classEntity';
// import { Classroom } from './classroomEntity';
// import { Shift } from './shiftEntity';
// @Entity('schedules')
// export class Schedule {
//   @PrimaryGeneratedColumn()
//   id!: number;
//   @CreateDateColumn({ name: 'created_at' })
//   createdAt!: Date;
//   @Column({ name: 'shift_id', nullable: true })
//   shiftId?: number;
//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt!: Date;
//   @DeleteDateColumn({ name: 'deleted_at' })
//   deletedAt!: Date;
//   @Column({ name: 'schedule_date', type: 'date', nullable: true })
//   scheduleDate?: string;
//   @ManyToOne(() => Classroom, (classroom) => classroom.schedules, {
//     nullable: true,
//     onDelete: 'SET NULL',
//   })
//   classroom!: Classroom | null;
//   @Column({ type: 'boolean', name: 'is_deleted', default: false })
//   isDeleted!: boolean;
//   @ManyToOne(() => Shift, (shift) => shift.schedules, {
//     nullable: true,
//     onDelete: 'SET NULL',
//   })
//   shift!: Shift | null;
//   @ManyToMany(() => Class, (classEntity) => classEntity.schedules)
//   @JoinTable({
//     name: 'class_schedule',
//     joinColumn: { name: 'schedule_id', referencedColumnName: 'id' },
//     inverseJoinColumn: { name: 'class_id', referencedColumnName: 'id' },
//   })
//   classes!: Class[];
//   @ManyToMany(() => Shift, (shift) => shift.schedules)
//   @JoinTable({
//     name: 'schedule_shifts',
//     joinColumn: { name: 'schedule_id', referencedColumnName: 'id' },
//     inverseJoinColumn: { name: 'shift_id', referencedColumnName: 'id' },
//   })
//   shifts!: Shift[];
//   class: any;
//   classSchedules: any;
// }
//# sourceMappingURL=scheduleEntity.js.map