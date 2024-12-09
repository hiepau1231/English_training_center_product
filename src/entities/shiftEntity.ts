import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Class } from './classEntity';
import { Schedule } from './scheduleEntity';

@Entity('shifts') // Tên bảng giữ nguyên
export class Shift {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'teaching_shift', type: 'varchar', length: 100, nullable: true })
  teachingShift!: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date;

  @Column({ name: 'is_deleted', type: 'boolean', default: false, nullable: false })
  isDeleted!: boolean;

  @ManyToMany(() => Schedule, (schedule) => schedule.shifts)
  @JoinTable({
    name: 'schedule_shift',
    joinColumn: { name: 'shift_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'schedule_id', referencedColumnName: 'id' },
  })
  relatedSchedules!: Schedule[];

  @ManyToOne(() => Class, (classEntity) => classEntity.shifts, { nullable: false })
  associatedClass!: Class;
  class: any;
  schedules: any;
  shifts: any;
}
