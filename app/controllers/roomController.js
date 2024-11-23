const roomService = require('../services/roomService');

class RoomController {
  async getClassrooms(req, res) {
    const date = req.body.date;
    const classroom_name = req.body.classroom_name;
    try {
      const result = await roomService.getClassrooms(date || null, classroom_name || null);
      if (!result[0] === 0) {
        return res.status(404).json({ message: 'can not get classrooms' });
      }
      res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  async getClassroomName(req, res) {
    try {
      const rooms = await roomService.getClassroomName();
      if (!rooms) {
        return res.status(404).json({ message: 'No rooms found' });
      }
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getShifts(req, res) {
    try {
      const date = req.params.date;
      const teaching_shift = req.params.teaching_shift;
      const shifts = await roomService.getShifts(date, teaching_shift);
      if (!shifts) {
        return res.status(404).json({message: 'No shifts found'})
      }
      return res.status(200).json(shifts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async findClassroomById(req, res) {
    try {
      const classroom_id = req.params.id;
      const date = req.params.date;
      console.log(classroom_id);
      console.log(date);

      if (!classroom_id) {
        return res.status(400).json({ message: `id is required` });
      }
      const rooms = await roomService.findClassroomById(classroom_id, date);
      if (!rooms) {
        return res.status(404).json({ message: 'No rooms found' });
      }
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async updateClassroomById(req, res) {
    try {
      const id = req.params.id;
      const date = req.params.date;
      const updateData = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ message: `classroom_name with ${id} required` });
      }
      const rooms = await roomService.updateClassroomById(id, date, updateData);
      if (!rooms) {
        return res.status(404).json({ message: 'No rooms found' });
      }
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async softDeleteClassroomById(req, res) {
    try {
      const classroom_id = req.params.id;
      const date = req.params.date;
      const result = await roomService.softDeleteClassroomById(classroom_id, date);
      if (result[0] === 0) {
        return res
          .status(404)
          .json({ message: 'Classroom not found or already deleted' });
      }
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in ClassController:', error);
      return res.status(500).json({ message: error.message });
    }
  }
  async getAllDeletedClassroom(req, res) {
    try {
      const deletedClasses = await roomService.getAllDeletedClassroom();
      return res.status(200).json(deletedClasses);
    } catch (error) {
      console.error('Error in getAllDeletedClassroom controller:', error);
      return res.status(404).json({ message: 'Room not found' });
    }
  }

  async restoreClassroomById(req, res) {
    try {
      const classroom_id = req.params.id;
      const date = req.params.date;
      if (!classroom_id || isNaN(classroom_id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      const result = await roomService.restoreClassroomById(classroom_id, date);
      if (result[0] === 0) {
        return res
          .status(404)
          .json({ message: 'Class not found or already active' });
      }
      return res
        .status(200)
        .json({ message: 'Class restored successfully', result });
    } catch (error) {
      console.error('Error in restoreClassroomById controller:', error);
      return res.status(500).json({ message: error.message });
    }
  }

  async forceDeleteClassroomById(req, res) {
    try {
      const  classroom_id  = req.params.id;
      const date = req.params.date
      if (!classroom_id || isNaN(classroom_id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      const result = await roomService.forceDeleteClassroomById(classroom_id, date);
      if (result[0] === 0) {
        return res.status(404).json({ message: 'Class not found' });
      }
      return res
        .status(200)
        .json({ message: 'Class permanently deleted successfully', result });
    } catch (error) {
      console.error('Error in forceDelete controller:', error);
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new RoomController();
