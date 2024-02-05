const {
    createSubcategory,
    updateSubcategory,
    getSubcategories,
    removeSubcategory,
    getbyCategory
  } = require("../Controller/productSubcategory");
  const upload = require("../middleware/fileUpload");
  const authJwt = require("../middleware/authJwt");
  // const auth = require("../middleware/authSeller");
  const router = require("express").Router();
  
 router.route("/createsubategory/:name").post(createSubcategory);
  router.route("/allsubcategory").get(getSubcategories);
  router.route("/updatesubcategory/:id").put(  updateSubcategory);
  router.route("/removesubcategory/:id").delete(removeSubcategory);
  router.route("/subcategory/:categoryId").get(getbyCategory);
  
  module.exports = router;