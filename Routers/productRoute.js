const express = require("express");
const upload = require("../middleware/fileUpload");
// const authJwt = require("../middleware/authJwt");
const {createProduct,createBulkProduct, getAllProduct,getVendorProducts,updateProductType,getByCategory,brand,assamspecial,recentSearch,getBySubCategory,easymeal,easybaking,productinbrand,newbydate,lowestprice,weekendspecial,getwarehouseProduct,search,getByCategorySubCategory,singleProduct, updateProduct, deleteProduct, createWishlist, removeFromWishlist, myWishlist, createProductReview, getProductReviews, deleteReview, getVendorProduct } = require("../Controller/productController");

// const { isAuthenticatedSeller, authorizeRolesSeller} = require("../middleware/authSeller");
// const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
// const auth = require("../middleware/authSeller");
const authJwt = require("../middleware/authJwt");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authJwt");
const router = express.Router();
router.route("/product/new").post( authJwt.isAdmin,createProduct);
router.route("/product/new/admin").post( authJwt.isAdmin,createProduct);

router.route("/product/new/bulk").post(createBulkProduct);


router.route("/products").get( getAllProduct);
router.route("/products/warehouse").get(  authJwt.verifyToken,authorizeRoles("warehouse"),getwarehouseProduct);
router.route("/product/single/:productId").get( singleProduct);
router.route("/product/:id").put(updateProduct);
router.route("/product/delete/:id").delete(deleteProduct);

router.route("/products/:categoryId").get(getByCategory);
router.route("/products/:subCategoryId").get(getBySubCategory);
router.route("/products/:categoryId/:subCategoryId").get(getByCategorySubCategory);

router.route("/add/wishlist/:id").post(authJwt.verifyToken, createWishlist);
router.route("/remove/wishlist/:id").put(authJwt.verifyToken, removeFromWishlist);

router.route("/wishlist/me").get(authJwt.verifyToken, myWishlist);
router.route("/review").put(authJwt.verifyToken, createProductReview);

router.route("/reviews").get(getProductReviews).delete( deleteReview);

router.route("/allproducts/search").get(authJwt.verifyToken, search);
router.route("/recent/search").get(authJwt.verifyToken, recentSearch);

router.route("/product/date").get(newbydate);
router.route("/low/price").get(lowestprice);
router.route("/easy/baking").get(easybaking);
router.route("/easy/meal").get(easymeal);
router.route("/assam/special").get(assamspecial);
router.route("/weekend/special").get(weekendspecial);
router.route("/brand").get(brand);
router.route("/brand/products/:brand").get(productinbrand);

router.route("/type/:productId").put(updateProductType);
router.route("/product/my/vendor/:vendorId").get(getVendorProducts);


module.exports = router;