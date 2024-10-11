const express = require('express');
const router = express.Router();
const roomController = require('../app/controllers/roomController');

// router.get('/', roomController.getAllRooms);
router.post('/', roomController.getAllRooms);
router.get('/edit/:id', roomController.findRoomById);
router.put('/update/:id',roomController.updateRoomById);
router.patch('/delete/:id',roomController.softDeleteRoomById);
router.get('/deleted-all', roomController.getAllDeleted);
router.put('/restore/:id', roomController.restoreRoomById);
router.delete('/force-delete/:id', roomController.forceDeleteRoomById);

module.exports = router;
