import { AppDataSource } from '../data-source';
import { Class, ClassSchedule, Shift } from '../entities';
import { Between, IsNull } from 'typeorm';

async function createSchedules() {
    try {
        // Khởi tạo kết nối database
        await AppDataSource.initialize();

        // Lấy tất cả các lớp học
        const classes = await AppDataSource.getRepository(Class).find({
            relations: ['course', 'classroom', 'classTeachers'],
            where: {
                startDate: Between(new Date('2024-01-01'), new Date('2024-12-31')),
                endDate: Between(new Date('2024-01-01'), new Date('2024-12-31')),
                deletedAt: IsNull()
            }
        });

        // Lấy tất cả các ca học
        const shifts = await AppDataSource.getRepository(Shift).find({
            where: {
                deletedAt: IsNull()
            }
        });

        console.log(`Tìm thấy ${classes.length} lớp học cần tạo lịch.`);
        console.log(`Tìm thấy ${shifts.length} ca học khả dụng.`);

        // Tạo lịch học cho từng lớp
        for (const cls of classes) {
            if (!cls.startDate || !cls.endDate) {
                console.log(`Lớp ${cls.className} không có ngày bắt đầu hoặc kết thúc.`);
                continue;
            }

            if (!cls.classroom) {
                console.log(`Lớp ${cls.className} không có phòng học.`);
                continue;
            }

            // Kiểm tra xem lớp đã có lịch học chưa
            const existingClassSchedules = await AppDataSource.getRepository(ClassSchedule).find({
                where: {
                    classId: cls.id,
                    deletedAt: IsNull()
                }
            });

            if (existingClassSchedules.length > 0) {
                console.log(`Lớp ${cls.className} đã có ${existingClassSchedules.length} lịch học.`);
                continue;
            }

            // Kiểm tra xem có lịch học nào trong cùng phòng trong khoảng thời gian này không
            const existingSchedules = await AppDataSource.getRepository(ClassSchedule).find({
                where: {
                    roomId: cls.classroom.id,
                    scheduleDate: Between(cls.startDate, cls.endDate),
                    deletedAt: IsNull()
                }
            });

            // Tạo map để lưu các ca học đã được sử dụng cho mỗi ngày
            const usedTimeSlots = new Map<string, number[]>();
            existingSchedules.forEach(schedule => {
                if (schedule.scheduleDate) {
                    const dateKey = schedule.scheduleDate.toISOString().split('T')[0];
                    if (!usedTimeSlots.has(dateKey)) {
                        usedTimeSlots.set(dateKey, []);
                    }
                    if (schedule.shiftId) {
                        usedTimeSlots.get(dateKey)?.push(schedule.shiftId);
                    }
                }
            });

            // Tạo lịch học cho từng tuần trong khoảng thời gian của lớp
            const schedules: ClassSchedule[] = [];
            let currentDate = new Date(cls.startDate);
            const totalWeeks = Math.ceil((cls.endDate.getTime() - cls.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
            const requiredSchedules = totalWeeks * 2; // Mỗi tuần 2 buổi

            console.log(`Lớp ${cls.className} cần tạo ${requiredSchedules} lịch học trong ${totalWeeks} tuần.`);

            while (currentDate <= cls.endDate && schedules.length < requiredSchedules) {
                // Lọc ra các ca học còn trống cho ngày hiện tại
                const dateKey = currentDate.toISOString().split('T')[0];
                const usedShifts = usedTimeSlots.get(dateKey) || [];
                const availableShifts = shifts.filter(shift => !usedShifts.includes(shift.id));

                if (availableShifts.length > 0) {
                    // Chọn ca học từ các ca còn trống
                    const selectedShift = availableShifts[0];

                    const schedule = new ClassSchedule();
                    schedule.scheduleDate = new Date(currentDate);
                    schedule.classId = cls.id;
                    schedule.shiftId = selectedShift.id;
                    schedule.courseId = cls.course?.id || 0;
                    schedule.roomId = cls.classroom.id;
                    if (cls.classTeachers && cls.classTeachers.length > 0) {
                        schedule.teacherId = cls.classTeachers[0].teacherId;
                    }
                    schedules.push(schedule);

                    // Cập nhật map các ca học đã sử dụng
                    if (!usedTimeSlots.has(dateKey)) {
                        usedTimeSlots.set(dateKey, []);
                    }
                    usedTimeSlots.get(dateKey)?.push(selectedShift.id);

                    // Nếu còn cần thêm lịch học và còn ca trống, tạo thêm một lịch học nữa
                    if (schedules.length < requiredSchedules && availableShifts.length > 1) {
                        const secondShift = availableShifts[1];
                        const secondSchedule = new ClassSchedule();
                        secondSchedule.scheduleDate = new Date(currentDate);
                        secondSchedule.classId = cls.id;
                        secondSchedule.shiftId = secondShift.id;
                        secondSchedule.courseId = cls.course?.id || 0;
                        secondSchedule.roomId = cls.classroom.id;
                        if (cls.classTeachers && cls.classTeachers.length > 0) {
                            secondSchedule.teacherId = cls.classTeachers[0].teacherId;
                        }
                        schedules.push(secondSchedule);
                        usedTimeSlots.get(dateKey)?.push(secondShift.id);
                    }
                }
                
                // Tăng ngày lên 7 ngày (1 tuần)
                currentDate.setDate(currentDate.getDate() + 7);
            }

            // Lưu tất cả lịch học
            if (schedules.length > 0) {
                await AppDataSource.getRepository(ClassSchedule).save(schedules);
                console.log(`Đã tạo ${schedules.length} lịch học cho lớp ${cls.className}`);
            } else {
                console.log(`Không thể tạo lịch học cho lớp ${cls.className} do không có đủ ca học trống`);
            }
        }

        console.log('Đã tạo lịch học cho tất cả các lớp thành công!');
    } catch (error) {
        console.error('Lỗi khi tạo lịch học:', error);
    } finally {
        // Đóng kết nối
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

// Chạy script
createSchedules(); 