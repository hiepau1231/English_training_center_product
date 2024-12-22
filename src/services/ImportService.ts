import * as XLSX from 'xlsx';
import { RoomRepository } from '../repositories/RoomRepository';
import { ClassTeacherRepository } from '../repositories/ClassTeacherRepository';
import { TeacherRepository } from '../repositories/TeacherRepository';
import { Room } from '../entities/Room';
import { Teacher } from '../entities/Teacher';
import { ClassTeacher } from '../entities/ClassTeacher';
import { AppDataSource } from '../data-source';

interface ExcelRoom {
    'Room Number': string;
    'Capacity': number;
    'Type': string;
    'Status'?: boolean;
}

interface ExcelTeacher {
    'Name': string;
    'Role': string;
    'Room Number': string;
    'Is Foreign'?: boolean;
    'Is Fulltime'?: boolean;
    'Is Parttime'?: boolean;
    'Email'?: string;
    'Phone'?: string;
}

export class ImportService {
    private roomRepository: RoomRepository;
    private teacherRepository: TeacherRepository;
    private classTeacherRepository: ClassTeacherRepository;

    constructor() {
        this.roomRepository = new RoomRepository();
        this.teacherRepository = new TeacherRepository();
        this.classTeacherRepository = new ClassTeacherRepository();
    }

    async importRoomsFromExcel(file: Buffer): Promise<{ success: Room[], errors: string[] }> {
        try {
            const workbook = XLSX.read(file);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json<ExcelRoom>(worksheet);

            const result = {
                success: [] as Room[],
                errors: [] as string[]
            };

            for (const row of data) {
                try {
                    // Validate dữ liệu
                    if (!this.validateRoomData(row)) {
                        result.errors.push(`Invalid data for room ${row['Room Number']}`);
                        continue;
                    }

                    // Kiểm tra phòng đã tồn tại
                    let room = await this.roomRepository.findByRoomNumber(row['Room Number']);

                    if (room) {
                        // Cập nhật thông tin phòng
                        room.capacity = row['Capacity'];
                        room.type = row['Type'];
                        if (row['Status'] !== undefined) {
                            room.status = row['Status'];
                        }
                    } else {
                        // Tạo phòng mới
                        room = new Room();
                        room.roomNumber = row['Room Number'];
                        room.capacity = row['Capacity'];
                        room.type = row['Type'];
                        room.status = row['Status'] || false;
                    }

                    const savedRoom = await this.roomRepository.save(room);
                    result.success.push(savedRoom);
                } catch (error: any) {
                    const message = error?.message || 'Unknown error';
                    result.errors.push(`Error processing room ${row['Room Number']}: ${message}`);
                }
            }

            return result;
        } catch (error: any) {
            const message = error?.message || 'Unknown error importing rooms from Excel';
            throw new Error(`Error importing rooms from Excel: ${message}`);
        }
    }

    async importTeachersFromExcel(file: Buffer): Promise<{ success: ClassTeacher[], errors: string[] }> {
        try {
            const workbook = XLSX.read(file);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json<ExcelTeacher>(worksheet);

            const result = {
                success: [] as ClassTeacher[],
                errors: [] as string[]
            };

            for (const row of data) {
                try {
                    // Validate dữ liệu
                    if (!this.validateTeacherData(row)) {
                        result.errors.push(`Invalid data for teacher ${row['Name']}`);
                        continue;
                    }

                    // Tìm phòng
                    const room = await this.roomRepository.findByRoomNumber(row['Room Number']);
                    if (!room) {
                        result.errors.push(`Room ${row['Room Number']} not found for teacher ${row['Name']}`);
                        continue;
                    }

                    // Tìm hoặc tạo giáo viên
                    let teacher = await this.teacherRepository.findByName(row['Name']);
                    if (!teacher) {
                        teacher = new Teacher();
                        teacher.teacherName = row['Name'];
                        teacher.isForeign = row['Is Foreign'] || false;
                        teacher.isFulltime = row['Is Fulltime'] || false;
                        teacher.isParttime = row['Is Parttime'] || false;
                        teacher.email = row['Email'] || '';
                        teacher.phoneNumber = row['Phone'] || '';
                        teacher = await this.teacherRepository.save(teacher);
                    }

                    // Tạo liên kết giáo viên-phòng
                    const classTeacher = new ClassTeacher();
                    classTeacher.teacher = teacher;
                    classTeacher.role = row['Role'];
                    
                    const savedClassTeacher = await this.classTeacherRepository.save(classTeacher);
                    result.success.push(savedClassTeacher);
                } catch (error: any) {
                    const message = error?.message || 'Unknown error';
                    result.errors.push(`Error processing teacher ${row['Name']}: ${message}`);
                }
            }

            return result;
        } catch (error: any) {
            const message = error?.message || 'Unknown error importing teachers from Excel';
            throw new Error(`Error importing teachers from Excel: ${message}`);
        }
    }

    private validateRoomData(room: ExcelRoom): boolean {
        if (!room['Room Number'] || room['Room Number'].trim() === '') {
            return false;
        }

        if (!room['Capacity'] || room['Capacity'] <= 0) {
            return false;
        }

        if (!room['Type'] || !['Phòng Nghe Nhìn', 'Phòng Trực Tuyến', 'Phòng Online', 'Phòng cho trẻ'].includes(room['Type'])) {
            return false;
        }

        return true;
    }

    private validateTeacherData(teacher: ExcelTeacher): boolean {
        if (!teacher['Name'] || teacher['Name'].trim() === '') {
            return false;
        }

        if (!teacher['Role'] || !['Giáo Viên Chính', 'Giáo Viên Phụ', 'F.T', 'Trợ Giảng'].includes(teacher['Role'])) {
            return false;
        }

        if (!teacher['Room Number'] || teacher['Room Number'].trim() === '') {
            return false;
        }

        return true;
    }
} 