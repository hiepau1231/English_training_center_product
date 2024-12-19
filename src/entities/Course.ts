import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ClassSchedule } from "./ClassSchedule";

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    levelId!: number;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => ClassSchedule, schedule => schedule.course)
    schedules!: ClassSchedule[];
} 