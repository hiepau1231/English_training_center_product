import multer from 'multer';
import { Request } from 'express';
import { AppError } from '../utils/AppError';

// Cấu hình multer để lưu file vào memory
const storage = multer.memoryStorage();

// Kiểm tra file type
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel') {
        cb(null, true);
    } else {
        cb(new AppError('Only Excel files are allowed', 400) as any);
    }
};

// Cấu hình upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    }
});

export const uploadExcel = upload.single('file'); 