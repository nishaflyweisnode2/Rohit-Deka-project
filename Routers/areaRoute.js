const express = require('express'); 
const area = require('../Controller/areaController');


const router = express();


router.post('/', [  area.addarea]);
router.get('/', [  area.getarea]);
router.put('/:id', [  area.updatearea]);
router.delete('/:id', [  area.deletearea]);

module.exports = router;