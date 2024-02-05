const Subcategory = require("../Models/ProductSubcategoryModel");
require('dotenv').config();

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

exports.createSubcategory = async (req, res) => {
    try {
        let findSubcategory = await Subcategory.findOne({ name: req.params.name });
        console.log(req.params.name)
        if (findSubcategory) {
          res.status(409).json({ message: "Subcategory already exit.", status: 404, data: {} });
        } else {
          upload.single("image")(req, res, async (err) => {
            if (err) { return res.status(400).json({ msg: err.message }); }
            const fileUrl = req.file ? req.file.path : "";
            const data = { name: req.params.name,categoryId:req.body.categoryId, image: fileUrl };
            const subcategory = await Subcategory.create(data);
            res.status(200).json({ message: "Subcategory add successfully.", status: 200, data: subcategory });
          })
        }
    
      } catch (error) {
        res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
      }
    };
exports.getSubcategories = async (req, res) => {
  const subcategories = await Subcategory.find({}).populate("categoryId");
  res.status(201).json({ success: true, subcategories, });
};
exports.updateSubcategory = async (req, res) => {
  const { id } = req.params;
  const subcategory = await Subcategory.findById(id);
  if (!Subcategory) {
    res.status(404).json({ message: "Subcategory Not Found", status: 404, data: {} });
  }
  upload.single("image")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    subcategory.image = fileUrl || subcategory.image;
    subcategory.name = req.body.name;
    subcategory.categoryId = req.body.categoryId;
    let update = await subcategory.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};
exports.removeSubcategory = async (req, res) => {
  const { id } = req.params;
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    res.status(404).json({ message: "Subcategory Not Found", status: 404, data: {} });
  } else {
    await Subcategory.findByIdAndDelete(subcategory._id);
    res.status(200).json({ message: "Subcategory Deleted Successfully !" });
  }
};

exports.getbyCategory = async (req, res) => {
try {
  const categoryId = req.params.categoryId;

  // Find subcategories that belong to the specified category
  const subcategories = await Subcategory.find({ categoryId: categoryId });

  res.status(200).json({ success: true, subcategories });
} catch (error) {
  console.error(error);
  res.status(500).json({ success: false, error: 'Internal server error' });
}
};