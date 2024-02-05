const express = require('express'); 
const orderControllers = require('../Controller/orderController');

const router = express();
const authJwt = require("../middleware/authJwt");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authJwt");

router.post('/',[ authJwt.verifyToken,orderControllers.AddOrder]);
router.get('/',[ authJwt.verifyToken,orderControllers.myOrders]);
router.get('/all',[ orderControllers.allOrders]);

router.route("/:orderId").get( orderControllers.singleOrder);
router.route("/:orderId/products").get( orderControllers.orderItems);

router.route("/my/:orderId/accept").put(authJwt.verifyToken, orderControllers.acceptOrders);

router.route("/:orderId/checkout").put(authJwt.verifyToken,orderControllers.cashOnDelivery);
router.route("/:orderId/review").post(authJwt.verifyToken,orderControllers.addReview );

router.route("/prepare/:orderId").put(orderControllers.preparingOrder);
router.route("/readytodeliver/:orderId").put(authJwt.verifyToken,authorizeRoles("vendor"),orderControllers.readyOrder);
router.route("/seller/myorder").get(authJwt.verifyToken,authorizeRoles("vendor"),orderControllers.mysellerOrders);

router.route("/vendor/my/:vendorId").get(orderControllers.getOrdersForVendor);


module.exports = router;