import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    DeleteDateColumn
} from 'typeorm';
import { Room } from './Room';
import { Teacher } from './Teacher';
import { Course } from './Course';
import { Class } from './Class';
import { Shift } from './Shift';

@Entity('class_schedules')
export class ClassSchedule {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'class_id' })
    classId!: number;

    @Column({ name: 'schedule_date', type: 'date' })
    scheduleDate!: Date;

    @Column({ name: 'shift_id' })
    shiftId!: number;

    @Column({ name: 'course_id' })
    courseId!: number;

    @Column({ name: 'room_id' })
    roomId!: number;

    @Column({ name: 'teacher_id' })
    teacherId!: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
    deletedAt: Date | null = null;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted: boolean = false;

    @ManyToOne(() => Course, { nullable: false })
    @JoinColumn({ name: 'course_id' })
    course!: Course;

    @ManyToOne(() => Room, { nullable: false })
    @JoinColumn({ name: 'room_id' })
    room!: Room;

    @ManyToOne(() => Teacher, { nullable: false })
    @JoinColumn({ name: 'teacher_id' })
    teacher!: Teacher;

    @ManyToOne(() => Class, { nullable: false })
    @JoinColumn({ name: 'class_id' })
    class!: Class;

    @ManyToOne(() => Shift, { nullable: false })
    @JoinColumn({ name: 'shift_id' })
    shift!: Shift;

    constructor(partial?: Partial<ClassSchedule>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
} 