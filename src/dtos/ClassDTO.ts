export class ClassDTO {
  id!: number;
  className!: string;
  startDate!: Date | null;
  endDate!: Date | null;
  isDeleted!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;

  // Foreign key fields
  classroomId: number | null = null;
  courseId: number | null = null;

  // Relationship IDs
  assignedTeacherIds: number[] = [];
  linkedScheduleIds: number[] = [];
  shiftIds: number[] = [];

  // Optional: Full related entities (if needed)
  classroom?: any;
  course?: any;
  assignedTeachers?: any[];
  linkedSchedules?: any[];
  shifts?: any[];

  constructor(
    id: number,
    className: string,
    startDate: Date | null,
    endDate: Date | null,
    isDeleted: boolean,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    classroomId: number | null = null,
    courseId: number | null = null,
    assignedTeacherIds: number[] = [],
    linkedScheduleIds: number[] = [],
    shiftIds: number[] = [],
    classroom?: any,
    course?: any,
    assignedTeachers?: any[],
    linkedSchedules?: any[],
    shifts?: any[],
  ) {
    this.id = id;
    this.className = className;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isDeleted = isDeleted;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;

    this.classroomId = classroomId;
    this.courseId = courseId;

    this.assignedTeacherIds = assignedTeacherIds;
    this.linkedScheduleIds = linkedScheduleIds;
    this.shiftIds = shiftIds;

    // Optional: Assign full entities
    this.classroom = classroom;
    this.course = course;
    this.assignedTeachers = assignedTeachers;
    this.linkedSchedules = linkedSchedules;
    this.shifts = shifts;
  }
}
