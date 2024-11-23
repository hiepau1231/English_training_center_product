const XLSX = require('xlsx');
const Teacher = require('./app/models/teacherModel'); // Đường dẫn tới mô hình Teacher trong dự án của bạn

// Hàm tách tên giáo viên từ chuỗi
function splitTeacherNames(teacherString) {
  if (!teacherString || typeof teacherString !== 'string') {
    return []; // Trả về mảng rỗng nếu chuỗi không hợp lệ
  }

  // Tách chuỗi bằng ký tự " - " và loại bỏ khoảng trắng thừa
  const teacherNames = teacherString.split(' - ').map((name) => name.trim());

  // Loại bỏ các phần tử rỗng hoặc không hợp lệ
  return teacherNames.filter((name) => name.length > 0);
}

// Hàm xử lý file Excel và thêm giáo viên vào cơ sở dữ liệu
const processExcelFile = async (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Đọc sheet đầu tiên
  const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Duyệt qua từng hàng trong file Excel
  for (const row of worksheet) {
    // Lấy giá trị của cột "CM Chính"
    const cmChinh = row['CM chính'];
    console.log(`Giá trị cột CM Chính: ${cmChinh}`);

    // Tách các tên giáo viên từ cột "CM Chính"
    const teacherNames = splitTeacherNames(cmChinh);
    console.log(`Tên giáo viên tách ra:`, teacherNames);

    // Xử lý từng giáo viên, thêm vào cơ sở dữ liệu nếu không tồn tại
    for (const teacherName of teacherNames) {
      try {
        // Kiểm tra xem giáo viên đã tồn tại chưa
        const existingTeacher = await Teacher.findOne({
          where: { teacher_name: teacherName },
        });

        if (!existingTeacher) {
          // Thêm giáo viên vào cơ sở dữ liệu nếu chưa tồn tại
          await Teacher.create({
            teacher_name: teacherName,
          });
          console.log(`Thêm giáo viên: ${teacherName}`);
        } else {
          console.log(`Giáo viên đã tồn tại: ${teacherName}`);
        }
      } catch (error) {
        console.error(`Lỗi khi thêm giáo viên: ${teacherName}`, error);
      }
    }
  }
};

const filePath =
  'D:/English_training_center_product/uploads/bao cao lich hoc.xlsx'; // Đường dẫn tới file Excel của bạn
processExcelFile(filePath);
