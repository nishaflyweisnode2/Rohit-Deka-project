const express = require('express'); 
const time = require('../Controller/timeController');


const router = express();


router.post('/', [  time.addtime]);
router.get('/', [  time.gettime]);
router.put('/:id', [  time.updatetime]);
router.delete('/:id', [  time.deletetime]);

module.exports = router;