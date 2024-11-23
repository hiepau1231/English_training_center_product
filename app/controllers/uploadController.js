const multer = require('multer');
const path = require('path');
const teacherService = require('../services/teacherService');

// Cấu hình multer để lưu file vào thư mục uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter để chỉ chấp nhận file Excel
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(
      new Error('Sai định dạng file, chỉ chấp nhận file .xlsx hoặc .xls'),
      false
    );
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

class UploadController {
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).send('Không có file được tải lên.');
      }

      const message = await teacherService.uploadSchedule(req.file);
      res.status(200).send(message);
    } catch (error) {
      res.status(500).send('Đã xảy ra lỗi: ' + error.message);
    }
  }
}

module.exports = new UploadController();
