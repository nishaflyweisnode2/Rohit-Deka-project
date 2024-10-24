const Brand = require("../Models/brandModel");
require('dotenv').config();

const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: 'dvwecihog',
  api_key: '364881266278834',
  api_secret: '5_okbyciVx-7qFz7oP31uOpuv7Q'
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });

exports.createBrand = async (req, res) => {
  try {
    let findBrand = await Brand.findOne({ name: req.params.name });
    console.log(req.params.name)
    if (findBrand) {
      res.status(409).json({ message: "Brand already exit.", status: 404, data: {} });
    } else {
      upload.single("image")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        const fileUrl = req.file ? req.file.path : "";
        const data = { name: req.params.name, image: fileUrl };
        const brand = await Brand.create(data);
        res.status(200).json({ message: "Brand add successfully.", status: 200, data: brand });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};
exports.getBrand = async (req, res) => {
  const Brands = await Brand.find({});
  res.status(201).json({ success: true, Brands, });
};

exports.removeBrand = async (req, res) => {
  try {
    const brandId = req.params.id;

    // Check if the brand exists
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    // Perform the delete operation
    await Brand.findByIdAndDelete(brandId);

    res.status(200).json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
