import { Router } from 'express';
import { RoomController } from '../controllers/RoomController';
import { uploadFile } from '../middleware/uploadFile';
import { catchAsync } from '../utils/AppError';

const router = Router();
const roomController = new RoomController();

// Upload danh sách phòng từ Excel
router.post('/upload', 
    uploadFile.single('file'),
    catchAsync(roomController.uploadRooms.bind(roomController))
);

// Lấy danh sách tất cả phòng
router.get('/', 
    catchAsync(roomController.getAllRooms.bind(roomController))
);

// Tìm kiếm phòng
router.get('/search', 
    catchAsync(roomController.searchRooms.bind(roomController))
);

// Lấy thông tin chi tiết phòng
router.get('/:id', 
    catchAsync(roomController.getRoomDetails.bind(roomController))
);

// Kiểm tra tình trạng phòng
router.get('/:id/availability', 
    catchAsync(roomController.checkRoomAvailability.bind(roomController))
);

// Lấy lịch sử sử dụng phòng
router.get('/:id/history', 
    catchAsync(roomController.getRoomHistory.bind(roomController))
);

// Cập nhật thông tin phòng
router.put('/:id', 
    catchAsync(roomController.updateRoom.bind(roomController))
);

// Xóa phòng
router.delete('/:id', 
    catchAsync(roomController.deleteRoom.bind(roomController))
);

// Test endpoint to insert test schedules
router.post('/test/schedules', 
    catchAsync(roomController.insertTestSchedules.bind(roomController))
);

export default router; 