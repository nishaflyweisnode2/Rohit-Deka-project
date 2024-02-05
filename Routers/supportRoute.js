const express = require('express'); 
const supports = require('../Controller/supportController');


const router = express();
const authJwt= require("../middleware/authJwt");

router.post('/', [ authJwt.verifyToken, supports.createSupport]);
router.get('/', [  supports.getAllSupport]);
router.post('/reply/:supportId',[  supports.replySupport]);

router.delete('/:id',[  supports.deleteSupport]);
module.exports = router;