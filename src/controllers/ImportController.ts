import { Request, Response } from 'express';
import xlsx from 'xlsx';
import { ClassSchedule } from '../entities/ClassSchedule';
import { Room } from '../entities/Room';
import { AppDataSource } from '../data-source';

interface CustomRequest extends Request {
  fileValidationError?: Error;
}

export const importClassSchedules = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Verify file size and type were validated by middleware
    if (req.fileValidationError) {
      return res.status(400).json({ 
        message: req.fileValidationError.message 
      });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    interface ClassScheduleRow {
      'Thời gian': string;
      'Tên khóa học': string;
      'Tên lớp': string;
      'CM chính': string;
      'Học viên trong lớp': number;
      'Ngày bắt đầu': number;
      'Ngày kết thúc': number;
      'Phòng học': string;
    }

    const data = xlsx.utils.sheet_to_json<ClassScheduleRow>(worksheet);

    const classScheduleRepository = AppDataSource.getRepository(ClassSchedule);

    for (const row of data) {
      const classSchedule = new ClassSchedule();
      classSchedule.time = row['Thời gian'];
      classSchedule.courseName = row['Tên khóa học'];
      classSchedule.className = row['Tên lớp'];
      classSchedule.mainTeacher = row['CM chính'];
      classSchedule.numberOfStudents = row['Học viên trong lớp'];
      classSchedule.startDate = new Date(row['Ngày bắt đầu']);
      classSchedule.endDate = new Date(row['Ngày kết thúc']);
      // Find or create room
      const roomName = row['Phòng học'];
      const roomRepository = AppDataSource.getRepository(Room);
      let room = await roomRepository.findOne({ where: { roomNumber: roomName } });
      
      if (!room) {
        room = new Room();
        room.roomNumber = roomName;
        room.capacity = 30; // Default capacity
        room.type = 'Phong Truc Tuyen'; // Default type
        room = await roomRepository.save(room);
      }
      classSchedule.roomId = room.id;
      
      await classScheduleRepository.save(classSchedule);
    }

    res.status(200).json({ 
      message: 'Class schedules imported successfully',
      imported: data.length
    });
  } catch (error) {
    console.error('Error importing class schedules:', error);
    res.status(500).json({ message: 'Error importing class schedules' });
  }
};

export const getRoomTemplate = async (req: Request, res: Response) => {
  try {
    // Tạo workbook mới
    const workbook = xlsx.utils.book_new();
    
    // Tạo worksheet với các cột cần thiết
    const worksheetData = [
      ['Tên phòng', 'Sức chứa', 'Loại phòng', 'Ghi chú']
    ];
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
    
    // Thêm worksheet vào workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Phòng học');
    
    // Tạo buffer từ workbook
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    // Thiết lập header và gửi file về client
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=room_template.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating room template:', error);
    res.status(500).json({ message: 'Error generating room template' });
  }
};
