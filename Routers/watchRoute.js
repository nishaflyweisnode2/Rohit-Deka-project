const express = require("express");
const blogControllers = require("../Controller/watchController");

const router = express();
const upload = require("../middleware/fileUpload");

router.post("/:name", [blogControllers.AddBlog]);
router.get("/", [blogControllers.getBlog]);
router.put("/updateBlog/:id", [blogControllers.updateBlog]);
router.delete("/:id", [blogControllers.removeBlog]);

module.exports = router;
