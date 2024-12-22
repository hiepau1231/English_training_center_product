# Current Task - Nâng cấp API Thông Tin Phòng Học

## Phân tích Database Hiện Tại

### 1. Cấu trúc Database
1. Bảng Chính:
   - `classrooms`: Thông tin phòng học (id, classroom_name, capacity, type, status)
   - `classes`: Thông tin lớp học (id, class_name, course_id, classroom_id, start_date, end_date)
   - `teachers`: Thông tin giáo viên (id, teacher_name, is_foreign, is_Fulltime, is_Parttime)
   - `shifts`: Ca học (id, teaching_shift, class_id)
   - `schedules`: Lịch học (id, classroom_id)
   - `class_schedules`: Liên kết lớp và lịch học (class_id, schedule_id)
   - `class_teachers`: Liên kết giáo viên và lớp học

2. Bảng Phụ:
   - `teacher_level`: Cấp độ giáo viên
   - `teacher_working_type`: Loại hình làm việc
   - `courses`: Thông tin khóa học
   - `attendance`: Điểm danh

### 2. Mối quan hệ hiện có:
- Classroom (1) - (n) Classes
- Class (1) - (n) Class_Schedules
- Teacher (1) - (n) Class_Teachers
- Class (1) - (n) Shifts

## User Flow

### 1. Upload Danh Sách Lớp Học
1. Admin upload file Excel chứa thông tin lớp học
2. Hệ thống đọc và validate dữ liệu từ file Excel:
   - Kiểm tra định dạng thời gian học
   - Validate tên lớp theo quy tắc (phải bắt đầu bằng tên khóa học)
   - Kiểm tra sức chứa phòng học
3. Hệ thống tạo/cập nhật dữ liệu vào các bảng:
   - Tạo/cập nhật classroom
   - Tạo/cập nhật class và course
   - Tạo/cập nhật shifts (ca học)
   - Tạo/cập nhật class_teachers
4. Trả về kết quả import

### 2. Xem Thông Tin Phòng Học
1. User chọn xem thông tin phòng học
2. Hệ thống trả về thông tin chi tiết:
   - Thông tin phòng: tên, sức chứa, loại phòng
   - Danh sách lớp học hiện tại
   - Lịch sử sử dụng (từ bảng schedules)
   - Thông tin giáo viên (từ bảng class_teachers)

### 3. Tìm Kiếm và Lọc
1. User có thể tìm kiếm theo:
   - Mã/tên phòng (classroom_name)
   - Thời gian (từ bảng shifts)
   - Giáo viên (từ bảng teachers)
   - Khóa học (từ bảng courses)
2. Hệ thống query và trả về kết quả

## Tasks đã hoàn thành

1. Database:
   - [x] Thêm trường type vào bảng classrooms
   - [x] Thêm trường student_count vào bảng classes

2. Entities:
   - [x] Cập nhật ClassroomEntity:
     - [x] Thêm relationship với Classes
     - [x] Thêm relationship với Schedules
   - [x] Cập nhật ClassEntity:
     - [x] Thêm relationship với Teachers (qua class_teachers)
     - [x] Thêm relationship với Schedules (qua class_schedules)

3. Repositories:
   - [x] ClassroomRepository:
     - [x] Thêm method tìm kiếm phòng theo nhiều tiêu chí
     - [x] Thêm method lấy lịch sử sử dụng phòng
   - [x] ClassTeacherRepository:
     - [x] Thêm method lấy danh sách giáo viên theo phòng/lớp
   - [x] ScheduleRepository:
     - [x] Thêm method quản lý lịch học theo phòng

4. Services:
   - [x] ClassroomService:
     - [x] Xử lý logic tìm kiếm phòng
     - [x] Xử lý logic cập nhật thông tin phòng
   - [x] ImportService:
     - [x] Xử lý import data từ Excel
     - [x] Validate dữ liệu theo business rules

5. Controllers:
   - [x] RoomController:
     - [x] API lấy thông tin chi tiết phòng
     - [x] API tìm kiếm phòng
     - [x] API cập nhật thông tin phòng
   - [x] ImportController:
     - [x] API upload file Excel
     - [x] API xem kết quả import

## Tasks cần thực hiện tiếp

1. Database:
   - [ ] Thêm các index cho tối ưu query:
     - [ ] Index cho các trường thường xuyên tìm kiếm
     - [ ] Index cho các khóa ngoại
     - [ ] Index cho các trường thời gian

2. Testing và Documentation:
   - [ ] Thêm unit tests cho các service
   - [ ] Thêm integration tests cho các API
   - [ ] Cập nhật tài liệu API cho các endpoint mới
   - [ ] Thêm monitoring hiệu năng

3. Tối ưu hóa:
   - [ ] Tối ưu các câu query phức tạp
   - [ ] Thêm caching cho các data thường xuyên truy xuất
   - [ ] Xử lý các edge case và error handling

4. Security:
   - [ ] Thêm validation cho input
   - [ ] Xử lý các vấn đề bảo mật
   - [ ] Rate limiting cho các API

## Ưu tiên thực hiện
1. Thêm indexes cho Database
2. Hoàn thiện Testing
3. Tối ưu Performance
4. Tăng cường Security