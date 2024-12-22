import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany
} from 'typeorm';
import { ClassSchedule } from './ClassSchedule';

@Entity('shifts')
export class Shift {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'teaching_shift', type: 'varchar', length: 100, nullable: true })
    teachingShift!: string;

    @Column({ name: 'start_time', type: 'time' })
    startTime!: string;

    @Column({ name: 'end_time', type: 'time' })
    endTime!: string;

    @Column({ name: 'class_id', nullable: true })
    classId!: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
    deletedAt!: Date | null;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted!: boolean;

    @OneToMany(() => ClassSchedule, schedule => schedule.shift)
    schedules?: ClassSchedule[];
} 