const express = require('express'); 
const qrcodeControllers = require('../Controller/qrcodeController');

const router = express();
const upload = require("../middleware/fileUpload");
// const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const authJwt = require("../middleware/authJwt");

router.post('/:name',[ qrcodeControllers.Addqrcode]);
router.get('/',[  qrcodeControllers.getqrcode]);
router.put('/updateqrcode/:id',[  qrcodeControllers.updateqrcode]);

router.delete('/:id',[ qrcodeControllers.removeqrcode])


module.exports = router;