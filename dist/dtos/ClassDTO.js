"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassDTO = void 0;
class ClassDTO {
    constructor(id, className, startDate, endDate, isDeleted, createdAt, updatedAt, deletedAt, classroomId, courseId, assignedTeacherIds, linkedScheduleIds, shiftIds, 
    // Optional: Full entities
    classroom, course, assignedTeachers, linkedSchedules, shifts) {
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
exports.ClassDTO = ClassDTO;
//# sourceMappingURL=ClassDTO.js.map