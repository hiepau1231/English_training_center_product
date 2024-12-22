# Hệ Thống API Trung Tâm Tiếng Anh

## Mô tả
Đây là REST API để quản lý lịch học tại trung tâm tiếng Anh. API cung cấp các endpoint để:
- Xem lịch học hàng ngày
- Tìm phòng học khả dụng trong một khoảng thời gian
- Thay thế giáo viên cho một lịch học
- Thay đổi phòng học cho một lịch học
- Điều chỉnh thời gian học
- Upload danh sách phòng học từ file Excel
- Quản lý thông tin phòng học (xem, sửa, xóa)
- Tự động tạo lịch học cho các lớp
- Kiểm tra và giải quyết xung đột lịch học

## Yêu cầu hệ thống
- Node.js (v14 trở lên)
- MySQL/MariaDB (v10.4 trở lên)
- Git Bash (cho Windows)
- npm hoặc yarn

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd english_training_center_product
```

2. Cài đặt các dependencies:
```bash
# Cài đặt dependencies chính
npm install

# Cài đặt TypeScript và các công cụ dev
npm install --save-dev typescript ts-node @types/node

# Cài đặt các type definitions cần thiết
npm install --save-dev @types/express

# Cài đặt dependencies cho xử lý file
npm install multer @types/multer
npm install xlsx

# Cài đặt dependencies cho CORS
npm install cors @types/cors

# Cài đặt dependencies cho testing
npm install --save-dev jest @types/jest ts-jest
```

3. Cấu hình MySQL trong Git Bash (nếu sử dụng Windows):
```bash
# Thêm MySQL vào PATH của Git Bash
export PATH=$PATH:/c/xampp/mysql/bin
# Kiểm tra cài đặt MySQL
mysql --version
```

4. Tạo file `.env` với nội dung sau:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=123456
DB_DATABASE=english_tranning_center
```

5. Tạo và import database:
```bash
# Tạo database
mysql -uroot -p123456 -e "CREATE DATABASE IF NOT EXISTS english_tranning_center;"

# Import dữ liệu từ file SQL
cat english_tranning_center.sql | mysql -uroot -p123456 english_tranning_center

# Kiểm tra database đã được tạo
mysql -uroot -p123456 english_tranning_center -e "SHOW TABLES;"
```

6. Khởi động server:
```bash
npm run dev
```

## Khắc phục lỗi thường gặp

### 1. Lỗi "ts-node is not recognized" hoặc lỗi TypeScript
Nguyên nhân: Chưa cài đặt TypeScript và ts-node
Cách khắc phục:
```bash
# Cài đặt TypeScript và ts-node
npm install --save-dev typescript ts-node @types/node

# Cài đặt các type definitions cần thiết
npm install --save-dev @types/express
```

### 2. Lỗi "mysql: command not found" trong Git Bash
Nguyên nhân: MySQL chưa được thêm vào PATH
Cách khắc phục:
```bash
# Thêm MySQL vào PATH (thay đổi đường dẫn nếu cần)
export PATH=$PATH:/c/xampp/mysql/bin
```

### 3. Lỗi "Access denied for user 'root'@'localhost'"
Nguyên nhân: Thông tin đăng nhập MySQL không đúng
Cách khắc phục:
1. Kiểm tra file `.env`:
   ```env
   DB_USERNAME=root
   DB_PASSWORD=123456
   ```
2. Kiểm tra kết nối MySQL:
   ```bash
   mysql -uroot -p123456 -e "SELECT VERSION();"
   ```
3. Đảm bảo MySQL đang chạy
4. Kiểm tra quyền của user:
   ```sql
   GRANT ALL PRIVILEGES ON english_tranning_center.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

### 4. Lỗi khi import database
Các bước khắc phục:
1. Kiểm tra file SQL tồn tại:
   ```bash
   ls -la english_tranning_center.sql
   ```
2. Thử import lại với cú pháp khác:
   ```bash
   mysql -uroot -p123456 english_tranning_center < english_tranning_center.sql
   # hoặc
   cat english_tranning_center.sql | mysql -uroot -p123456 english_tranning_center
   ```

### 5. Lỗi "Cannot execute operation on not connected connection"
Nguyên nhân: Chưa kết nối được database
Cách khắc phục:
1. Kiểm tra MySQL đang chạy
2. Kiểm tra file `.env` có đúng thông tin không
3. Thử kết nối trực tiếp bằng MySQL client
4. Đảm bảo đã cài đặt dotenv:
   ```bash
   npm install dotenv
   ```

### 6. Lỗi TypeScript "error TS18046: 'error' is of type 'unknown'"
Nguyên nhân: TypeScript không biết kiểu của biến error trong catch block
Cách khắc phục:
```typescript
try {
    // code
} catch (error: any) {
    // Thêm kiểu any cho error
}
```

### 7. Lỗi "Error: Cannot find module 'multer'"
Nguyên nhân: Chưa cài đặt multer
Cách khắc phục:
```bash
npm install multer @types/multer
```

### 8. Lỗi "Error: Cannot find module 'xlsx'"
Nguyên nhân: Chưa cài đặt xlsx
Cách khắc phục:
```bash
npm install xlsx
```

## Kiểm tra cài đặt

Sau khi cài đặt, chạy các lệnh sau để kiểm tra:

```bash
# Kiểm tra kết nối database
npm run test

# Kiểm tra repositories
npm run test:repos

# Kiểm tra services
npm run test:services

# Kiểm tra validation
npm run test:validation

# Kiểm tra API endpoints
npm run test:api

# Tạo file Excel mẫu
npm run create:sample
```

## Cấu trúc Database
```
tables/
├── attendance           # Điểm danh học viên
├── class_schedules     # Lịch học của các lớp (đã thêm schedule_date và shift_id)
├── class_teachers      # Phân công giáo viên cho lớp
├── classes            # Thông tin lớp học
├── classrooms         # Thông tin phòng học
├── courses           # Thông tin khóa học
├── courses_level     # Cấp độ khóa học
├── level             # Cấp độ giảng dạy
├── online_room       # Thông tin phòng học online
├── schedules         # Lịch học chung
├── shifts            # Ca học (mới thêm)
├── students          # Thông tin học viên
├── teachers          # Thông tin giáo viên
└── teacher_level     # Cấp độ giáo viên
```

## Cấp nhật mới
### Phiên bản 1.1.0 (Tháng 3/2024)
1. Thêm tính năng tự động tạo lịch học:
   - Tự động phân bổ lịch học cho các lớp
   - Đảm bảo không có xung đột về phòng học và thời gian
   - Phân bổ số buổi học phù hợp theo loại lớp:
     * Lớp học chính thức: 15 buổi
     * Lớp tutorial: 10 buổi
     * Lớp minispeaking: 5 buổi

2. Cải tiến cấu trúc database:
   - Thêm bảng `shifts` để quản lý ca học
   - Thêm cột `schedule_date` và `shift_id` trong bảng `class_schedules`
   - Tối ưu hóa quan hệ giữa các bảng

3. Thêm tính năng kiểm tra xung đột lịch học:
   - Kiểm tra trùng lặp phòng học
   - Kiểm tra trùng lặp thời gian
   - Tự động điều chỉnh lịch học để tránh xung đột

## Cấu trúc dự án
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
└── test-data/     # Dữ liệu mẫu cho testing
```

## Công nghệ sử dụng
- Node.js & TypeScript
- Express
- TypeORM
- MySQL/MariaDB
- Git Bash (cho Windows)
- XLSX (xử lý file Excel)
- Multer (xử lý upload file)
- Jest & ts-jest (testing)

## Tài liệu API
Tài liệu chi tiết về API có sẵn trong file [docs/api-docs.md](docs/api-docs.md). Tài liệu bao gồm:
- URL cơ sở và thông tin xác thực
- Danh sách các endpoint và mô tả
- Ví dụ về request/response
- Xử lý lỗi
- Mã trạng thái

## Đóng góp
1. Fork repository
2. Tạo nhánh mới
3. Thực hi��n các thay đổi
4. Gửi pull request

## Giấy phép
Dự án này được cấp phép theo giấy phép MIT.
