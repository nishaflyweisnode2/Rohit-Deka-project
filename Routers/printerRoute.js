const express = require('express'); 
const printerControllers = require('../Controller/printerController');

const router = express();
const upload = require("../middleware/fileUpload");
// const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const authJwt = require("../middleware/authJwt");

router.post('/',[ printerControllers.AddPrinter]);
router.get('/',[  printerControllers.getPrinter]);
router.put('/updatePrinter/:id',[  printerControllers.updatePrinter]);

router.delete('/:id',[ printerControllers.removePrinter])


module.exports = router;