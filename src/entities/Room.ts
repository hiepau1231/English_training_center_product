import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, DeleteDateColumn } from "typeorm";
import { ClassSchedule } from "./ClassSchedule";
import { ClassTeacher } from "./ClassTeacher";
import { Class } from "./Class";

@Entity('classrooms')
export class Room {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'classroom_name' })
    roomNumber!: string;

    @Column()
    capacity!: number;

    @Column({
        type: 'enum',
        enum: ['Phong Nghe Nhin', 'Phong Truc Tuyen', 'Phong Online', 'Phong cho tre'],
        default: 'Phong Truc Tuyen'
    })
    type!: string;

    @Column({ type: 'boolean', default: false })
    status!: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt!: Date | null;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted!: boolean;

    @OneToMany(() => ClassSchedule, schedule => schedule.room)
    schedules!: ClassSchedule[];

    @OneToMany(() => Class, cls => cls.classroom)
    classes!: Class[];
} 