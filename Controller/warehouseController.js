const User = require("../Models/userModel");
const warehouseDetails = require("../Models/warehouseDetails"); 
const dotenv = require("dotenv");
require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const router = express.Router();
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const config = require('config');
// const multer = require('multer');
const cloudinary = require('cloudinary').v2;
// const twilio = require('twilio');

// Initialize Twilio client
// const twilioClient = twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
//   );
cloudinary.config({ 
  cloud_name: 'dtijhcmaa', 
  api_key: '624644714628939', 
  api_secret: 'tU52wM1-XoaFD2NrHbPrkiVKZvY' 
});
  exports.registerWarehouse = async (req, res) => {
    try {
        const mobileNumber = req.body.mobileNumber;
        const existingUser = await User.findOne({ mobileNumber, role: 'warehouse' });
        if (existingUser) {
          return res.status(400).json({ error: 'Warehouse with this mobile number already exists' });
        }
    
        // Generate OTP
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    
        // Save the generated OTP to the user's record in the database
      
        const user = await User.findOneAndUpdate(
          { mobileNumber, role: 'warehouse' },
          { $set: { otp } },
          { new: true, upsert: true }
        );
    
        // Send OTP via SMS using Twilio
        // ...
    
        res.json({ message: 'OTP sent successfully' });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };


    exports.verifyWarehouse = async (req, res) => {

        try {
            const mobileNumber = req.body.mobileNumber;
            const otp = req.body.otp;
            // Fetch the user's record from the database based on the mobile number
            const user = await User.findOne({ mobileNumber ,role: 'warehouse' });
            if (!user) {
              // User not found, handle accordingly
              return res.status(404).json({ error: 'Warehouse not found' });
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
        res.status(401).json({ error: 'Warehouse not verified' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    };

    exports.loginWarehouse = async (req, res) => {
    
        try {
          const { mobileNumber } = req.body;
      
          // Check if the user exists in the database
          const user = await User.findOne({ mobileNumber , role:'warehouse'});
      
          if (!user) {
            return res.status(404).json({ error: 'Warehouse not found' });
          }
      
          // Generate OTP
          const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
      console.log(otp);
          // Save the OTP to the user's record in the database
          user.otp = otp;
          await user.save();
      
          // Send the OTP to the user (e.g., via SMS, email, etc.)
          // ...
      
          res.json({ message: 'OTP generated and sent to the warehouse' });
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };


      exports.verifywarehouselogin = async (req, res) => {
        try {
            const { mobileNumber, otp } = req.body;
        
            // Find the user based on the mobile number
            const user = await User.findOne({ mobileNumber, role:'warehouse' });
        
            if (!user) {
              return res.status(404).json({ error: 'Warehouse not found' });
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
      
      
        
      