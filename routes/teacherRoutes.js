const express = require('express');
const router = express.Router();
const teacherController = require('../app/controllers/teacherController');

router.post('/', teacherController.getTeacherSchedules);
router.get('/edit/:id',teacherController.getTeacherScheduleById);
router.put('/update/:id',teacherController.updateTeacherScheduleById);
router.patch('/delete/:id',teacherController.softDeleteTeacherScheduleById);
router.get('/deleted-all/',teacherController.getDeletedTeacherScheduleAll);
router.put('/restore/:id',teacherController.restoreTeacherScheduleById);
router.delete('/force-delete/:id',teacherController.forceDeleteTeacherScheduleById);

module.exports = router