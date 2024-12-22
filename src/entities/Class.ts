import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Course } from "./Course";
import { Room } from "./Room";
import { ClassTeacher } from "./ClassTeacher";
import { ClassSchedule } from "./ClassSchedule";

@Entity('classes')
export class Class {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'class_name' })
    className!: string;

    @Column({ name: 'course_id', nullable: true })
    courseId!: number;

    @Column({ name: 'classroom_id', nullable: true })
    classroomId!: number;

    @Column({ name: 'start_date', type: 'date', nullable: true })
    startDate!: Date;

    @Column({ name: 'end_date', type: 'date', nullable: true })
    endDate!: Date;

    @Column({ name: 'student_count', type: 'int', default: 0 })
    numberOfStudents!: number;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted!: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt!: Date | null;

    @ManyToOne(() => Course, course => course.classes)
    @JoinColumn({ name: 'course_id' })
    course!: Course;

    @ManyToOne(() => Room, room => room.classes)
    @JoinColumn({ name: 'classroom_id' })
    classroom!: Room;

    @OneToMany(() => ClassTeacher, classTeacher => classTeacher.class)
    classTeachers!: ClassTeacher[];

    @OneToMany(() => ClassSchedule, schedule => schedule.class)
    schedules!: ClassSchedule[];
} 