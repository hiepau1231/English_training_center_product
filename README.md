# Hệ Thống API Trung Tâm Tiếng Anh

## Mô tả
Đây là REST API để quản lý lịch học tại trung tâm tiếng Anh. API cung cấp các endpoint để xem lịch dạy hàng ngày, thay thế giáo viên, thay đổi phòng học và điều chỉnh thời gian học.

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
```

2. Cài đặt các dependencies:
```bash
npm install
```

3. Tạo file `.env` với nội dung sau:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=english_training_center
```

4. Tạo database:
```bash
npm run db:create
```

5. Khởi động server:
```bash
npm run dev
```

## Tài liệu API
Tài liệu chi tiết về API có sẵn trong file [docs/api-docs.md](docs/api-docs.md). Tài liệu bao gồm:

- URL cơ sở và thông tin xác thực
- Danh sách các endpoint và mô tả
- Ví dụ về request/response
- Xử lý lỗi
- Mã trạng thái

## Kiểm thử
Chạy các lệnh sau để kiểm tra các thành phần khác nhau:

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
```

## Công nghệ sử dụng
- Node.js
- TypeScript
- Express
- TypeORM
- MySQL
- Joi (validation)
- Jest (testing)

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
├── services/      # Logic nghiệp vụ
├── utils/         # Các hàm tiện ích
└── validations/   # Schema validation cho request
```

## Đóng góp
1. Fork repository
2. Tạo nhánh mới
3. Thực hiện các thay đổi
4. Gửi pull request

## Giấy phép
Dự án này được cấp phép theo giấy phép MIT.
