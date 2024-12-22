import { AppDataSource } from '../data-source';
import { Class } from '../entities/Class';

async function updateClassDates() {
    try {
        // Khởi tạo kết nối database
        await AppDataSource.initialize();

        // Lấy tất cả các lớp học
        const classes = await AppDataSource.getRepository(Class).find();

        // Cập nhật ngày tháng cho từng lớp
        for (const cls of classes) {
            // Tạo ngày bắt đầu ngẫu nhiên từ 2024-01-01 đến 2024-12-31
            const startDate = new Date('2024-01-01');
            startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 365));

            // Ngày kết thúc là 3 tháng sau ngày bắt đầu
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 3);

            // Cập nhật ngày tháng
            cls.startDate = startDate;
            cls.endDate = endDate;
        }

        // Lưu thay đổi
        await AppDataSource.getRepository(Class).save(classes);

        console.log('Đã cập nhật ngày tháng cho các lớp học thành công!');
    } catch (error) {
        console.error('Lỗi khi cập nhật ngày tháng:', error);
    } finally {
        // Đóng kết nối
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

// Chạy script
updateClassDates(); 