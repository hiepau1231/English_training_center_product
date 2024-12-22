import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Teacher } from "./Teacher";

@Entity('teacher_levels')
export class TeacherLevel {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'level_name' })
    levelName!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @OneToMany(() => Teacher, teacher => teacher.level)
    teachers!: Teacher[];
} 