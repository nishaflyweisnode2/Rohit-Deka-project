const express = require('express'); 
const couponControllers = require('../Controller/couponController');

const router = express();
const authJwt = require("../middleware/authJwt");

router.post('/',[ couponControllers.AddCoupon]);
router.get('/',[  couponControllers.getCoupon]);
router.put('/updatecoupon/:couponId',[  couponControllers.updateCoupon]);

router.delete('/:couponId',[ couponControllers.deleteCoupon])


module.exports = router;