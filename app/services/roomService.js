const roomRepository = require('../repositories/roomRepository');

class RoomService {
  async getClassrooms(date, classroom_name) {
    try {
      return await roomRepository.getClassrooms(date, classroom_name);
    } catch (error) {
      console.error('Error in RoomService with method getClassrooms:', error);
    }
  }
  async getClassroomName() {
    try {
      return await roomRepository.getClassroomName();
    } catch (error) {
      console.error('Error in RoomService with method getClassroomName:', error);
    }
  }
  async getShifts(date, teaching_shift) {
    try {
      return await roomRepository.getShifts(date, teaching_shift);
    } catch (error) {
      console.error('Error in RoomService with method getShift:', error);
    }
  }
  async findClassroomById(classroom_id, date) {
    try {
      return await roomRepository.findClassroomById(classroom_id, date);
    } catch (error) {
      console.error('Error in RoomService with method findClassroomById:', error);
    }
  }
  async updateClassroomById(id, date, updateData) {
    try {
      return await roomRepository.updateClassroomById(id, date, updateData);
    } catch (error) {
      console.error('Error in RoomService with method updateClassroomById:', error);
    }
  }
  async softDeleteClassroomById(classroom_id, date) {
    try {
      return await roomRepository.softDeleteClassroomById(classroom_id, date);
    } catch (error) {
      console.error('Error in service with method softDeleteClassroomById :', error);
      throw new Error('Failed to soft delete classroom');
    }
  }
  async getAllDeletedClassroom() {
    try {
      return await roomRepository.getAllDeletedClassroom();
    } catch (error) {
      console.error('Error in service with method getAllDeletedClassroom:', error);
      throw new Error('Failed to fetch deleted classroom');
    }
  }
  async restoreClassroomById(classroom_id, date) {
    try {
      return await roomRepository.restoreClassroomById(classroom_id, date);
    } catch (error) {
      console.error('Error in service with method restoreClassroomById:', error);
      throw new Error('Failed to restore classroom');
    }
  }

  async forceDeleteClassroomById(classroom_id, date) {
    try {
      return await roomRepository.forceDeleteClassroomById(classroom_id, date);
    } catch (error) {
      console.error('Error in service with method forceDeleteClassroomById:', error);
      throw new Error('Failed to permanently delete classroom');
    }
  }
}

module.exports = new RoomService();
