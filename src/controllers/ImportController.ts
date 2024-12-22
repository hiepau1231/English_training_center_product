import { Request, Response } from 'express';
import { ImportService } from '../services/ImportService';

// Custom error class
class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class ImportController {
    private importService: ImportService;

    constructor() {
        this.importService = new ImportService();
    }

    // Upload và import danh sách phòng học từ Excel
    async importRooms(req: Request, res: Response) {
        try {
            if (!req.file) {
                throw new AppError('No file uploaded', 400);
            }

            const result = await this.importService.importRoomsFromExcel(req.file.buffer);

            return res.status(200).json({
                message: 'Rooms imported successfully',
                success: result.success,
                errors: result.errors,
                totalSuccess: result.success.length,
                totalErrors: result.errors.length
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Error importing rooms:', error);
                res.status(500).json({
                    message: 'Error importing rooms',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
    }

    // Upload và import danh sách giáo viên từ Excel
    async importTeachers(req: Request, res: Response) {
        try {
            if (!req.file) {
                throw new AppError('No file uploaded', 400);
            }

            const result = await this.importService.importTeachersFromExcel(req.file.buffer);

            return res.status(200).json({
                message: 'Teachers imported successfully',
                success: result.success,
                errors: result.errors,
                totalSuccess: result.success.length,
                totalErrors: result.errors.length
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Error importing teachers:', error);
                res.status(500).json({
                    message: 'Error importing teachers',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
    }

    // Tạo file Excel mẫu cho import phòng học
    async generateRoomTemplate(req: Request, res: Response) {
        try {
            const templatePath = 'sample-data/room-template.xlsx';
            res.download(templatePath, 'room-template.xlsx', (err) => {
                if (err) {
                    throw new AppError('Error downloading template', 500);
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Error generating template:', error);
                res.status(500).json({ message: 'Error generating template' });
            }
        }
    }

    // Tạo file Excel mẫu cho import giáo viên
    async generateTeacherTemplate(req: Request, res: Response) {
        try {
            const templatePath = 'sample-data/teacher-template.xlsx';
            res.download(templatePath, 'teacher-template.xlsx', (err) => {
                if (err) {
                    throw new AppError('Error downloading template', 500);
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Error generating template:', error);
                res.status(500).json({ message: 'Error generating template' });
            }
        }
    }
} 