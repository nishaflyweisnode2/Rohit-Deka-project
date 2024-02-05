const express = require('express'); 
const incentive = require('../Controller/incentiveController');


const router = express();


router.post('/', [  incentive.addincentive]);
router.get('/', [  incentive.getincentive]);
router.put('/:id',[ incentive.updateincentive]);
router.delete('/:id',[  incentive.Deleteincentive]);

module.exports = router;