# Hướng Dẫn Cài Đặt Chi Tiết

## Bước 1: Chuẩn Bị Môi Trường

### 1.1. Cài đặt Node.js
1. Truy cập https://nodejs.org/
2. Tải phiên bản LTS (ít nhất là v14.x)
3. Cài đặt với các tùy chọn mặc định
4. Kiểm tra cài đặt bằng cách mở Command Prompt và gõ:
   ```bash
   node --version
   npm --version
   ```

### 1.2. Cài đặt MySQL
Bạn có thể chọn một trong hai cách:

#### Cách 1: Cài đặt MySQL Server
1. Tải MySQL Community Server từ https://dev.mysql.com/downloads/
2. Cài đặt với các tùy chọn:
   - Chọn "Server only" hoặc "Full"
   - Đặt mật khẩu root là: 123456
3. Kiểm tra MySQL đã chạy bằng cách mở Command Prompt và gõ:
   ```bash
   mysql -uroot -p123456
   ```

#### Cách 2: Cài đặt XAMPP (Khuyến nghị cho người mới)
1. Tải XAMPP từ https://www.apachefriends.org/
2. Cài đặt XAMPP với các tùy chọn mặc định
3. Khởi động XAMPP Control Panel
4. Start module Apache và MySQL
5. Truy cập phpMyAdmin qua http://localhost/phpmyadmin

### 1.3. Cài đặt Git (nếu chưa có)
1. Tải từ https://git-scm.com/downloads
2. Cài đặt với các tùy chọn mặc định

## Bước 2: Tải Mã Nguồn

1. Tạo thư mục cho dự án:
   ```bash
   mkdir D:\class
   cd D:\class
   ```

2. Clone repository:
   ```bash
   git clone https://github.com/yourusername/English_training_center_product.git
   cd English_training_center_product
   ```

## Bước 3: Cài Đặt Dependencies

1. Mở Command Prompt với quyền Administrator
2. Di chuyển vào thư mục dự án:
   ```bash
   cd D:\class\English_training_center_product
   ```

3. Cài đặt các gói cần thiết:
   ```bash
   # Cài đặt dependencies chính
   npm install

   # Cài đặt TypeScript và công cụ dev
   npm install --save-dev typescript ts-node @types/node @types/express

   # Cài đặt các gói xử lý file
   npm install multer @types/multer xlsx

   # Cài đặt CORS
   npm install cors @types/cors

   # Cài đặt các gói testing
   npm install --save-dev jest @types/jest ts-jest
   ```

## Bước 4: Cấu Hình Database

### Cách 1: Sử dụng Command Line (MySQL)

1. Tạo file `.env` trong thư mục gốc của dự án:
   ```bash
   copy .env.example .env
   ```

2. Mở file `.env` và điền thông tin:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=123456
   DB_DATABASE=english_tranning_center
   ```

3. Tạo và import database:
   ```bash
   # Mở MySQL
   mysql -uroot -p123456

   # Trong MySQL prompt, tạo database:
   CREATE DATABASE IF NOT EXISTS english_tranning_center;
   exit;

   # Import dữ liệu mẫu
   mysql -uroot -p123456 english_tranning_center < english_tranning_center.sql
   ```

### Cách 2: Sử dụng phpMyAdmin (XAMPP)

1. Tạo database:
   - Mở trình duyệt, truy cập http://localhost/phpmyadmin
   - Click "New" ở sidebar bên trái
   - Nhập tên database: `english_tranning_center`
   - Chọn Collation: `utf8mb4_general_ci`
   - Click "Create"

2. Import database cơ bản:
   - Chọn database `english_tranning_center` ở sidebar
   - Click tab "Import"
   - Click "Choose File" và chọn file `english_tranning_center.sql`
   - Cuộn xuống dưới và click "Import"

3. Cập nhật cấu trúc database:
   Với mỗi file SQL cập nhật, thực hiện các bước:
   - Chọn database `english_tranning_center` ở sidebar bên trái
   - Click tab "Import" ở menu trên cùng
   - Click "Choose File" và chọn file SQL từ thư mục `update-sql`
   - Cuộn xuống dưới và click "Go"

   **Thứ tự import các file:**
   1. `english_tranning_center.sql` (file cơ sở)
   2. `update_classrooms.sql`
   3. `update_class_schedules.sql`
   4. `update_references.sql`
   5. `add_experience_to_teachers.sql`
   6. `add_number_of_students.sql`
   7. `add_teacher_levels.sql`
   8. `add_shift_times.sql`

   **Lưu ý quan trọng:**
   - Import đúng thứ tự các file để tránh lỗi
   - Nếu gặp lỗi "Table already exists", có thể bỏ qua
   - Sau mỗi lần import, kiểm tra Message/Log ở dưới để đảm bảo không có lỗi nghiêm trọng
   - Nếu có lỗi không mong muốn, có thể:
     1. Xóa database: Click database > Operations > Drop
     2. Tạo lại database mới
     3. Import lại từ đầu theo đúng thứ tự

   **Kiểm tra cập nhật:**
   Sau khi import xong, kiểm tra:
   - Click vào từng bảng ở sidebar để xem cấu trúc
   - Với bảng `classrooms`: kiểm tra cột `type` đã được cập nhật
   - Với bảng `teachers`: kiểm tra cột `experience` đã được thêm
   - Với bảng `classes`: kiểm tra cột `number_of_students` đã được thêm
   - Với bảng `shifts`: kiểm tra các cột `start_time` và `end_time` đã được thêm
   - Với bảng `teacher_levels`: kiểm tra bảng đã được tạo

   **Xử lý lỗi phổ biến trong phpMyAdmin:**
   
   1. Lỗi "Access denied":
      - Kiểm tra user root có password là 123456
      - Hoặc tạo user mới với full quyền:
        ```sql
        CREATE USER 'newuser'@'localhost' IDENTIFIED BY '123456';
        GRANT ALL PRIVILEGES ON english_tranning_center.* TO 'newuser'@'localhost';
        FLUSH PRIVILEGES;
        ```

   2. Lỗi "Table already exists":
      - Click tab "Operations"
      - Click "Check tables" để kiểm tra tình trạng các bảng
      - Nếu cần, có thể xóa và tạo lại database

   3. Lỗi "Foreign key constraint fails":
      - Click tab "SQL"
      - Chạy lệnh tắt kiểm tra khóa ngoại:
        ```sql
        SET FOREIGN_KEY_CHECKS = 0;
        -- Chạy câu lệnh import
        SET FOREIGN_KEY_CHECKS = 1;
        ```

   4. Lỗi charset/collation:
      - Khi tạo database, chọn:
        - Character set: utf8mb4
        - Collation: utf8mb4_unicode_ci

## Bước 5: Khởi Chạy Ứng Dụng

### Chế độ Development
```bash
npm run dev
```
- Server sẽ chạy tại http://localhost:3000
- API docs có thể truy cập tại http://localhost:3000/api-docs

### Chế độ Production
```bash
npm run build
npm start
```

## Kiểm Tra Cài Đặt

1. Kiểm tra server đang chạy:
   - Mở trình duyệt, truy cập http://localhost:3000
   - Nếu thấy trang chào mừng, server đã chạy thành công

2. Kiểm tra API:
   - Mở Postman hoặc trình duyệt
   - Thử API lấy danh sách phòng: http://localhost:3000/api/rooms
   - Nếu nhận được JSON response, API đã hoạt động
