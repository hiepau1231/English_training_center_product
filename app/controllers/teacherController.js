const teacherService = require('../services/teacherService');


class TeacherController {
    async getTeacherSchedules(req, res) {
       try {
        const date = req.body.date;
        if(!date) {
            return res.status(400).json({ message: 'date is required'})
        }
        const teacher = await teacherService.getTeacherSchedules(date);
        if(!teacher || teacher.length === 0) {
           return res.status(404).json({ message: 'No teacher Schedule found'})
        }
        res.status(200).json(teacher)
       } catch (error) {
        res.status(500).json({message: error.message})
       }
    }
    async getTeacherScheduleById(req, res) {
        try {
         const id = req.params.id;
         const teacher = await teacherService.getTeacherScheduleById(id);
         if(!teacher) {
            return res.status(404).json({ message: 'No teacher Schedule found'})
         }
         res.status(200).json(teacher)
        } catch (error) {
         res.status(500).json({message: error.message})
        }
    }
    async updateTeacherScheduleById(req, res) {
        try {
         const id = req.params.id;
         const updateData = req.body;         
         const teacher = await teacherService.updateTeacherScheduleById(id,updateData);
         if(!teacher) {
            return res.status(404).json({ message: 'No teacher Schedule found'})
         }
         res.status(200).json(teacher);
        } catch (error) {
         res.status(500).json({message: error.message})
        }
    }
    async softDeleteTeacherScheduleById(req, res){
        try {
            const id = req.params.id;
            const teacher = await teacherService.softDeleteTeacherScheduleById(id);
            if(!teacher) {
                return res.status(404).json({ message: 'No teacher Schedule found'})
            }
            res.status(200).json(teacher);
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
    async getDeletedTeacherScheduleAll(req, res) {
        try {
            const deletedTeacher = await teacherService.getDeletedTeacherScheduleAll();
            return res.status(200).json(deletedTeacher);
        } catch (error) {
            console.error("Error in getAllDeleted controller:", error);
            return res.status(400).json({ message: error.message });
        }
    }
    async restoreTeacherScheduleById(req, res){
        try {
            const id = req.params.id;
            const teacher = await teacherService.restoreTeacherScheduleById(id);
            if(!teacher) {
                return res.status(404).json({ message: 'No teacher Schedule found'})
            }
            res.status(200).json(teacher);
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
    async forceDeleteTeacherScheduleById(req, res){
        try {
            const id = req.params.id;
            const teacher = await teacherService.forceDeleteTeacherScheduleById(id);
            if(!teacher) {
                return res.status(404).json({ message: 'No teacher Schedule found'})
            }
            res.status(200).json(teacher);
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}

module.exports = new TeacherController;