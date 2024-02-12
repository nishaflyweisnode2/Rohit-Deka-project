const User = require("../Models/userModel");
const vendorDetails = require("../Models/vendorDetails");
const Order = require('../Models/orderModel')

const dotenv = require("dotenv");
require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const router = express.Router();
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const config = require('config');
// const multer = require('multer');
const bcrypt = require("bcryptjs");

const twilio = require('twilio');


// const cloudinary = require('cloudinary').v2;
// const twilio = require('twilio');
const Product = require("../Models/productModel");
// Initialize Twilio client
// const twilioClient = twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
//   );
// cloudinary.config({ 
//   cloud_name: 'dtijhcmaa', 
//   api_key: '624644714628939', 
//   api_secret: 'tU52wM1-XoaFD2NrHbPrkiVKZvY' 
// });
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


const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const twilioClient = new twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.twilioPhoneNumber;


exports.registerVendor = async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber;
    const existingUser = await User.findOne({ mobileNumber, role: 'vendor' });
    if (existingUser) {
      return res.status(400).json({ error: 'Vendor with this mobile number already exists' });
    }

    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });


    const user = await User.findOneAndUpdate(
      { mobileNumber, role: 'vendor' },
      { $set: { otp } },
      { new: true, upsert: true }
    );

    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      to: `+91${mobileNumber}`,
      from: twilioPhoneNumber,
    });

    res.json({ message: 'OTP sent successfully', user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.verifyVendor = async (req, res) => {

  try {
    const mobileNumber = req.body.mobileNumber;
    const otp = req.body.otp;
    // Fetch the user's record from the database based on the mobile number
    const user = await User.findOne({ mobileNumber, role: 'vendor' });
    if (!user) {
      // User not found, handle accordingly
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Check if the provided OTP matches the one saved in the user's record
    if (user.otp !== otp) {
      // Invalid OTP, handle accordingly
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP is valid, save the user in the database
    user.isVerified = true;
    await user.save();

    // Check if the user is verified
    if (user.isVerified) {
      // Generate a JWT token
      // const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'));
      const token = jwt.sign({ id: user._id }, "node5flyweis");
      res.json({ message: 'OTP verification successful.', token });
    } else {
      res.status(401).json({ error: 'Vendor not verified' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.registerVendormail = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the given email already exists
    const existingUser = await User.findOne({ email, role: "vendor" });

    if (existingUser) {
      return res.status(409).json({ status: 409, message: "User already exists", data: {} });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create a new vendor user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: "vendor",
    });

    // Generate JWT token for authentication
    const token = jwt.sign({ id: newUser._id }, "node5flyweis");

    // Return response
    const responseData = {
      _id: newUser._id,
      token,
    };

    res.status(201).json({ status: 201, message: "Vendor registered successfully", data: responseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error" + error.message });
  }
};
exports.loginVendor = async (req, res) => {
  console.log("hi");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, role: "vendor" });
    console.log(user);
    if (!user) {
      return res.status(404).send({ status: 404, message: "user not found ! not registered" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ message: "Wrong password" });
    }
    // const accessToken = jwt.sign({ id: user._id }, authConfig.secret, { expiresIn: authConfig.accessTokenTime, });
    const token = jwt.sign({ id: user._id }, "node5flyweis");
    let obj = {
      _id: user._id,
      // otpVerification: user.otpVerification,
      // accessToken: accessToken
      token: token
    }
    res.status(200).send({ status: 200, message: "logged in successfully", data: obj, user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, message: "Server error" + error.message });
  }
};
// exports.loginVendor = async (req, res) => {

//   try {
//     const { mobileNumber } = req.body;

//     // Check if the user exists in the database
//     const user = await User.findOne({ mobileNumber , role:'vendor'});

//     if (!user) {
//       return res.status(404).json({ error: 'Vendor not found' });
//     }

//     // Generate OTP
//     const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
// console.log(otp);
//     // Save the OTP to the user's record in the database
//     user.otp = otp;
//     await user.save();

//     // Send the OTP to the user (e.g., via SMS, email, etc.)
//     // ...

//     res.json({ message: 'OTP generated and sent to the vendor',user });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

exports.verifyvendorlogin = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    // Find the user based on the mobile number
    const user = await User.findOne({ mobileNumber, role: 'vendor' });

    if (!user) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Check if the OTP matches
    if (otp === user.otp) {
      // Generate a JWT token
      //   const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'));
      const token = jwt.sign({ id: user._id }, "node5flyweis");
      // Clear the OTP from the user's record in the database
      user.otp = undefined;
      await user.save();

      res.json({ message: 'OTP verification successful.', token });
    } else {
      res.status(401).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.vendorDetails = async (req, res) => {
  try {
    // Find vendor details based on user ID
    let findData = await vendorDetails.findOne({ user: req.params.id });

    // Handle file upload
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      }

      const fileUrl = req.file ? req.file.path : '';

      // Update existing or create new vendor details
      if (findData) {
        // Update existing vendor details
        findData.storeName = req.body.storeName;
        findData.storeAddress = req.body.storeAddress;
        findData.pinCode = req.body.pinCode;
        findData.image = fileUrl;

        let update = await findData.save();
        res.status(200).json({ message: 'Data updated successfully', status: 200, data: update });
      } else {
        // Create new vendor details
        let data = {
          user: req.params.id,
          storeName: req.body.storeName,
          storeAddress: req.body.storeAddress,
          pinCode: req.body.pinCode,
          image: fileUrl
        };

        const userCreate = await vendorDetails.create(data);
        res.status(200).json({ message: 'Data created successfully', status: 200, data: userCreate });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', status: 500 });
  }
};

exports.deleteVendorDetails = async (req, res) => {
  try {
    const vendorId = req.params.id;

    // Find vendor details based on user ID
    const findData = await vendorDetails.findById(vendorId);

    if (!findData) {
      return res.status(404).json({ message: 'Vendor details not found', status: 404 });
    }

    // Delete the vendor details
    await vendorDetails.findByIdAndDelete(vendorId);

    res.status(200).json({ message: 'Vendor details deleted successfully', status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', status: 500 });
  }
};
exports.getVendorDetailsById = async (req, res) => {
  try {
    const vendorId = req.params.id;

    // Find vendor details based on vendor ID
    const vendor = await vendorDetails.findOne({ user: vendorId }).populate("user");

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.', status: 404 });
    }

    res.status(200).json({ message: 'Vendor details retrieved successfully', status: 200, data: vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', status: 500, error: error.message });
  }
};
exports.getvendorsDetail = async (req, res, next) => {
  try {
    const vendordetails = await vendorDetails.find().populate("user");
    res.json(vendordetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};
exports.getAllVendors = async (req, res, next) => {
  try {
    const vendors = await User.find({ role: 'vendor' });
    res.json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch vendors.' });
  }
};
exports.getsingleVendorProduct = async (req, res, next) => {
  const createdBy = req.params.createdBy;
  // console.log(createdBy);
  try {
    const products = await Product.find({ createdBy });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

exports.assignOrdertoDriver = async (req, res, next) => {

  try {
    const { orderId } = req.params;
    const { driverId } = req.body;

    // Check if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found', status: 404 });
    }
    // Assign the order to the driver
    order.driverId = driverId;
    order.orderStatus = "confirmed";

    await order.save();

    res.status(200).json({ message: 'Order assigned successfully', status: 200, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', status: 500, error: error.message });
  }
};