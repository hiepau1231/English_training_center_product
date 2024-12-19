import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { TeacherLevel } from "./TeacherLevel";
import { ClassSchedule } from "./ClassSchedule";

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    levelId!: number;

    @Column({
        type: 'enum',
        enum: ['active', 'inactive', 'busy'],
        default: 'active'
    })
    status!: 'active' | 'inactive' | 'busy';

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => TeacherLevel, level => level.teachers)
    level!: TeacherLevel;

    @OneToMany(() => ClassSchedule, schedule => schedule.teacher)
    schedules!: ClassSchedule[];
} 