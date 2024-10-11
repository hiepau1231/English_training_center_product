const classRepository = require('../repositories/classRepository');

class ClassService {
  async getClasses() {
    try {
        const classes = await classRepository.getAllClasses();

        return classes.map(classData => {
            const schedules = classData.schedules || [];
            const firstSchedule = schedules.length > 0 ? schedules[0] : null;

            return {
                id: classData.id,
                class_name: classData.class_name,
                start_date: classData.start_date,
                end_date: classData.end_date,
                schedule_day: firstSchedule ? firstSchedule.day : null,
                schedule_attendance: firstSchedule ? firstSchedule.attendance : null,
                classroom_name: classData.Classroom ? classData.Classroom.classroom_name : null,
                classroom_type: classData.Classroom ? classData.Classroom.type : null,
                classroom_capacity: classData.Classroom ? classData.Classroom.capacity : null,
                course_name: classData.Course ? classData.Course.course_name : null,
                course_level: classData.Course ? classData.Course.level : null,
                course_status: classData.Course ? classData.Course.status : null,
                main_teacher_name: classData.MainTeacher ? classData.MainTeacher.teacher_name : null,
                sub_teacher_name: classData.SubTeacher ? classData.SubTeacher.teacher_name : null
            };
        });
    } catch (error) {
        console.error("Error in ClassService:", error);
        throw error;
    }
}

  async getClass(id) {
    try {
        const classData = await classRepository.getClassById(id);

        if (!classData) {
            throw new Error(`Class with ID ${id} not found.`);
        }

        const schedules = classData.schedules || [];
        const firstSchedule = schedules.length > 0 ? schedules[0] : null;

        const formattedData = {
            id: classData.id,
            class_name: classData.class_name,
            start_date: classData.start_date,
            end_date: classData.end_date,
            schedule_day: firstSchedule ? firstSchedule.day : null,
            schedule_attendance: firstSchedule ? firstSchedule.attendance : null,
            classroom_name: classData.Classroom ? classData.Classroom.classroom_name : null,
            classroom_type: classData.Classroom ? classData.Classroom.type : null,
            classroom_capacity: classData.Classroom ? classData.Classroom.capacity : null,
            course_name: classData.Course ? classData.Course.course_name : null,
            course_level: classData.Course ? classData.Course.level : null,
            course_status: classData.Course ? classData.Course.status : null,
            main_teacher_name: classData.MainTeacher ? classData.MainTeacher.teacher_name : null,
            sub_teacher_name: classData.SubTeacher ? classData.SubTeacher.teacher_name : null
        };

        return formattedData;
    } catch (error) {
        console.error("Error in ClassService:", error);
        throw error;
    }
}

  async updateClass(classId,updateData) {

    try {
      return await classRepository.updateClass(classId, updateData);
    } catch (error) {
      console.error("Error in ClassService:", error);
    }
  }

  async softDeleteClass(classId) {
    try {
      return await classRepository.softDeleteClass(classId);
    } catch (error) {
      console.error("Error in ClassService:", error);
      throw error;
    }
  }

  async forceDeleteClass(classId) {
    try {
      return await classRepository.forceDeleteClass(classId);
    } catch (error) {
      console.error("Error in ClassService:", error);
      throw error;
    }
  }

  async restoreClass(classId) {
    try {
      return await classRepository.restoreClass(classId);
    } catch (error) {
      console.error("Error in ClassService:", error);
      throw error;
    }
  }

  async getDeletedClasses() {
    try {
      return await classRepository.getDeletedClasses();
    } catch (error) {
      console.error("Error in ClassService:", error);
      throw error;
    }
  }
}

module.exports = new ClassService();
