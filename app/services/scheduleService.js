const scheduleRepository = require('../repositories/scheduleRepository');


class ScheduleService {
    async getSchedules() {
        try {
            return await scheduleRepository.getSchedules();
        } catch (error) {
            console.error("Error in ScheduleService:", error);
        }
    }
    async getAllSchedules(date) {
        try {
            return await scheduleRepository.getAllSchedules(date);
        } catch (error) {
            console.error("Error in ScheduleService:", error);
        }
    }

    async findScheduleById(id) {
        try {
            return await scheduleRepository.findScheduleById(id);
            
        } catch (error) {
            console.error("Error in ScheduleService:", error);
        }
    }
    async updateScheduleById(id,updateData) {
        try {
            return await scheduleRepository.updateScheduleById(id, updateData);
        } catch (error) {
            console.error("Error in ScheduleService:", error);
        }
    }
    async softDeleteScheduleById(id) {
        try {
            return await scheduleRepository.softDeleteScheduleById(id);
        } catch (error) {
            
            console.error("Error in ScheduleService:", error);
        }
    }
    async restoreScheduleById(id) {
        try {
            return await scheduleRepository.restoreScheduleById(id);
         } catch (error) {
            console.error("Error in ScheduleService:", error);
         }
    }
    async getAllScheduleDeleted() {
        try {
            return await scheduleRepository.getAllScheduleDeleted();
         } catch (error) {
            console.error("Error in ScheduleService:", error);
         }
    }
    async forceDeletedSchedule(id) {
        try {
            return await scheduleRepository.forceDeletedSchedule(id);
        } catch (error) {
            console.error("Error in ScheduleService:", error);
        }
    }

}

module.exports = new ScheduleService;