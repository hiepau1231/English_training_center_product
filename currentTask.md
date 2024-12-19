# Yêu cầu chức năng

## 1. Xem số lớp đang dạy trong ngày
- **API Endpoint**: `GET /api/classes/daily`
- **Input**: 
  - Ngày (date)
- **Output**:
  - Tổng số lớp đang dạy
  - Danh sách các lớp với thông tin cơ bản

## 2. Xem thông tin chi tiết phòng học
- **API Endpoint**: `GET /api/rooms/:roomId/schedule`
- **Input**:
  - ID phòng học
  - Ngày (date)
- **Output**:
  - Thông tin giáo viên
    - Tên giáo viên
    - Cấp độ giáo viên
  - Thông tin phòng học
    - Số phòng
  - Thông tin ca dạy
    - Giờ bắt đầu
    - Giờ kết thúc
  - Thông tin khóa học
    - Tên khóa học
    - Cấp độ

## 3. Thay thế giáo viên
- **API Endpoint**: `PUT /api/classes/:classId/replace-teacher`
- **Input**:
  - ID lớp học
  - ID giáo viên mới (phải cùng cấp độ)
- **Output**:
  - Thông tin cập nhật sau khi thay thế
  - Thông báo thành công/thất bại

## 4. Thay đổi phòng học
- **API Endpoint**: `PUT /api/classes/:classId/replace-room`
- **Input**:
  - ID lớp học
  - ID phòng học mới
- **Output**:
  - Th��ng tin cập nhật sau khi thay đổi
  - Thông báo thành công/thất bại

## 5. Thay đổi giờ dạy
- **API Endpoint**: `PUT /api/classes/:classId/reschedule`
- **Input**:
  - ID lớp học
  - Thời gian mới (startTime, endTime)
- **Output**:
  - Thông tin cập nhật sau khi thay đổi
  - Thông báo thành công/thất bại

# User Flow

1. **Xem lớp học trong ngày**
   ```mermaid
   flowchart TD
   A[User] --> B[Chọn ngày]
   B --> C[Gửi request GET /api/classes/daily]
   C --> D[Hiển thị danh sách lớp]
   ```

2. **Xem chi tiết phòng học**
   ```mermaid
   flowchart TD
   A[User] --> B[Chọn phòng học]
   B --> C[Chọn ngày]
   C --> D[Gửi request GET /api/rooms/:roomId/schedule]
   D --> E[Hiển thị thông tin chi tiết]
   ```

3. **Thay thế giáo viên**
   ```mermaid
   flowchart TD
   A[User] --> B[Chọn lớp học]
   B --> C[Xem danh sách giáo viên cùng cấp độ]
   C --> D[Chọn giáo viên thay thế]
   D --> E[Gửi request PUT /api/classes/:classId/replace-teacher]
   E --> F[Cập nhật thành công]
   ```

4. **Thay đổi phòng học**
   ```mermaid
   flowchart TD
   A[User] --> B[Chọn lớp học]
   B --> C[Xem danh sách phòng trống]
   C --> D[Chọn phòng mới]
   D --> E[Gửi request PUT /api/classes/:classId/replace-room]
   E --> F[Cập nhật thành công]
   ```

5. **Thay đổi giờ dạy**
   ```mermaid
   flowchart TD
   A[User] --> B[Chọn lớp học]
   B --> C[Chọn thời gian mới]
   C --> D[Kiểm tra xung đột]
   D --> E[Gửi request PUT /api/classes/:classId/reschedule]
   E --> F[Cập nhật thành công]
   ```

# Database Schema

## Entities cần thiết:

1. **Teacher**
   - id
   - name
   - levelId
   - status
   - createdAt
   - updatedAt

2. **TeacherLevel**
   - id
   - name
   - description
   - createdAt
   - updatedAt

3. **Room**
   - id
   - roomNumber
   - capacity
   - status
   - createdAt
   - updatedAt

4. **Course**
   - id
   - name
   - levelId
   - description
   - createdAt
   - updatedAt

5. **ClassSchedule**
   - id
   - courseId
   - teacherId
   - roomId
   - date
   - startTime
   - endTime
   - status
   - createdAt
   - updatedAt

# Các bước triển khai

1. [ ] Tạo các Entity với TypeORM
2. [ ] Tạo Repository cho mỗi Entity
3. [ ] Tạo Service layer với business logic
4. [ ] Tạo Controller với các endpoint API
5. [ ] Tạo Routes và Middleware
6. [ ] Viết validation và error handling
7. [ ] Testing các API endpoint
8. [ ] Documentation API 