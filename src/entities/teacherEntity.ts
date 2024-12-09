import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Class } from './classEntity';
import { Level } from './levelEntity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'teacher_name', type: 'varchar', length: 50, nullable: false })
  teacherName!: string;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: true })
  email!: string;

  @Column({ name: 'is_foreign', type: 'tinyint', width: 1, default: 0 })
  isForeign!: boolean;

  @Column({ name: 'is_Fulltime', type: 'tinyint', width: 1, default: 0 })
  isFullTime!: boolean;

  @Column({ name: 'is_Parttime', type: 'tinyint', width: 1, default: 0 })
  isPartTime!: boolean;

  @Column({ name: 'phone_number', type: 'varchar', length: 15, nullable: true })
  phoneNumber!: string;

  @Column({ name: 'working_type_id', type: 'int', nullable: true })
  workingTypeId!: number;

  @Column({ name: 'courses_level_id', type: 'int', nullable: true })
  coursesLevelId!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  @ManyToMany(() => Class, (classEntity) => classEntity.teachers)
  @JoinTable({
    name: 'class_teachers',
    joinColumn: { name: 'teacher_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'class_id', referencedColumnName: 'id' },
  })
  classes!: Class[];

  @ManyToMany(() => Level, (level) => level.teachers)
  @JoinTable({
    name: 'teacher_level',
    joinColumn: { name: 'teacher_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'level_id', referencedColumnName: 'id' },
  })
  levels!: Level[];
  classTeachers: any;
  teacherLevels: any;
}
