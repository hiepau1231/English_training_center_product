const scheduleService = require('../services/scheduleService');

class ScheduleController {
    async getAllSchedules(req, res) {
        try {
            const { date } = req.body;
            if (!date) {
                return res.status(400).json({ message: 'date is required' });
              }
            const schedule = await scheduleService.getAllSchedules(date);
            if (!schedule || schedule.length === 0) {
              return res.status(404).json({ message: 'No schedule found' });
            }
            res.status(200).json(schedule);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error retrieving schedules' });
        }
    }
    async findScheduleByid(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: `schedule with ${id} required` });
              }
            const rooms = await scheduleService.findScheduleById(id);
            if (!rooms) {
              return res.status(404).json({ message: 'No schedule found' });
            }
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async updateScheduleById(req, res) {
        try {
            const id = req.params.id;
            const updateData = req.body;
            if (!id) {
                return res.status(400).json({ message: `Schedule with ${id} required` });
              }
            const rooms = await scheduleService.updateScheduleById(id,updateData);
            if (!rooms) {
              return res.status(404).json({ message: 'No Schdeule found' });
            }
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async softDeleteScheduleById(req, res) {
        try {
            const { id } = req.params;
            const result = await scheduleService.softDeleteScheduleById(id);
            if(!result) {
                return res.status(404).json({ message: 'No schedule found'})
            }
            res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async restoreScheduleById(req, res) {
        try {
            const { id } = req.params;
            const result = await scheduleService.restoreScheduleById(id);
            if(!result) {
                return res.status(404).json({ message: 'No schedule found'})
            }
            res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getAllScheduleDeleted(req, res) {
        try {
            const deletedSchedules = await scheduleService.getAllScheduleDeleted();
            return res.status(200).json(deletedSchedules);
        } catch (error) {
            console.error("Error in getAllScheduleDeleted controller:", error);
            return res.status(400).json({ message: error.message });
        }
    }
    async forceDeletedSchedule(req, res) {
        try {
            const id = req.params;
            const forceDeleteSchedules = await scheduleService.forceDeletedSchedule(id);
            if (!forceDeleteSchedules) {
                return res.status(404).json({ message: 'No schedule found'})
            }
            res.status(200).json(forceDeleteSchedules);
        } catch (error) {
            console.error("Error in forceDeletedSchedule controller:", error);
            return res.status(400).json({ message: error.message });
        }
    }
};

module.exports = new ScheduleController;