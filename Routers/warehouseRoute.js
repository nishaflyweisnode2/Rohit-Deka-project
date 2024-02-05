const express = require("express");
const {
    registerWarehouse,verifyWarehouse,loginWarehouse,verifywarehouselogin
} = require("../Controller/warehouseController");
const router = express.Router();
router.route("/warehouse/register").post(registerWarehouse);
router.route("/warehouse/verify/otp").post(verifyWarehouse);


router.route("/warehouse/login").post(loginWarehouse);
router.route("/warehouse/verify/login").post(verifywarehouselogin);




module.exports = router;