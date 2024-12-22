const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

// Dữ liệu mẫu
const sampleData = [
    {
        'Room Number': 'A101',
        'Capacity': 20,
        'Type': 'Phòng Nghe Nhìn',
        'Status': false
    },
    {
        'Room Number': 'A102',
        'Capacity': 25,
        'Type': 'Phòng Trực Tuyến',
        'Status': false
    },
    {
        'Room Number': 'A103',
        'Capacity': 30,
        'Type': 'Phòng Online',
        'Status': true
    },
    {
        'Room Number': 'A104',
        'Capacity': 15,
        'Type': 'Phòng cho trẻ',
        'Status': false
    }
];

// Tạo workbook mới
const workbook = xlsx.utils.book_new();

// Chuyển đổi dữ liệu thành worksheet
const worksheet = xlsx.utils.json_to_sheet(sampleData);

// Thêm worksheet vào workbook
xlsx.utils.book_append_sheet(workbook, worksheet, 'Rooms');

// Đường dẫn lưu file
const filePath = path.join(process.cwd(), 'sample-data', 'rooms.xlsx');

// Tạo thư mục nếu chưa tồn tại
const dir = path.dirname(filePath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Tạo file Excel
xlsx.writeFile(workbook, filePath);

console.log(`File Excel đã được tạo tại: ${filePath}`); 