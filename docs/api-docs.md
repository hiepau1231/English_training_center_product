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

**Response**:
```json
[
    {
        "id": 1,
        "roomNumber": "P001",
        "capacity": 30,
        "type": "Phong Online",
        "status": false
    }
]

#### Kiểm tra tình trạng phòng
Kiểm tra phòng có sẵn trong khoảng thời gian nhất định

```http
GET /rooms/{id}/availability
```

**Parameters**:
- startDate (required): YYYY-MM-DD
- endDate (required): YYYY-MM-DD

**Response**:
```json
{
    "isAvailable": true
}

### Lịch Học

#### Lấy lịch học theo ngày
Lấy danh sách lịch học trong một ngày cụ thể

```http
GET /class-schedules/daily
```

**Parameters**:
- date (required): YYYY-MM-DD

**Response**:
```json
{
    "totalClasses": 0,
    "schedules": []
}

### Import Dữ Liệu

#### Tải template import phòng học
Tải file Excel mẫu để import phòng học

```http
GET /import/templates/room
```

**Response**: File Excel download

### API cần bổ sung
- /api/teachers
- /api/courses

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
- `startDate` (query) - Ngày bắt đầu (định d���ng: YYYY-MM-DD)
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

#### Xem Lịch Học Trong Ngày
Lấy danh sách lịch học trong một ngày cụ thể.

```http
GET /class-schedules/daily?date=YYYY-MM-DD
```

**Tham số:**
- `date` (query, required) - Ngày cần xem lịch (định dạng: YYYY-MM-DD)

**Phản hồi thành công:**
```json
{
  "totalClasses": 1,
  "schedules": [
    {
      "id": 1,
      "classId": 1,
      "scheduleDate": "2024-03-19",
      "shiftId": 1,
      "courseId": 1,
      "roomId": 1,
      "teacherId": 1,
      "teacher": {
        "id": 1,
        "teacherName": "John Doe",
        "email": "john@example.com",
        "experience": "2 years",
        "isFulltime": true,
        "level": {
          "id": 1,
          "levelName": "Senior",
          "description": "Over 3 years experience"
        }
      },
      "room": {
        "id": 1,
        "classroomName": "Room 101",
        "capacity": 30,
        "type": "Theory"
      },
      "course": {
        "id": 1,
        "courseName": "English Basic 1",
        "status": "Active"
      },
      "shift": {
        "id": 1,
        "teachingShift": "Morning",
        "startTime": "08:00",
        "endTime": "10:00"
      },
      "class": {
        "id": 1,
        "className": "Basic 1 - Morning",
        "startDate": "2024-03-01",
        "endDate": "2024-05-01",
        "numberOfStudents": 25
      }
    }
  ]
}
```

**Phản hồi lỗi:**
```json
{
  "success": false,
  "message": "Invalid date format. Use YYYY-MM-DD",
  "error": "..."
}
```

#### Xem Chi Tiết Lịch Học
Lấy thông tin chi tiết của một lịch học.

```http
GET /class-schedules/:id
```

**Tham số:**
- `id` (path, required) - ID của lịch học

**Phản hồi:** Tương tự như một phần tử trong mảng schedules ở trên

#### Thay Đổi Giáo Viên
Thay đổi giáo viên cho một lịch học.

```http
PUT /class-schedules/:id/teacher
Content-Type: application/json
```

**Tham số:**
- `id` (path, required) - ID của lịch học

**Request Body:**
```json
{
  "newTeacherId": 2
}
```

**Phản hồi:** Trả về lịch học đã được cập nhật

#### Thay Đổi Phòng Học
Thay đổi phòng học cho một lịch học.

```http
PUT /class-schedules/:id/room
Content-Type: application/json
```

**Tham số:**
- `id` (path, required) - ID của lịch học

**Request Body:**
```json
{
  "newRoomId": 2
}
```

**Phản hồi:** Trả về lịch học đã được cập nhật

#### Thay Đổi Thời Gian Học
Thay đổi thời gian học.

```http
PUT /class-schedules/:id/time
Content-Type: application/json
```

**Tham số:**
- `id` (path, required) - ID của lịch học

**Request Body:**
```json
{
  "startTime": "10:15",
  "endTime": "12:15"
}
```

**Phản hồi:** Trả về lịch học đã được cập nhật

#### Tìm Giáo Viên Có Thể Thay Thế
Tìm danh sách giáo viên có thể thay thế cho một lịch học.

```http
GET /class-schedules/:id/available-teachers
```

**Tham số:**
- `id` (path, required) - ID của lịch học

**Request Body:**
```json
{
  "date": "2024-03-19",
  "startTime": "08:00",
  "endTime": "10:00"
}
```

**Phản hồi:**
```json
{
  "availableTeachers": [
    {
      "id": 2,
      "teacherName": "Jane Smith",
      "email": "jane@example.com",
      "experience": "3 years",
      "level": {
        "levelName": "Senior"
      }
    }
  ]
}
```

#### Tìm Phòng Trống
Tìm phòng học trống trong một khoảng thời gian.

```http
GET /class-schedules/available-rooms?date=YYYY-MM-DD&startTime=HH:mm&endTime=HH:mm&minCapacity=number
```

**Tham số:**
- `date` (query, required) - Ngày cần tìm (YYYY-MM-DD)
- `startTime` (query, required) - Giờ bắt đầu (HH:mm)
- `endTime` (query, required) - Giờ kết thúc (HH:mm)
- `minCapacity` (query, optional) - Sức chứa tối thiểu

**Phản hồi:**
```json
{
  "availableRooms": [
    {
      "id": 3,
      "classroomName": "Room 103",
      "capacity": 35,
      "type": "Theory"
    }
  ]
}
```

#### Tạo Lịch Học Tự Động
Tạo lịch học tự động cho một lớp.

```http
POST /class-schedules/generate
Content-Type: application/json
```

**Request Body:**
```json
{
  "classId": 1,
  "startDate": "2024-03-01",
  "endDate": "2024-05-01",
  "preferredTeachers": [1, 2],
  "preferredRooms": [1, 2],
  "preferredShifts": [1, 2]
}
```

**Phản hồi:**
```json
{
  "status": "success",
  "data": {
    "generatedSchedules": [
      // Mảng các lịch học đã được tạo
    ]
  }
}
```

#### Kiểm Tra Xung Đột
Kiểm tra xung đột lịch học.

```http
GET /class-schedules/conflicts
```

**Phản hồi:**
```json
{
  "status": "success",
  "data": {
    "conflicts": [
      {
        "type": "TEACHER_OVERLAP",
        "scheduleId1": 1,
        "scheduleId2": 2,
        "description": "Teacher has overlapping classes"
      }
    ]
  }
}
```

#### Giải Quyết Xung Đột
Giải quyết xung đột lịch học.

```http
POST /class-schedules/resolve-conflicts
Content-Type: application/json
```

**Request Body:**
```json
{
  "conflictId": 1,
  "resolution": {
    "type": "CHANGE_TEACHER",
    "scheduleId": 1,
    "newTeacherId": 3
  }
}
```

**Phản hồi:**
```json
{
  "status": "success",
  "data": {
    "resolvedConflicts": [
      // Mảng các xung đột đã được giải quyết
    ]
  }
}
```

#### Xem Thống Kê
Lấy thống kê về lịch học.

```http
GET /class-schedules/statistics
```

**Phản hồi:**
```json
{
  "status": "success",
  "data": {
    "totalSchedules": 100,
    "activeSchedules": 80,
    "completedSchedules": 20,
    "teacherStats": {
      "mostAssigned": {
        "teacherId": 1,
        "teacherName": "John Doe",
        "scheduleCount": 20
      }
    },
    "roomStats": {
      "mostUsed": {
        "roomId": 1,
        "roomName": "Room 101",
        "useCount": 30
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