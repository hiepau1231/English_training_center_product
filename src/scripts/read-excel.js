const xlsx = require('xlsx');
const path = require('path');

function readExcel(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = xlsx.utils.sheet_to_json(worksheet);
    console.log('Excel file content:');
    console.log(json);
  } catch (err) {
    console.error('Error reading Excel file:', err);
  }
}

readExcel(path.join(__dirname, '../../room_template_new.xlsx'));