const roomRepository = require('../repositories/roomRepository');


class RoomService {
    async getAllRooms(classroomName, scheduleDate) {
        try {
            return await roomRepository.getAllRooms(classroomName, scheduleDate);
        } catch (error) {
            console.error("Error in RoomService:", error);
        }
    }
    async findRoomById(id) {
        try {
            return await roomRepository.findRoomById(id);
        } catch (error) {
            console.error("Error in RoomService:", error);
        }
    }
    async updateRoomById(id, updateData) {
        try {
            return await roomRepository.updateRoomById(id, updateData);
        } catch (error) {
            console.error("Error in RoomService:", error);
        }
    }
    async softDeleteRoomById(id) {
        try {
            return await roomRepository.softDeleteRoomById(id);
        } catch (error) {
            console.error("Error in softDeleteRoomById service:", error);
            throw new Error('Failed to soft delete class');
        }
    }
    async getAllDeleted() {
        try {
            return await roomRepository.getAllDeleted();
        } catch (error) {
            console.error("Error in getAllDeleted service:", error);
            throw new Error('Failed to fetch deleted classes');
        }
    }
    async restoreRoomById(id) {
        try {
            return await roomRepository.restoreRoomById(id);
        } catch (error) {
            console.error("Error in restoreRoomById service:", error);
            throw new Error('Failed to restore class');
        }
    }
    
    async forceDeleteRoomById(id) {
        try {
            return await roomRepository.forceDeleteRoomById(id);
        } catch (error) {
            console.error("Error in forceDeleteRoomById service:", error);
            throw new Error('Failed to permanently delete class');
        }
    }
};

module.exports = new RoomService;