# Tài Liệu API Trung Tâm Tiếng Anh

## URL Cơ sở
```
http://localhost:3000/api
```

## Xác thực
Hiện tại, API không yêu cầu xác thực.

## Các Endpoint

### Lịch Học

#### Xem Lịch Dạy Trong Ngày
Lấy tất cả lịch học của một giáo viên trong một ngày cụ thể.

```http
GET /class-schedules/daily/:teacherId
```

**Tham số:**
- `teacherId` (path) - ID của giáo viên

**Phản hồi:**
```json
{
  "totalClasses": 1,
  "schedules": [
    {
      "id": 1,
      "courseId": 1,
      "teacherId": 1,
      "roomId": 1,
      "date": "2024-12-19",
      "startTime": "09:00:00",
      "endTime": "10:30:00",
      "status": "scheduled",
      "teacher": {
        "id": 1,
        "name": "Nguyễn Văn A",
        "levelId": 1,
        "status": "active"
      },
      "room": {
        "id": 1,
        "roomNumber": "A101",
        "capacity": 20,
        "status": "available"
      },
      "course": {
        "id": 1,
        "name": "Tiếng Anh Giao Tiếp",
        "levelId": 1,
        "description": "Khóa học giao tiếp nâng cao"
      }
    }
  ]
}
```

#### Thay Thế Giáo Viên
Thay thế giáo viên cho một lịch học cụ thể.

```http
PUT /class-schedules/:id/replace-teacher
```

**Tham số:**
- `id` (path) - ID của lịch học
- `newTeacherId` (body) - ID của giáo viên mới

**Request Body:**
```json
{
  "newTeacherId": 2
}
```

**Phản hồi:**
```json
{
  "id": 1,
  "courseId": 1,
  "teacherId": 2,
  "roomId": 1,
  "date": "2024-12-19",
  "startTime": "09:00:00",
  "endTime": "10:30:00",
  "status": "scheduled",
  "teacher": {
    "id": 2,
    "name": "Trần Thị B",
    "levelId": 1,
    "status": "busy"
  }
}
```

#### Thay Đổi Phòng Học
Thay đổi phòng học cho một lịch học cụ thể.

```http
PUT /class-schedules/:id/replace-room
```

**Tham số:**
- `id` (path) - ID của lịch học
- `newRoomId` (body) - ID của phòng học mới

**Request Body:**
```json
{
  "newRoomId": 2
}
```

**Phản hồi:**
```json
{
  "id": 1,
  "courseId": 1,
  "teacherId": 1,
  "roomId": 2,
  "date": "2024-12-19",
  "startTime": "09:00:00",
  "endTime": "10:30:00",
  "status": "scheduled",
  "room": {
    "id": 2,
    "roomNumber": "B201",
    "capacity": 25,
    "status": "occupied"
  }
}
```

#### Thay Đổi Thời Gian Học
Thay đổi thời gian cho một lịch học cụ thể.

```http
PUT /class-schedules/:id/reschedule
```

**Tham số:**
- `id` (path) - ID của lịch học
- `startTime` (body) - Thời gian bắt đầu mới (định dạng: "HH:mm")
- `endTime` (body) - Thời gian kết thúc mới (định dạng: "HH:mm")

**Request Body:**
```json
{
  "startTime": "10:00",
  "endTime": "11:30"
}
```

**Phản hồi:**
```json
{
  "id": 1,
  "courseId": 1,
  "teacherId": 1,
  "roomId": 1,
  "date": "2024-12-19",
  "startTime": "10:00:00",
  "endTime": "11:30:00",
  "status": "scheduled"
}
```

## Phản Hồi Lỗi

### Lỗi Validation
```json
{
  "status": "error",
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "field": "newTeacherId",
      "message": "ID giáo viên là bắt buộc"
    }
  ]
}
```

### Lỗi Không Tìm Thấy
```json
{
  "status": "error",
  "message": "Không tìm thấy tài nguyên",
  "error": "Không tìm thấy lịch học với ID 1"
}
```

### Lỗi Xung Đột
```json
{
  "status": "error",
  "message": "Phát hiện xung đột",
  "error": "Giáo viên không khả dụng trong thời gian yêu cầu"
}
```

## Mã Trạng Thái

API trả về các mã trạng thái sau:

- `200` - Thành công
- `400` - Yêu cầu không hợp lệ (lỗi validation)
- `404` - Không tìm thấy
- `409` - Xung đột
- `500` - Lỗi server 