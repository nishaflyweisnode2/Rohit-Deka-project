const qrcode = require('../Models/qrcodeModel')
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
exports.Addqrcode = async (req, res) => {
  try {
    let findqrcode = await qrcode.findOne({ name: req.params.name });
    console.log(req.params.name)
    if (findqrcode) {
      res.status(409).json({ message: "qrcode already exit.", status: 404, data: {} });
    } else {
      upload.single("image")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        // console.log(req.file);
        const fileUrl = req.file ? req.file.path : "";
        const data = { name: req.params.name, image: fileUrl };
        const qrcodes = await qrcode.create(data);
        res.status(200).json({ message: "qrcode add successfully.", status: 200, data: qrcodes });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.getqrcode = async (req, res) => {
  try {
    const qrcodes = await qrcode.find();
    res.status(200).json({ success: true, qrcodes: qrcodes });

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.updateqrcode = async (req, res) => {
  const { id } = req.params;
  const qrcodes = await qrcode.findById(id);
  if (!qrcodes) {
    res.status(404).json({ message: "qrcode Not Found", status: 404, data: {} });
  }
  upload.single("image")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    qrcodes.image = fileUrl || qrcodes.image;
    qrcodes.name = req.body.name;
    let update = await qrcodes.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};

exports.removeqrcode = async (req, res) => {
  const { id } = req.params;

  try {
    const foundQrcode = await qrcode.findById(id);

    if (!foundQrcode) {
      return res.status(404).json({ message: "Qrcode Not Found", status: 404, data: {} });
    }

    await qrcode.findByIdAndDelete(id);

    res.status(200).json({ message: "Qrcode Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};