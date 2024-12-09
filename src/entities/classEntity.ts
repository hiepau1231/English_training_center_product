import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Classroom } from './classroomEntity';
import { Course } from './courseEntity';
import { Schedule } from './scheduleEntity';
import { Shift } from './shiftEntity';
import { Teacher } from './teacherEntity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'class_name', type: 'varchar', length: 100, nullable: false })
  className!: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate!: Date | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate!: Date | null;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @OneToMany(() => Schedule, (schedule) => schedule.class)
  schedules!: Schedule[];

  @ManyToOne(() => Classroom, (classroom) => classroom.classes)
  @JoinColumn({ name: 'classroom_id' })
  classroom!: Classroom;

  @ManyToOne(() => Course, (course) => course.classes)
  @JoinColumn({ name: 'course_id' })
  course!: Course;

  @ManyToMany(() => Teacher, (teacher) => teacher.classes)
  @JoinTable({
    name: 'class_teachers',
    joinColumn: { name: 'class_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'teacher_id', referencedColumnName: 'id' },
  })
  assignedTeachers!: Teacher[];

  @ManyToMany(() => Schedule, (schedule) => schedule.classes)
  @JoinTable({
    name: 'class_schedules',
    joinColumn: { name: 'class_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'schedule_id', referencedColumnName: 'id' },
  })
  linkedSchedules!: Schedule[];

  @OneToMany(() => Shift, (shift) => shift.class)
  shifts!: Shift[];
  classSchedules: any;
  classTeachers: any;
  teachers: any;
}
