const express = require('express'); 
const cancelOrderControllers = require('../Controller/cancelOrderController');

const router = express();


router.post('/',[ cancelOrderControllers.AddcancelOrder]);
router.get('/',[  cancelOrderControllers.getRejectionReasons]);
router.put('/update/:id',[  cancelOrderControllers.updateRejectionReason]);

router.delete('/delete/:id',[ cancelOrderControllers.deleteRejectionReason])


module.exports = router;