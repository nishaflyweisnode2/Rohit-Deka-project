const express = require('express'); 
const workLogControllers = require('../Controller/workLogController');

const router = express();
const authJwt = require("../middleware/authJwt");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authJwt");

router.post('/start',[authJwt.verifyToken,authorizeRoles("driver"), workLogControllers.startDuty]);
router.post('/end',[authJwt.verifyToken,authorizeRoles("driver"), workLogControllers.endDuty]);

router.get('/get',[authJwt.verifyToken,authorizeRoles("driver"), workLogControllers.getWorkLog]);
router.get('/get/all',[ workLogControllers.getAllWorkLogs]);
router.get('/get/:deliveryBoyId',[ workLogControllers.getWorkLogsByDeliveryBoyId]);

module.exports = router;