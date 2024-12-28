const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream('room_template.xlsx'));

    const response = await axios.post('http://localhost:3000/api/import/rooms', form, {
      headers: form.getHeaders()
    });

    console.log('Upload successful:', response.data);
  } catch (error) {
    console.error('Upload failed:', error.response ? error.response.data : error.message);
  }
}

testUpload();