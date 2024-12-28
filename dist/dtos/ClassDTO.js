"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassDTO = void 0;
class ClassDTO {
    constructor(id, className, startDate, endDate, isDeleted, createdAt, updatedAt, deletedAt, classroomId = null, courseId = null, classroom, course) {
        // Foreign key fields
        this.classroomId = null;
        this.courseId = null;
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
exports.ClassDTO = ClassDTO;
