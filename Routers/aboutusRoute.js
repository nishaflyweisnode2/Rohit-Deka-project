const express = require('express'); 
const aboutus = require('../Controller/aboutusController');

const auth = require("../middleware/authVendor");
const authJwt= require("../middleware/authJwt");
// const authorizeRoles =  require("../middleware/authJwt");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authJwt");
const router = express();


router.post('/', [ aboutus.addaboutus]);
router.get('/', [aboutus.getaboutus]);
router.put('/:id',[ aboutus.updateaboutus]);
router.delete('/:id',[  aboutus.DeleteAboutus]);

module.exports = router;