const express = require("express");
const announ = require("../Controller/announController");

const auth = require("../middleware/authVendor");
const authJwt = require("../middleware/authJwt");
// const authorizeRoles =  require("../middleware/authJwt");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authJwt");
const router = express();

router.post("/", [announ.addannoun]);
router.get("/", [announ.getannoun]);
router.put("/:id", [announ.updateannoun]);
router.delete("/:id", [announ.Deleteannoun]);

module.exports = router;
