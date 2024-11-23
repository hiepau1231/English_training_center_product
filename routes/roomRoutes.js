const express = require('express');
const router = express.Router();
const roomController = require('../app/controllers/roomController');

router.post('/info-classroom', roomController.getClassrooms);
router.get('/shift/:date/:teaching-shift',roomController.getShifts);
router.get('/classroom-name', roomController.getClassroomName);
router.get('/detail-classroom/:id/:date', roomController.findClassroomById);
router.put('/update/:id/:date', roomController.updateClassroomById);
router.patch('/delete/:id/:date', roomController.softDeleteClassroomById);
router.get('/deleted-all', roomController.getAllDeletedClassroom);
router.put('/restore/:id/:date', roomController.restoreClassroomById);
router.delete('/force-delete/:id/:date', roomController.forceDeleteClassroomById);

module.exports = router;
