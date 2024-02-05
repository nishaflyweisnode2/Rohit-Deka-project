const Printer = require('../Models/printerModel')
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

exports.AddPrinter = async (req, res) => {
    try {
      let findPrinter = await Printer.findOne({ name: req.params.name });
      console.log(req.params.name)
      if (findPrinter) {
        res.status(409).json({ message: "Printer already exit.", status: 404, data: {} });
      } else {
        upload.single("image")(req, res, async (err) => {
          if (err) { return res.status(400).json({ msg: err.message }); }
          // console.log(req.file);
          const fileUrl = req.file ? req.file.path : "";
          const data = { name: req.body.name,locationType:req.body.locationType,addressLine1:req.body.addressLine1,city:req.body.city,state:req.body.state,postalCode:req.body.postalCode,paperSize:req.body.paperSize,numberOfCopies:req.body.numberOfCopies, printType:req.body.printType ,image: fileUrl };
          const printer = await Printer.create(data);
          res.status(200).json({ message: "Banner add successfully.", status: 200, data: printer });
        })
      }
  
    } catch (error) {
      res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
    }
  };

  exports.getPrinter = async (req, res) => {
    try {
      const printers = await Printer.find();
      res.status(200).json({ success: true, printers: printers });
  
    } catch (error) {
      res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
    }
  };

  exports.updatePrinter = async (req, res) => {
    const { id } = req.params;
    const printer = await Printer.findById(id);
    if (!printer) {
      res.status(404).json({ message: "Printer Not Found", status: 404, data: {} });
    }
    upload.single("image")(req, res, async (err) => {
      if (err) { return res.status(400).json({ msg: err.message }); }
      const fileUrl = req.file ? req.file.path : "";
      printer.image = fileUrl || printer.image;
      printer.name = req.body.name,
      printer.locationType=req.body.locationType,
      printer.addressLine1=req.body.addressLine1,
      printer.city=req.body.city,
      printer.state=req.body.state,
      printer.postalCode=req.body.postalCode,
      printer.paperSize=req.body.paperSize,
      printer.numberOfCopies=req.body.numberOfCopies, 
      printer.printType=req.body.printType;
      let update = await printer.save();
      res.status(200).json({ message: "Updated Successfully", data: update });
    })
  };

  exports.removePrinter = async (req, res) => {
    const { id } = req.params;
    const printer = await Printer.findById(id);
    if (!printer) {
      res.status(404).json({ message: "Printer Not Found", status: 404, data: {} });
    } else {
      await Printer.findByIdAndDelete(printer._id);
      res.status(200).json({ message: "Printer Deleted Successfully !" });
    }
  };