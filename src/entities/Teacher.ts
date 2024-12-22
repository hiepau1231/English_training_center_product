import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, DeleteDateColumn } from "typeorm";
import { TeacherLevel } from "./TeacherLevel";
import { ClassSchedule } from "./ClassSchedule";
import { ClassTeacher } from "./ClassTeacher";

@Entity('teachers')
export class Teacher {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'teacher_name' })
    teacherName!: string;

    @Column({ nullable: true })
    email!: string;

    @Column({ name: 'experience', type: 'varchar', nullable: true })
    experience!: string;

    @Column({ name: 'is_foreign', type: 'boolean', default: false })
    isForeign!: boolean;

    @Column({ name: 'is_Fulltime', type: 'boolean', default: false })
    isFulltime!: boolean;

    @Column({ name: 'is_Parttime', type: 'boolean', default: false })
    isParttime!: boolean;

    @Column({ name: 'phone_number', nullable: true })
    phoneNumber!: string;

    @Column({ name: 'working_type_id', nullable: true })
    workingTypeId!: number;

    @Column({ name: 'courses_level_id', nullable: true })
    coursesLevelId!: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt!: Date | null;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted!: boolean;

    @ManyToOne(() => TeacherLevel)
    @JoinColumn({ name: 'courses_level_id' })
    level!: TeacherLevel;

    @OneToMany(() => ClassSchedule, schedule => schedule.teacher)
    schedules!: ClassSchedule[];

    @OneToMany(() => ClassTeacher, classTeacher => classTeacher.teacher)
    classTeachers!: ClassTeacher[];
} 