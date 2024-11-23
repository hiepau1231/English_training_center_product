const teacherRepository = require('../repositories/teacherRepository');

class TeacherService {
  async uploadSchedule(file) {
    return await teacherRepository.uploadSchedule(file);
  }
  async getTeachers(teacher_name) {
    try {
      return await teacherRepository.getTeachers(teacher_name);
    } catch (error) {
      console.error('Error in TeacherScheduleService:', error);
    }
  }

  async getTeacherSchedules(date) {
    try {
      return await teacherRepository.getTeacherSchedules(date);
    } catch (error) {
      console.error('Error in TeacherScheduleService:', error);
    }
  }
  async getTeacherScheduleById(class_id, date) {
    try {
      return await teacherRepository.getTeacherScheduleById(class_id, date);
    } catch (error) {
      console.error('Error in TeacherScheduleService:', error);
    }
  }
  async updateTeacherScheduleById(class_id, date, updateData) {
    try {
      return await teacherRepository.updateTeacherScheduleById(
        class_id,
        date,
        updateData
      );
    } catch (error) {
      console.error('Error in TeacherScheduleService:', error);
    }
  }
  async softDeleteTeacherScheduleById(class_id, date) {
    try {
      return await teacherRepository.softDeleteTeacherScheduleById(
        class_id,
        date
      );
    } catch (error) {
      console.error('Error in TeacherScheduleService:', error);
    }
  }
  async getDeletedTeacherScheduleAll() {

    try {
      return await teacherRepository.getDeletedTeacherScheduleAll();
    } catch (error) {
      console.error('Error in TeacherScheduleService:', error);
    }
  }
  async restoreTeacherScheduleById(class_id, date) {
    try {
      return await teacherRepository.restoreTeacherScheduleById(class_id, date);
    } catch (error) {
      console.error('Error in TeacherScheduleService:', error);
    }
  }
  async forceDeleteTeacherScheduleById(class_id, date) {
    try {
      return await teacherRepository.forceDeleteTeacherScheduleById(class_id, date);
    } catch (error) {
      console.error('Error in TeacherScheduleService:', error);
    }
  }
}

module.exports = new TeacherService();
