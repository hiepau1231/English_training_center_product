import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, DeleteDateColumn } from "typeorm";
import { ClassSchedule } from "./ClassSchedule";
import { Class } from "./Class";

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'course_name' })
    courseName!: string;

    @Column({
        type: 'enum',
        enum: ['active', 'inactive', 'completed'],
        default: 'active'
    })
    status!: string;

    @Column({
        type: 'enum', 
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    })
    level!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
    deletedAt!: Date | null;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted!: boolean;

    @OneToMany(() => ClassSchedule, schedule => schedule.course)
    schedules?: ClassSchedule[];

    @OneToMany(() => Class, cls => cls.course)
    classes?: Class[];
}
