"use strict";
// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   CreateDateColumn,
//   UpdateDateColumn,
//   DeleteDateColumn,
// } from 'typeorm';
// import { Student } from './studentEntity';
// import { Class } from './classEntity';
// import { Teacher } from './teacherEntity';
// @Entity('attendance') // Tên bảng
// export class Attendance {
//   @PrimaryGeneratedColumn()
//   id!: number;
//   @Column({ name: 'student_id', type: 'int', nullable: false })
//   studentId!: number;
//   @Column({ name: 'class_id', type: 'int', nullable: false })
//   classId!: number;
//   @Column({ name: 'teacher_id', type: 'int', nullable: false })
//   teacherId!: number;
//   @Column({ name: 'attendance_date', type: 'date', nullable: false })
//   attendanceDate!: Date;
//   @Column({
//     name: 'status',
//     type: 'enum',
//     enum: ['Present', 'Absent', 'Late'],
//     default: 'Present',
//   })
//   status!: 'Present' | 'Absent' | 'Late';
//   @CreateDateColumn({ name: 'created_at' })
//   createdAt!: Date;
//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt!: Date;
//   @DeleteDateColumn({ name: 'deleted_at' })
//   deletedAt!: Date;
//   // Quan hệ nhiều-1 với Student
//   @ManyToOne(() => Student, (student) => student.attendances)
//   relatedStu
//# sourceMappingURL=attendanceEntity.js.map