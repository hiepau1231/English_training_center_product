"use strict";
// import {
//   Column,
//   CreateDateColumn,
//   DeleteDateColumn,
//   Entity,
//   OneToMany,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from "typeorm";
// import { Class } from "./classEntity";
// @Entity("courses")
// export class Course {
//   @PrimaryGeneratedColumn()
//   id!: number;
//   @Column({ name: "course_name", type: "varchar", length: 255, nullable: false })
//   courseName!: string;
//   @Column({
//     name: "status",
//     type: "enum",
//     enum: ["active", "inactive", "completed"],
//     default: "active",
//     nullable: true,
//   })
//   status!: "active" | "inactive" | "completed";
//   @Column({
//     name: "level",
//     type: "enum",
//     enum: ["Beginner", "Intermediate", "Advanced"],
//     default: "Beginner",
//     nullable: false,
//   })
//   level!: "Beginner" | "Intermediate" | "Advanced";
//   @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
//   createdAt!: Date;
//   @UpdateDateColumn({ name: "updated_at", type: "timestamp", nullable: true })
//   updatedAt!: Date;
//   @DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
//   deletedAt!: Date;
//   @Column({ name: "is_deleted", type: "boolean", default: false })
//   isDeleted!: boolean;
//   @OneToMany(() => Class, (classes) => classes.course)
//   relatedClasses!: Class[];
//   classes: any;
// }
//# sourceMappingURL=courseEntity.js.map