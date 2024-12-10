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
  classroom: any;
  course: any;

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
    classroom?: any,
    course?: any,

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

    // Optional: Assign full entities
    this.classroom = classroom;
    this.course = course;
  }
}
