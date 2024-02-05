const express = require('express'); 
const timeSlot = require('../Controller/timeSlotController');


const router = express();


router.post('/', [  timeSlot.addtimeSlot]);
router.get('/', [  timeSlot.gettimeSlot]);
router.put('/:id', [  timeSlot.updatetimeSlot]);
router.delete('/:id', [  timeSlot.deleteTimeSlot]);

module.exports = router;