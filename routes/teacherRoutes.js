const express = require('express');
const router = express.Router();
const teacherController = require('../app/controllers/teacherController');

router.post('/', teacherController.getTeacherSchedules);
router.get('/edit/:class_id/:date', teacherController.getTeacherScheduleById);
router.put(
  '/update/:class_id/:date',
  teacherController.updateTeacherScheduleById
);
router.patch('/delete/:id/:date', teacherController.softDeleteTeacherScheduleById);
router.get('/deleted-all/', teacherController.getDeletedTeacherScheduleAll);
router.put('/restore/:id/:date', teacherController.restoreTeacherScheduleById);
router.delete(
  '/force-delete/:id',
  teacherController.forceDeleteTeacherScheduleById
);

module.exports = router;
