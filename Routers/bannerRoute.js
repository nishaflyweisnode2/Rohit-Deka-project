const express = require('express'); 
const bannerControllers = require('../Controller/bannerController');

const router = express();
const upload = require("../middleware/fileUpload");
// const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const authJwt = require("../middleware/authJwt");

router.post('/:name',[ bannerControllers.AddBanner]);
router.get('/',[  bannerControllers.getBanner]);
router.put('/updateBanner/:id',[  bannerControllers.updateBanner]);

router.delete('/:id',[ bannerControllers.removeBanner])


module.exports = router;