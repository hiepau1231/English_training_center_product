import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Class } from './classEntity';
import { Teacher } from './teacherEntity';

@Entity('class_teachers')
export class ClassTeacher {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Class, (classEntity) => classEntity.classTeachers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  associatedClass!: Class;

  @ManyToOne(() => Teacher, (teacherEntity) => teacherEntity.classTeachers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  associatedTeacher!: Teacher;

  @Column({
    type: 'enum',
    enum: ['Giáo Viên Chính', 'Giáo Viên Phụ', 'F.T', 'Trợ Giảng'],
    nullable: true,
  })
  role!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted!: boolean;
}
