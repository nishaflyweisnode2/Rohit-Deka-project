const express = require('express'); 
const shift = require('../Controller/shiftController');


const router = express();


router.post('/', [  shift.addshift]);
router.get('/', [  shift.getshift]);
router.put('/:id', [  shift.updateshift]);
router.delete('/:id', [  shift.deleteshift]);

module.exports = router;