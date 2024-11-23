const teacherService = require('../services/teacherService');

class TeacherController {
  async getTeachers(req, res) {
    const teacher_name = req.body.teacher_name;
    try {
      const teacher = await teacherService.getTeachers(teacher_name);
      if (!teacher || teacher.length === 0) {
        return res.status(404).json({ message: 'No teacher Schedule found' });
      }
      res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getTeacherSchedules(req, res) {
    try {
      const date = req.body.date;
      if (!date) {
        return res.status(400).json({ message: 'date is required' });
      }
      const teacher = await teacherService.getTeacherSchedules(date);
      if (!teacher || teacher.length === 0) {
        return res.status(404).json({ message: 'No teacher Schedule found' });
      }
      res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getTeacherScheduleById(req, res) {
    try {
      const date = req.params.date;
      const class_id = req.params.class_id;
      const teacher = await teacherService.getTeacherScheduleById(
        class_id,
        date
      );
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher Schedule found' });
      }
      res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async updateTeacherScheduleById(req, res) {
    try {
      const id = req.params.class_id;
      const date = req.params.date;
      const updateData = req.body;

      const teacher = await teacherService.updateTeacherScheduleById(
        id,
        date,
        updateData
      );
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher Schedule found' });
      }
      res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async softDeleteTeacherScheduleById(req, res) {

    try {
      const id = req.params.id;
      const date = req.params.date;
      const teacher = await teacherService.softDeleteTeacherScheduleById(id, date);
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher Schedule found' });
      }
      res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getDeletedTeacherScheduleAll(req, res) {
    try {
      const deletedTeacher =
        await teacherService.getDeletedTeacherScheduleAll();
      return res.status(200).json(deletedTeacher);
    } catch (error) {
      console.error('Error in getAllDeleted controller:', error);
      return res.status(400).json({ message: error.message });
    }
  }
  async restoreTeacherScheduleById(req, res) {
    try {
      const class_id = req.params.id;
      const date = req.params.date;
      const teacher = await teacherService.restoreTeacherScheduleById(class_id, date);
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher Schedule found' });
      }
      res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async forceDeleteTeacherScheduleById(req, res) {
    try {
      const class_id = req.params.id;
      const date = req.params.date
      const teacher = await teacherService.forceDeleteTeacherScheduleById(class_id, date);
      if (!teacher) {
        return res.status(404).json({ message: 'No teacher Schedule found' });
      }
      res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new TeacherController();
