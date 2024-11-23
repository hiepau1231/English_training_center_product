// routes/teacherRouter.js
const express = require('express');
const uploadController = require('../app/controllers/uploadController');
const multer = require('multer');
const router = express.Router();
const upload = multer().single('schedule');

router.post('/', upload, uploadController.uploadFile);

module.exports = router;
