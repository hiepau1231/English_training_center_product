import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Teacher } from "./Teacher";
import { Room } from "./Room";
import { Course } from "./Course";

@Entity()
export class ClassSchedule {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    courseId!: number;

    @Column()
    teacherId!: number;

    @Column()
    roomId!: number;

    @Column({ type: 'date' })
    date!: Date;

    @Column({ type: 'time' })
    startTime!: string;

    @Column({ type: 'time' })
    endTime!: string;

    @Column({
        type: 'enum',
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    })
    status!: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => Course, course => course.schedules)
    course!: Course;

    @ManyToOne(() => Teacher, teacher => teacher.schedules)
    teacher!: Teacher;

    @ManyToOne(() => Room, room => room.schedules)
    room!: Room;
} 