import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ClassSchedule } from "./ClassSchedule";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    roomNumber!: string;

    @Column()
    capacity!: number;

    @Column({
        type: 'enum',
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available'
    })
    status!: 'available' | 'occupied' | 'maintenance';

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => ClassSchedule, schedule => schedule.room)
    schedules!: ClassSchedule[];
} 