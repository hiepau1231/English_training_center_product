const express = require('express');
const router = express.Router();

const scheduleController = require('../app/controllers/scheduleController');

router.get('/',scheduleController.getSchedules);
router.post('/',scheduleController.getAllSchedules);
router.get('/edit/:id',scheduleController.findScheduleByid);
router.put('/update/:id',scheduleController.updateScheduleById);
router.patch('/delete/:id',scheduleController.softDeleteScheduleById);
router.put('/restore/:id',scheduleController.restoreScheduleById);
router.get('/deleted-all/',scheduleController.getAllScheduleDeleted);
router.delete('/force-delete/:id',scheduleController.forceDeletedSchedule);



module.exports = router;