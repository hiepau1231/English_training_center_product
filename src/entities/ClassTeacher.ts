import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn
} from 'typeorm';
import { Teacher } from './Teacher';
import { Class } from './Class';

@Entity('class_teachers')
export class ClassTeacher {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'class_id' })
    classId!: number;

    @Column({ name: 'teacher_id' })
    teacherId!: number;

    @Column({
        type: 'enum',
        enum: ['Giáo Viên Chính', 'Giáo Viên Phụ', 'F.T', 'Trợ Giảng'],
        nullable: true
    })
    role!: string;

    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
    deletedAt!: Date | null;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted!: boolean;

    @ManyToOne(() => Teacher, (teacher: Teacher) => teacher.classTeachers)
    @JoinColumn({ name: 'teacher_id' })
    teacher!: Teacher;

    @ManyToOne(() => Class, cls => cls.classTeachers)
    @JoinColumn({ name: 'class_id' })
    class!: Class;
} 