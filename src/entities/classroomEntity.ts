import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Class } from './classEntity';
import { Schedule } from './scheduleEntity';

@Entity('classrooms')
export class Classroom {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'classroom_name', type: 'varchar', length: 100, nullable: false })
  classroomName!: string;

  @Column({
    type: 'enum',
    enum: ['Phòng Nghe Nhìn', 'Phòng Trực Tuyến', 'Phòng Online', 'Phòng cho trẻ'],
    nullable: false,
  })
  type!: 'Phòng Nghe Nhìn' | 'Phòng Trực Tuyến' | 'Phòng Online' | 'Phòng cho trẻ';

  @Column({ type: 'tinyint', width: 1, default: 0, nullable: false })
  status!: number;

  @Column({ type: 'int', nullable: false })
  capacity!: number;

  @OneToMany(() => Class, (classEntity) => classEntity.classroom)
  relatedClasses!: Class[];

  @OneToMany(() => Schedule, (schedules) => schedules.classroom)
  relatedSchedules!: Schedule[];
  class: any;
  classes: any;
  schedules: any;
}
