const roomService = require('../services/roomService');

class RoomController {
    async getAllRooms(req, res) {
        try {
            const { classroomName, scheduleDate } = req.body;
            if (!classroomName || !scheduleDate) {
                return res.status(400).json({ message: 'classroom_name and schedule_date are required' });
              }
            const rooms = await roomService.getAllRooms(classroomName, scheduleDate);
            if (!rooms) {
              return res.status(404).json({ message: 'No rooms found' });
            }
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
        async findRoomById(req, res) {
        try {
            const id  = req.params.id;
            
            if (!id) {
                return res.status(400).json({ message: `id is required` });
              }
            const rooms = await roomService.findRoomById(id);
            if (!rooms) {
              return res.status(404).json({ message: 'No rooms found' });
            }
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async updateRoomById(req, res) {
        try {
            const id  = req.params.id;
            const updateData = req.body
            
            if (!id) {
                return res.status(400).json({ message: `classroom_name with ${id} required` });
              }
            const rooms = await roomService.updateRoomById(id,updateData);
            if (!rooms) {
              return res.status(404).json({ message: 'No rooms found' });
            }
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async softDeleteRoomById(req, res) {
      try {
          const id = req.params.id;
          const result = await roomService.softDeleteRoomById(id);
          if (result[0] === 0) {
            return res.status(404).json({ message: 'Classroom not found or already deleted' });
        }
        res.status(200).json(result);
      } catch (error) {
          console.error("Error in ClassController:", error);
          return res.status(500).json({ message: error.message });
      }
  }
  async getAllDeleted(req, res) {
    try {
        const deletedClasses = await roomService.getAllDeleted();
        return res.status(200).json(deletedClasses);
    } catch (error) {
        console.error("Error in getAllDeleted controller:", error);
        return res.status(404).json({ message: 'Room not found' });
    }
}

async restoreRoomById(req, res) {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const result = await roomService.restoreRoomById(id);
        if (result[0] === 0) {
            return res.status(404).json({ message: 'Class not found or already active' });
        }
        return res.status(200).json({ message: 'Class restored successfully', result });
    } catch (error) {
        console.error("Error in restoreRoomById controller:", error);
        return res.status(500).json({ message: error.message });
    }
}

async forceDeleteRoomById(req, res) {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const result = await roomService.forceDeleteRoomById(id);
        if (result[0] === 0) {
            return res.status(404).json({ message: 'Class not found' });
        }
        return res.status(200).json({ message: 'Class permanently deleted successfully', result });
    } catch (error) {
        console.error("Error in forceDelete controller:", error);
        return res.status(500).json({ message: error.message });
    }
}

};

module.exports = new RoomController;