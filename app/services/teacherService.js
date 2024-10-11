const tearcherRepository = require('../repositories/teacherRepository');

class TeacherService {
    async getTeacherSchedules(date) {
        try {
            return await tearcherRepository.getTeacherSchedules(date);
        } catch (error) {
            console.error("Error in TeacherScheduleService:", error);
        }
    }
    async getTeacherScheduleById(id) {
        try {
            return await tearcherRepository.getTeacherScheduleById(id);
        } catch (error) {
            console.error("Error in TeacherScheduleService:", error);
        }
    }
    async updateTeacherScheduleById(id, updateData) {
        try {
            return await tearcherRepository.updateTeacherScheduleById(id, updateData);
        } catch (error) {
            console.error("Error in TeacherScheduleService:", error);
        }
    }
    async softDeleteTeacherScheduleById(id) {
        try {
            return await tearcherRepository.softDeleteTeacherScheduleById(id);
        } catch (error) {
            console.error("Error in TeacherScheduleService:", error);
        }
    }
    async getDeletedTeacherScheduleAll() {
        try {
            return await tearcherRepository.getDeletedTeacherScheduleAll();
        } catch (error) {
            console.error("Error in TeacherScheduleService:", error);
        }
    }
    async restoreTeacherScheduleById(id) {
        try {
            return await tearcherRepository.restoreTeacherScheduleById(id);
        } catch (error) {
            console.error("Error in TeacherScheduleService:", error);
        }
    }
    async forceDeleteTeacherScheduleById(id) {
        try {
            return await tearcherRepository.forceDeleteTeacherScheduleById(id);
        } catch (error) {
            console.error("Error in TeacherScheduleService:", error);
        }
    }
}

module.exports = new TeacherService();
