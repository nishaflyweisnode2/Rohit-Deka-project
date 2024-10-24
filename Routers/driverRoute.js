const express = require("express");
const {
  registerDriver, verifyDriver, loginDetail, loginDriver, activeOrder, addBonus, verifydriverlogin, weeklyEarning, todayEarning, getsingledriverDetail, driverDetails, shiftDetails, pendingOrders, orderOTP, rejectOrder, myrejectOrders, mydeliveredOrders, getdriverDetail, verifyorderOTP, orderChecked, driverProfile, orderPicked, acceptOrder, resendOtp, updateBankDetails, getDocuments, getBankDetails, updateDocument, orderDelivered, allOrders
} = require("../Controller/driverController");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: 'dvwecihog',
  api_key: '364881266278834',
  api_secret: '5_okbyciVx-7qFz7oP31uOpuv7Q'
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, params: { folder: "images/image", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], },
});
const upload = multer({ storage: storage });
var cpUpload = upload.fields([{ name: 'frontPass', maxCount: 1 }, { name: 'frontPan', maxCount: 1 }, { name: 'drive', maxCount: 1 }, { name: 'aad', maxCount: 1 }, { name: 'pic', maxCount: 1 },]);

const authJwt = require("../middleware/authJwt");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authJwt");
const router = express.Router();

router.route("/driver/register").post(registerDriver);
router.route("/driver/verify/otp").post(verifyDriver);

router.route("/driver/login").post(loginDriver);
router.route("/driver/verify/login").post(verifydriverlogin);
router.route("/resend/otp").post(resendOtp);


router.route("/driver/details/:id").put(driverDetails);
router.route("/driver/shift/details/:id").put(shiftDetails);

router.route("/driver/details").get(getdriverDetail);
router.route("/driver/details/single/:id").get(getsingledriverDetail);

router.route("/driver/profile").get(authJwt.verifyToken, authorizeRoles("driver"), driverProfile);


router.route("/updateBankDetails/:id").post(updateBankDetails);
router.route("/get/BankDetails/:userId").get(getBankDetails);

router.route("/driver/updateDocument/:id").put(cpUpload, updateDocument);
router.route("/get/documents/:userId").get(getDocuments);

router.get('/driver/all', [authJwt.verifyToken], allOrders);
router.route("/driver/pending/orders").get(authJwt.verifyToken, authorizeRoles("driver"), pendingOrders);
router.route("/new/my/order/:orderId/accept").put(authJwt.verifyToken, authorizeRoles("driver"), acceptOrder);
router.route("/order/:orderId/picked").put(authJwt.verifyToken, authorizeRoles("driver"), orderPicked);
router.route("/order/:orderId/checked").put(authJwt.verifyToken, authorizeRoles("driver"), orderChecked);
router.route("/order/:orderId/delivered").put(authJwt.verifyToken, authorizeRoles("driver"), orderDelivered);
router.route("/order/:orderId/reject").put(authJwt.verifyToken, authorizeRoles("driver"), rejectOrder);
router.route("/order/reject").get(authJwt.verifyToken, authorizeRoles("driver"), myrejectOrders);
router.route("/order/delivered").get(authJwt.verifyToken, authorizeRoles("driver"), mydeliveredOrders);

router.route("/sendotp/:orderId").post(authJwt.verifyToken, authorizeRoles("driver"), orderOTP);
router.route("/verifyotp/:orderId").post(authJwt.verifyToken, authorizeRoles("driver"), verifyorderOTP);

router.route("/today/earn").get(authJwt.verifyToken, authorizeRoles("driver"), todayEarning);
router.route("/weekly/earn").get(authJwt.verifyToken, authorizeRoles("driver"), weeklyEarning);

router.route("/activeOrder/:driverId").get(activeOrder);

router.route("/loginDetail/:driverId").get(loginDetail);
router.route("/add/bonus/:historyId").put(addBonus);


module.exports = router;