const xlsx = require('xlsx');

function createRoomTemplate() {
  const data = [
    {
      'Room Number': 'P001',
      'Capacity': 30,
      'Type': 'Phong Online',
      'Status': false
    },
    {
      'Room Number': 'P002',
      'Capacity': 25,
      'Type': 'Phong Ly Thuyet',
      'Status': true
    }
  ];

  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Rooms');
  xlsx.writeFile(workbook, 'room_template_new.xlsx');
}

createRoomTemplate();