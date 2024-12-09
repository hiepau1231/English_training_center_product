import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Level } from './levelEntity';
import { Teacher } from './teacherEntity';

@Entity('teacher_level')
export class TeacherLevel {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Level, (level) => level.teacherLevels, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  associatedLevel!: Level;

  @ManyToOne(() => Teacher, (teacher) => teacher.teacherLevels, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  associatedTeacher!: Teacher | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ type: 'boolean', name: 'is_deleted', default: false })
  isDeleted!: boolean;
}
