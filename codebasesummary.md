# English Training Center Management System - Code Base Summary

## Tổng Quan Dự Án
- **Tên dự án**: English Training Center Management System
- **Mục đích**: Quản lý lịch học và phòng học tại trung tâm tiếng Anh
- **Phiên bản hiện tại**: 1.1.0 (Tháng 3/2024)

## Công Nghệ Sử Dụng
- **Backend**: Node.js với TypeScript
- **Framework**: Express.js
- **Database**: MySQL/MariaDB (v10.4 trở lên)
- **ORM**: TypeORM
- **Công cụ phát triển**: nodemon, ts-node
- **Xử lý file**: multer, xlsx
- **Khác**: cors, dotenv

## Cấu Trúc Dự Án
```
src/
├── config/         # Cấu hình database và ứng dụng
├── controllers/    # Xử lý request
├── entities/       # Các entity database
├── interfaces/     # TypeScript interfaces
├── middleware/     # Middleware Express
├── repositories/   # Các repository database
├── routes/         # Routes API
├── services/       # Logic nghiệp vụ
├── utils/          # Các hàm tiện ích
├── validations/    # Schema validation cho request
```

## Cấu Trúc Database
```
tables/
├── attendance           # Điểm danh học viên
├── class_schedules     # Lịch học của các lớp
├── class_teachers      # Phân công giáo viên cho lớp
├── classes            # Thông tin lớp học
├── classrooms         # Thông tin phòng học
├── courses           # Thông tin khóa học
├── courses_level     # Cấp độ khóa học
├── level             # Cấp độ giảng dạy
├── online_room       # Thông tin phòng học online
├── schedules         # Lịch học chung
├── shifts            # Ca học
├── students          # Thông tin học viên
├── teachers          # Thông tin giáo viên
└── teacher_level     # Cấp độ giáo viên
```

## API Endpoints

### Quản Lý Phòng Học
- GET `/rooms` - Lấy danh sách phòng
- GET `/rooms/search` - Tìm kiếm phòng theo tiêu chí
- GET `/rooms/:id` - Xem chi tiết phòng
- GET `/rooms/:id/availability` - Kiểm tra tình trạng phòng
- GET `/rooms/:id/history` - Xem lịch sử sử dụng phòng
- PUT `/rooms/:id` - Cập nhật thông tin phòng
- DELETE `/rooms/:id` - Xóa phòng (soft delete)

### Quản Lý Lớp Học
- GET `/classes` - Lấy danh sách lớp học
- GET `/classes/:id` - Xem chi tiết lớp học
- POST `/classes` - Tạo lớp học mới
- PUT `/classes/:id` - Cập nhật thông tin lớp học
- DELETE `/classes/:id` - Xóa lớp học

### Quản Lý Lịch Học
- GET `/schedules` - Xem lịch học
- GET `/schedules/daily` - Xem lịch học theo ngày
- POST `/schedules/generate` - Tự động tạo lịch học
- PUT `/schedules/:id` - Cập nhật lịch học
- DELETE `/schedules/:id` - Hủy lịch học

### Import/Export
- POST `/import/rooms` - Upload danh sách phòng từ Excel
- POST `/import/teachers` - Upload danh sách giáo viên từ Excel

## Tính Năng Chính
1. Quản lý lịch học:
   - Xem lịch học hàng ngày
   - Tìm phòng học khả dụng
   - Thay thế giáo viên
   - Thay đổi phòng học
   - Điều chỉnh thời gian học

2. Tự động tạo lịch học:
   - Phân bổ lịch học tự động cho các lớp
   - Kiểm tra và tránh xung đột lịch
   - Phân bổ số buổi học theo loại lớp:
     * Lớp chính thức: 15 buổi
     * Lớp tutorial: 10 buổi
     * Lớp minispeaking: 5 buổi

3. Quản lý phòng học:
   - Upload danh sách từ Excel
   - Theo dõi tình trạng sử dụng
   - Kiểm tra xung đột lịch

## Quy Trình Phát Triển
1. **Testing**:
   ```bash
   npm run test           # Kiểm tra tổng thể
   npm run test:repos     # Kiểm tra repositories
   npm run test:services  # Kiểm tra services
   npm run test:validation # Kiểm tra validation
   npm run test:api       # Kiểm tra API endpoints
   ```

2. **Development**:
   ```bash
   npm run dev           # Chạy development mode
   npm run build        # Build TypeScript
   npm start           # Chạy production mode
   ```

## Lưu Ý Quan Trọng
1. Sử dụng TypeScript cho type safety
2. Implement soft delete cho các thao tác xóa
3. Validate input trước khi xử lý
4. Sử dụng transaction cho các thao tác phức tạp
5. Ghi log đầy đủ cho debugging
6. Đảm bảo cấu hình môi trường đúng trước khi chạy
7. Backup database thường xuyên
8. Kiểm tra kỹ các thao tác xóa và cập nhật

## Cập Nhật và Thay Đổi
### Version 1.1.0 (3/2024)
- Thêm tính năng tự động tạo lịch học
- Cải tiến cấu trúc database (thêm bảng shifts)
- Thêm tính năng kiểm tra xung đột lịch học 