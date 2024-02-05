const express = require("express");
const {
  registerUser, loginUser,registerAdmin,verifyAdmin,deleteUser, allUser,loginAdmin,logout,verifyadminlogin, getUserDetails, verifyOtp,verifyOtplogin,updateProfile
} = require("../Controller/userController");
const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });
const authJwt = require("../middleware/authJwt");
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/verify/otp").post(verifyOtp);

router.route("/admin").post(registerAdmin);
router.route("/admin/otp").post(verifyAdmin);

router.route("/login").post(loginUser);
router.route("/verify/login").post(verifyOtplogin);

router.route("/admin/login").post(loginAdmin);
router.route("/admin/verify/login").post(verifyadminlogin);

router.route("/me").get(authJwt.verifyToken, getUserDetails);
router.route("/user/:id").put( upload.single('profilePicture'),updateProfile);


router.route("/delete/user/:userId").delete( deleteUser);
router.route("/get/user").get( allUser);

module.exports = router;