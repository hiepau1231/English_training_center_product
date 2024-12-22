# Tài Liệu API Trung Tâm Tiếng Anh

## URL Cơ sở
```http
http://localhost:3000/api
```

## Xác thực
Hiện tại, API không yêu cầu xác thực.

## Các Endpoint

### Phòng Học

#### Lấy Danh Sách Phòng
Lấy danh sách tất cả các phòng học.

```http
GET /rooms
```

**Phản hồi:**
```json
[
  {
    "id": 1,
    "roomNumber": "307",
    "capacity": 25,
    "type": "Phòng Nghe Nhìn",
    "status": true,
    "createdAt": "2024-10-12T09:35:23.000Z",
    "updatedAt": "2024-12-22T06:42:20.000Z",
    "deletedAt": null,
    "isDeleted": false,
    "classes": [
      {
        "id": 661,
        "className": "MOVERS 3C - 2407",
        "courseId": 3267,
        "startDate": "2024-04-15",
        "endDate": "2024-07-15",
        "numberOfStudents": 0
      }
    ]
  }
]
```

#### Tìm Kiếm Phòng
Tìm kiếm phòng học theo các tiêu chí.

```http
GET /rooms/search?type=string&capacity=number
```

**Tham số:**
- `type` (query) - Loại phòng học
- `capacity` (query) - Sức chứa tối thiểu

**Phản hồi:**
```json
[
  {
    "id": 1,
    "roomNumber": "307",
    "capacity": 25,
    "type": "Phòng Nghe Nhìn",
    "status": true,
    "classes": [
      {
        "id": 661,
        "className": "MOVERS 3C - 2407",
        "courseId": 3267,
        "startDate": "2024-04-15",
        "endDate": "2024-07-15"
      }
    ]
  }
]
```

#### Xem Chi Tiết Phòng
Lấy thông tin chi tiết của một phòng học.

```http
GET /rooms/:id
```

**Tham số:**
- `id` (path) - ID của phòng học

**Phản hồi:**
```json
{
  "id": 1,
  "roomNumber": "307",
  "capacity": 25,
  "type": "Phòng Nghe Nhìn",
  "status": true,
  "classes": [
    {
      "id": 661,
      "className": "MOVERS 3C - 2407",
      "courseId": 3267,
      "startDate": "2024-04-15",
      "endDate": "2024-07-15",
      "teachers": [
        {
          "id": 1,
          "name": "John Doe",
          "level": "Senior"
        }
      ]
    }
  ]
}
```

#### Kiểm Tra Tình Trạng Phòng
Kiểm tra tình trạng sử dụng của phòng trong một khoảng thời gian.

```http
GET /rooms/:id/availability?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

**Tham số:**
- `id` (path) - ID của phòng học
- `startDate` (query) - Ngày bắt đầu (định dạng: YYYY-MM-DD)
- `endDate` (query) - Ngày kết thúc (định dạng: YYYY-MM-DD)

**Phản hồi:**
```json
{
  "isAvailable": true,
  "conflicts": []
}
```

#### Xem Lịch Sử Sử Dụng Phòng
Lấy lịch sử sử dụng của một phòng học.

```http
GET /rooms/:id/history?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

**Tham số:**
- `id` (path) - ID của phòng học
- `startDate` (query) - Ngày bắt đầu (định dạng: YYYY-MM-DD)
- `endDate` (query) - Ngày kết thúc (định dạng: YYYY-MM-DD)

**Phản hồi:**
```json
{
  "id": 1,
  "roomNumber": "307",
  "history": [
    {
      "date": "2024-03-19",
      "class": "MOVERS 3C - 2407",
      "teacher": "John Doe",
      "startTime": "09:00",
      "endTime": "10:30"
    }
  ]
}
```

#### Cập Nhật Thông Tin Phòng
Cập nhật thông tin của một phòng học.

```http
PUT /rooms/:id
Content-Type: application/json
```

**Tham số:**
- `id` (path) - ID của phòng học

**Request Body:**
```json
{
  "roomNumber": "308",
  "capacity": 30,
  "type": "Phòng Nghe Nhìn",
  "status": true
}
```

**Phản hồi:**
```json
{
  "id": 1,
  "roomNumber": "308",
  "capacity": 30,
  "type": "Phòng Nghe Nhìn",
  "status": true,
  "updatedAt": "2024-12-22T07:00:00.000Z"
}
```

#### Xóa Phòng
Xóa một phòng học (soft delete).

```http
DELETE /rooms/:id
```

**Tham số:**
- `id` (path) - ID của phòng học

**Phản hồi:**
```json
{
  "message": "Room deleted successfully"
}
```

### Import/Export

#### Upload Danh Sách Phòng
Upload danh sách phòng học từ file Excel.

```http
POST /import/rooms
Content-Type: multipart/form-data
```

**Tham số:**
- `file` (form-data) - File Excel chứa danh sách phòng

**Phản hồi:**
```json
{
  "message": "Imported successfully",
  "imported": 5,
  "failed": 0
}
```

#### Upload Danh Sách Giáo Viên
Upload danh sách giáo viên từ file Excel.

```http
POST /import/teachers
Content-Type: multipart/form-data
```

**Tham số:**
- `file` (form-data) - File Excel chứa danh sách giáo viên

**Phản hồi:**
```json
{
  "message": "Imported successfully",
  "imported": 3,
  "failed": 0
}
```

#### Tải File Mẫu
Tải file Excel mẫu cho việc import phòng học.

```http
GET /import/templates/room
```

**Phản hồi:**
File Excel mẫu với các cột:
- Room Number
- Capacity
- Type
- Status

#### Tải File Mẫu Giáo Viên
Tải file Excel mẫu cho việc import giáo viên.

```http
GET /import/templates/teacher
```

**Phản hồi:**
File Excel mẫu với các cột:
- Name
- Role
- Room Number
- Is Foreign
- Is Fulltime
- Is Parttime
- Email
- Phone

### Lịch Học

#### Xem Lịch Dạy Trong Ngày
Lấy tất cả lịch học trong một ngày cụ thể.

```http
GET /class-schedules/daily?date=YYYY-MM-DD
```

**Tham số:**
- `date` (query) - Ngày cần xem lịch (định dạng: YYYY-MM-DD)

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
      "date": "2024-03-19",
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

#### Tìm Phòng Học Khả Dụng
Tìm các phòng học khả dụng trong một khoảng thời gian cụ thể.

```http
GET /class-schedules/available-rooms?date=YYYY-MM-DD&startTime=HH:mm&endTime=HH:mm&minCapacity=N
```

**Tham số:**
- `date` (query) - Ngày cần tìm (định dạng: YYYY-MM-DD)
- `startTime` (query) - Thời gian bắt đầu (định dạng: HH:mm)
- `endTime` (query) - Thời gian kết thúc (định dạng: HH:mm)
- `minCapacity` (query, optional) - Sức chứa tối thiểu của phòng

**Phản hồi:**
```json
{
  "availableRooms": [
    {
      "id": 1,
      "roomNumber": "A101",
      "capacity": 20,
      "status": "available"
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

### Quản Lý Lịch Học Tự Động

#### Tạo Lịch Học Tự Động
Tự động tạo lịch học cho các lớp dựa trên các ràng buộc và quy tắc.

```http
POST /class-schedules/generate
```

**Phản hồi:**
```json
{
  "message": "Đã tạo lịch học thành công",
  "details": {
    "totalClasses": 150,
    "schedulesCreated": {
      "regular": 15,
      "tutorial": 10,
      "minispeaking": 5
    },
    "conflicts": 0
  }
}
```

#### Kiểm Tra Xung Đột Lịch Học
Kiểm tra và hiển thị các xung đột lịch học hiện tại.

```http
GET /class-schedules/conflicts
```

**Phản hồi:**
```json
{
  "conflicts": [
    {
      "room": {
        "id": 1,
        "roomNumber": "201"
      },
      "date": "2024-03-20",
      "shift": {
        "id": 1,
        "name": "Ca sáng"
      },
      "classes": [
        {
          "id": 1,
          "className": "KET 5J - 2407"
        },
        {
          "id": 2,
          "className": "PET 5B - 2407"
        }
      ]
    }
  ],
  "totalConflicts": 1
}
```

#### Giải Quyết Xung Đột Lịch Học
Tự động giải quyết các xung đột lịch học bằng cách điều chỉnh phòng học ho��c thời gian.

```http
POST /class-schedules/resolve-conflicts
```

**Phản hồi:**
```json
{
  "message": "Đã giải quyết xung đột lịch học",
  "resolved": [
    {
      "originalSchedule": {
        "classId": 1,
        "className": "KET 5J - 2407",
        "roomId": 1,
        "date": "2024-03-20",
        "shiftId": 1
      },
      "newSchedule": {
        "classId": 1,
        "className": "KET 5J - 2407",
        "roomId": 2,
        "date": "2024-03-20",
        "shiftId": 1
      }
    }
  ],
  "remainingConflicts": 0
}
```

#### Xem Thống Kê Lịch Học
Xem thống kê về số buổi học của các lớp.

```http
GET /class-schedules/statistics
```

**Phản hồi:**
```json
{
  "statistics": {
    "byClassType": {
      "regular": {
        "totalClasses": 50,
        "averageSessionsPerClass": 15,
        "completedClasses": 45
      },
      "tutorial": {
        "totalClasses": 30,
        "averageSessionsPerClass": 10,
        "completedClasses": 28
      },
      "minispeaking": {
        "totalClasses": 20,
        "averageSessionsPerClass": 5,
        "completedClasses": 20
      }
    },
    "byRoom": {
      "201": {
        "totalSessions": 59,
        "utilization": "85%"
      },
      "202": {
        "totalSessions": 56,
        "utilization": "80%"
      }
    }
  }
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