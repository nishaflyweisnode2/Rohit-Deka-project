const {
    createBrand,
    updateBrand,
    getBrand,
    removeBrand,
  } = require("../Controller/brandController");
  const upload = require("../middleware/fileUpload");
  const authJwt = require("../middleware/authJwt");
  // const auth = require("../middleware/authSeller");
  const router = require("express").Router();
  
  router.route("/create/:name").post(  createBrand);
  router.route("/allBrand").get(  getBrand);
//   router.route("/updateBrand/:id").put(  updateCategory);
  router.route("/removeBrand/:id").delete( removeBrand);
  
  module.exports = router;