const express = require("express");
const {
  registerVendor,verifyVendor,loginVendor,verifyvendorlogin,assignOrdertoDriver,getVendorDetailsById,deleteVendorDetails,getAllVendors,registerVendormail,vendorInfo,vendorDetails,getvendorsDetail,getsingleVendorProduct
} = require("../Controller/vendorController");
const authJwt = require("../middleware/authJwt");

const router = express.Router();
router.route("/vendor/register").post(registerVendor);
router.route("/vendor/verify/otp").post(verifyVendor);



router.route("/vendor/register/mail").post(registerVendormail);
router.route("/vendor/login").post(loginVendor);
router.route("/vendor/verify/login").post(verifyvendorlogin);

router.route("/vendors/all").get(getAllVendors);

router.route("/vendor/details/:id").post(vendorDetails);
router.route("/vendors/details").get(getvendorsDetail);
router.route("/vendors/delete/:id").delete(deleteVendorDetails);
router.route("/vendors/single/details/:id").get(getVendorDetailsById);



router.route("/vendorproduct/:createdBy").get(getsingleVendorProduct);
router.route("/vendorproduct/:createdBy").get(getsingleVendorProduct);

// router.route("/me").get(authJwt.verifyToken, getUserDetails);
router.route("/assign/order/:orderId").post(assignOrdertoDriver);


module.exports = router;