# Tài Liệu API

## Quản Lý Lịch Học

### 1. Xem Lịch Học Trong Ngày
Lấy danh sách các lịch học trong một ngày cụ thể.

```http
GET /api/class-schedules/daily?date=YYYY-MM-DD
```

**Tham số:**
- `date` (query, bắt buộc): Ngày cần xem lịch (định dạng: YYYY-MM-DD)

**Ví dụ Request:**
```bash
# Xem lịch học ngày 01/01/2024
curl "http://localhost:3000/api/class-schedules/daily?date=2024-01-01"

# Xem lịch học ngày hiện tại
curl "http://localhost:3000/api/class-schedules/daily?date=2024-12-28"
```

**Phản hồi thành công:**
```json
{
    "success": true,
    "data": {
        "totalClasses": 1,
        "schedules": [
            {
                "id": 1,
                "date": "2024-01-01",
                "dayOfWeek": "Thứ 2",
                "shift": {
                    "id": 1,
                    "teachingShift": "Sáng",
                    "startTime": "08:00",
                    "endTime": "10:00"
                },
                "room": {
                    "id": 1,
                    "name": "P001",
                    "type": "Phòng học",
                    "capacity": 30,
                    "currentStudents": 15
                },
                "class": {
                    "id": 1,
                    "name": "Anh văn cơ bản",
                    "numberOfStudents": 15,
                    "type": "Regular"
                },
                "course": {
                    "id": 1,
                    "name": "Anh văn cơ bản 1",
                    "level": "Beginner"
                },
                "teacher": {
                    "id": 1,
                    "name": "Nguyễn Văn A",
                    "level": "Senior",
                    "experience": "2 năm"
                }
            }
        ]
    }
}
```

**Phản hồi lỗi - Ngày không hợp lệ:**
```json
{
    "success": false,
    "message": "Invalid date format. Use YYYY-MM-DD"
}
```

**Phản hồi lỗi - Không có lịch học:**
```json
{
    "success": true,
    "data": {
        "totalClasses": 0,
        "schedules": []
    }
}
```

### 2. Xem Chi Tiết Lịch Học
Lấy thông tin chi tiết của một lịch học cụ thể.

```http
GET /api/class-schedules/:id
```

**Ví dụ Request:**
```bash
# Xem chi tiết lịch học có ID = 1
curl "http://localhost:3000/api/class-schedules/1"

# Xem chi tiết lịch học không tồn tại
curl "http://localhost:3000/api/class-schedules/999"
```

**Phản hồi thành công:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "scheduleDate": "2024-01-01",
        "shift": {
            "id": 1,
            "teachingShift": "Sáng",
            "startTime": "08:00",
            "endTime": "10:00"
        },
        "room": {
            "id": 1,
            "roomNumber": "P001",
            "capacity": 30,
            "type": "Phòng học",
            "status": true
        },
        "class": {
            "id": 1,
            "className": "Anh văn cơ bản",
            "numberOfStudents": 15,
            "course": {
                "id": 1,
                "courseName": "Anh văn cơ bản 1",
                "level": "Beginner"
            }
        },
        "teacher": {
            "id": 1,
            "teacherName": "Nguyễn Văn A",
            "email": "teacher@example.com",
            "experience": "2 năm",
            "level": {
                "id": 1,
                "levelName": "Senior"
            }
        }
    }
}
```

**Phản hồi lỗi - ID không hợp lệ:**
```json
{
    "success": false,
    "message": "Invalid schedule ID"
}
```

**Phản hồi lỗi - Không tìm thấy:**
```json
{
    "success": false,
    "message": "Schedule not found"
}
```

### 3. Thay Đổi Giáo Viên
Thay đổi giáo viên cho một lịch học.

```http
PUT /api/class-schedules/:id/replace-teacher
```

**Ví dụ Request:**
```bash
# Thay đổi giáo viên cho lịch học ID = 1
curl -X PUT "http://localhost:3000/api/class-schedules/1/replace-teacher" \
     -H "Content-Type: application/json" \
     -d '{"newTeacherId": 2}'

# Thay đổi với giáo viên không cùng cấp độ
curl -X PUT "http://localhost:3000/api/class-schedules/1/replace-teacher" \
     -H "Content-Type: application/json" \
     -d '{"newTeacherId": 3}'
```

**Phản hồi thành công:**
```json
{
    "success": true,
    "message": "Teacher replaced successfully",
    "data": {
        "id": 1,
        "teacher": {
            "id": 2,
            "teacherName": "Nguyễn Văn B",
            "level": {
                "id": 1,
                "levelName": "Senior"
            }
        }
        // ... thông tin khác
    }
}
```

**Phản hồi lỗi - Giáo viên không phù hợp:**
```json
{
    "success": false,
    "message": "New teacher must have the same level as current teacher"
}
```

**Phản hồi lỗi - Giáo viên bận:**
```json
{
    "success": false,
    "message": "New teacher is not available at this time"
}
```

### 4. Thay Đổi Phòng Học
Thay đổi phòng học cho một lịch học.

```http
PUT /api/class-schedules/:id/replace-room
```

**Ví dụ Request:**
```bash
# Thay đổi phòng học
curl -X PUT "http://localhost:3000/api/class-schedules/1/replace-room" \
     -H "Content-Type: application/json" \
     -d '{"newRoomId": 2}'

# Thay đổi sang phòng đã có lịch
curl -X PUT "http://localhost:3000/api/class-schedules/1/replace-room" \
     -H "Content-Type: application/json" \
     -d '{"newRoomId": 3}'
```

**Phản hồi thành công:**
```json
{
    "success": true,
    "message": "Room replaced successfully",
    "data": {
        "id": 1,
        "room": {
            "id": 2,
            "roomNumber": "P002",
            "capacity": 25,
            "type": "Phòng học",
            "status": true
        }
        // ... thông tin khác
    }
}
```

**Phản hồi lỗi - Phòng đã có lịch:**
```json
{
    "success": false,
    "message": "Room is not available at this time"
}
```

### 5. Thay Đổi Thời Gian Học
Thay đổi thời gian của một lịch học.

```http
PUT /api/class-schedules/:id/reschedule
```

**Ví dụ Request:**
```bash
# Thay đổi thời gian hợp lệ
curl -X PUT "http://localhost:3000/api/class-schedules/1/reschedule" \
     -H "Content-Type: application/json" \
     -d '{
         "startTime": "10:00",
         "endTime": "12:00"
     }'

# Thời gian không hợp lệ
curl -X PUT "http://localhost:3000/api/class-schedules/1/reschedule" \
     -H "Content-Type: application/json" \
     -d '{
         "startTime": "12:00",
         "endTime": "10:00"
     }'

# Định dạng thời gian không hợp lệ
curl -X PUT "http://localhost:3000/api/class-schedules/1/reschedule" \
     -H "Content-Type: application/json" \
     -d '{
         "startTime": "9",
         "endTime": "11"
     }'
```

**Phản hồi thành công:**
```json
{
    "success": true,
    "message": "Schedule updated successfully",
    "data": {
        "id": 1,
        "shift": {
            "id": 1,
            "teachingShift": "10:00 - 12:00",
            "startTime": "10:00:00",
            "endTime": "12:00:00"
        }
        // ... thông tin khác
    }
}
```

**Phản hồi lỗi - Định dạng không hợp lệ:**
```json
{
    "success": false,
    "message": "Invalid time format. Use HH:mm (e.g., 09:30)"
}
```

**Phản hồi lỗi - Thời gian không hợp lý:**
```json
{
    "success": false,
    "message": "End time must be after start time"
}
```

**Phản hồi lỗi - Xung đột lịch:**
```json
{
    "success": false,
    "message": "Room is not available at new time"
}
```

### Định Dạng Phản Hồi Lỗi Chung

```json
{
    "success": false,
    "message": "Mô tả lỗi",
    "error": "Chi tiết lỗi (nếu có)"
}
```

**Các mã lỗi:**
- 400: Dữ liệu đầu vào không hợp lệ
  - Định dạng ngày không hợp lệ
  - Định dạng thời gian không hợp lệ
  - ID không hợp lệ
  - Thời gian kết thúc trước thời gian bắt đầu
  
- 404: Không tìm thấy tài nguyên
  - Lịch học không tồn tại
  - Giáo viên không tồn tại
  - Phòng học không tồn tại

- 409: Xung đột
  - Giáo viên đã có lịch dạy
  - Phòng học đã được sử dụng
  - Cấp độ giáo viên không phù hợp

- 500: Lỗi server
  - Lỗi kết nối database
  - Lỗi xử lý dữ liệu
  - Lỗi hệ thống khác 