const Category = require("../Models/ProductCategoryModel");
require('dotenv').config();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ 
    cloud_name: 'dtijhcmaa', 
    api_key: '624644714628939', 
    api_secret: 'tU52wM1-XoaFD2NrHbPrkiVKZvY' 
  });
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });

exports.createCategory = catchAsyncErrors(async (req, res) => {
//   try {
//     let findCategory = await Category.findOne({ name: req.params.name });

//     if (findCategory) {
//       return res.status(409).json({ message: "Category already exists.", status: 404, data: {} });
//     } else {
//       upload.single("image")(req, res, async (err) => {
//         if (err) {
//           return res.status(400).json({ msg: err.message });
//         }
//         const fileUrl = req.file ? req.file.path : "";
//         const data = { name: req.params.name, image: fileUrl };
//         const category = await Category.create(data);
//         return res.status(200).json({ message: "Category added successfully.", status: 200, data: category });
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({ status: 500, message: "Internal server error", data: error.message });
//   }
// };
try {
  let findCategory = await Category.findOne({ name: req.params.name });
  console.log(req.params.name)
  if (findCategory) {
    res.status(409).json({ message: "category already exit.", status: 404, data: {} });
  } else {
    upload.single("image")(req, res, async (err) => {
      if (err) { return res.status(400).json({ msg: err.message }); }
      const fileUrl = req.file ? req.file.path : "";
      const data = { name: req.params.name, image: fileUrl };
      const category = await Category.create(data);
      res.status(200).json({ message: "category add successfully.", status: 200, data: category });
    })
  }

} catch (error) {
  res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
}
});
exports.getCategories = async (req, res) => {

try {
  const producyBycategory = await Category.find({ category: req.params.id });

  res.status(200).json({
    message: "get category Successfully",
    data: producyBycategory,
  });
} catch (error) {
  res.status(500).json({
    message: error.message,
  });
}
};
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res.status(404).json({ message: "Category Not Found", status: 404, data: {} });
  }
  upload.single("image")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    category.image = fileUrl || category.image;
    category.name = req.body.name;
    let update = await category.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};
exports.removeCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res.status(404).json({ message: "Category Not Found", status: 404, data: {} });
  } else {
    await Category.findByIdAndDelete(category._id);
    res.status(200).json({ message: "Category Deleted Successfully !" });
  }
};