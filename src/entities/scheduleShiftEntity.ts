import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Schedule } from './scheduleEntity';
import { Shift } from './shiftEntity';

@Entity('schedule_shifts')
export class ScheduleShift {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.shifts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  associatedSchedule!: Schedule;

  @ManyToOne(() => Shift, (shift) => shift.shifts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  associatedShift!: Shift;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;
}
