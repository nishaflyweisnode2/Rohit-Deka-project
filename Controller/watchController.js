const Blog = require('../Models/watchModel')
require('dotenv').config();
const videoPattern = "[^\\s]+(.*?)\\.(mp4|avi|mov|flv|wmv)$";
// const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
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
    folder: "videos", // optional folder name in your Cloudinary account
    allowed_formats: ["mp4", "avi", "mov", "flv", "wmv"], // allowed video formats
    resource_type: "video", // specify the resource type as video
  },
});

const upload = multer({ storage: storage });
exports.AddBlog = async (req, res) => {
  try {
    let findBlog = await Blog.findOne({ name: req.params.name });
    console.log(req.params.name)
    if (findBlog) {
      res.status(409).json({ message: "Blog already exit.", status: 404, data: {} });
    } else {
      upload.single("video")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        // console.log(req.file);
        const fileUrl = req.file ? req.file.path : "";
        const data = { name: req.params.name, video: fileUrl };
        const blog = await Blog.create(data);
        res.status(200).json({ message: "Blog added successfully.", status: 200, data: blog });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ success: true, blogs: blogs });

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    res.status(404).json({ message: "Blog Not Found", status: 404, data: {} });
  }
  upload.single("video")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    blog.video = fileUrl || blog.video;
    blog.name = req.body.name;
    let update = await blog.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};

exports.removeBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    res.status(404).json({ message: "Blog Not Found", status: 404, data: {} });
  } else {
    await Blog.findByIdAndDelete(blog._id);
    res.status(200).json({ message: "Blog Deleted Successfully !" });
  }
};