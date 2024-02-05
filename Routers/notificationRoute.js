const express = require('express');
const notify = require('../Controller/notifyController')
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authJwt");

const authJwt = require("../middleware/authJwt");
const router = express();



router.post('/', authJwt.verifyToken,authorizeRoles("driver"),notify.AddNotification);
router.get('/',authJwt.verifyToken,authorizeRoles("driver"), notify.GetAllNotification);
// router.get('/get/:id', notify.GetBYNotifyID);
router.delete('/delete/:notificationId', notify.deleteNotification);


 
module.exports = router;