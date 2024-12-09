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
import { Schedule } from './scheduleEntity';

@Entity('class_schedules')
export class ClassSchedule {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Class, (classEntity) => classEntity.classSchedules, {
    onDelete: 'CASCADE',
  })
  relatedClass!: Class;

  @ManyToOne(() => Schedule, (scheduleEntity) => scheduleEntity.classSchedules, {
    onDelete: 'CASCADE',
  })
  relatedSchedule!: Schedule;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted!: boolean;
}
