const User = require("../Models/userModel");
const dotenv = require("dotenv");
require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const router = express.Router();
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const config = require('config');
// const multer = require('multer');
const randomatic = require('randomatic');
const cloudinary = require('cloudinary').v2;
// const twilio = require('twilio');
const bcrypt = require("bcryptjs");
const twilio = require('twilio');

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

const accountSid = 'AC1e5267b05a62ae1b6d1252802b8b1efa';
const authToken = 'af7ff1944a559576f88b5f5da4926677';
const twilioClient = new twilio(accountSid, authToken);
const twilioPhoneNumber = '+16592877133';


  exports.registerUser = async (req, res) => {
    try {
        const mobileNumber = req.body.mobileNumber;
        const existingUser = await User.findOne({ mobileNumber, role: 'user' });
        if (existingUser) {
          return res.status(400).json({ error: 'User with this mobile number already exists' });
        }
    
        // Generate OTP
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    
        // Save the generated OTP to the user's record in the database
        const user = await User.findOneAndUpdate(
          { mobileNumber },
          { otp },
          { new: true, upsert: true }
        );
    
        await twilioClient.messages.create({
          body: `Your OTP is: ${otp}`,
          to: `+91${mobileNumber}`,
          from: twilioPhoneNumber,
        });
    
        res.json({ message: 'OTP sent successfully',user });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };

    // exports.registerAdmin = async (req, res) => {
    //   try {
    //       const mobileNumber = req.body.mobileNumber;
    //       const existingAdmin = await User.findOne({ mobileNumber, role: 'admin' });
    //       if (existingAdmin) {
    //         return res.status(400).json({ error: 'Admin with this mobile number already exists' });
    //       }
      
    //       // Generate OTP
    //       const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    //   console.log(otp);
    //       // Save the generated OTP to the user's record in the database
    
    //       const user = await User.findOneAndUpdate(
    //         { mobileNumber, role: 'admin' },
    //         { $set: { otp } },
    //         { new: true, upsert: true }
    //       );
      
    //       // Send OTP via SMS using Twilio
    //       // ...
      
    //       res.json({ message: 'OTP sent successfully' });
    //     } catch (error) {
    //       console.log(error);
    //       res.status(500).json({ error: 'Internal Server Error' });
    //     }
    //   };
      exports.registerAdmin = async (req, res) => {
        console.log("hi2");
        const { phone, email } = req.body;
        try {
                req.body.email = email.split(" ").join("").toLowerCase();
                let user = await User.findOne({ $and: [{ $or: [{ email: req.body.email }, { phone: phone }] }], role: "admin" });
                if (!user) {
                        if (req.body.password == req.body.confirmPassword) {
                                req.body.password = bcrypt.hashSync(req.body.password, 8);
                                req.body.role = "admin";
                                const userCreate = await User.create(req.body);
                                res.status(200).send({ status: 200, message: "registered successfully ", data: userCreate, });
                        } else {
                                res.status(201).send({ status: 201, message: "Password not matched", data: [] });
                        }
                } else {
                        res.status(409).send({ status: 409, message: "Already Exist", data: [] });
                }
        } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server error" });
        }
      };

    exports.verifyOtp = async (req, res) => {

        try {
            const mobileNumber = req.body.mobileNumber;
            const otp = req.body.otp;
        // console.log(mobileNumber);
        // console.log(otp);
            // Fetch the user's record from the database based on the mobile number
            const user = await User.findOne({ mobileNumber });
        // console.log(user);
            if (!user) {
              // User not found, handle accordingly
              return res.status(404).json({ error: 'User not found' });
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
        res.json({ message: 'OTP verification successful.', token,user });
      } else {
        res.status(401).json({ error: 'User not verified' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  exports.verifyAdmin = async (req, res) => {

    try {
        const mobileNumber = req.body.mobileNumber;
        const otp = req.body.otp;
        // Fetch the user's record from the database based on the mobile number
        const user = await User.findOne({ mobileNumber ,role: 'admin' });
        if (!user) {
          // User not found, handle accordingly
          return res.status(404).json({ error: 'Admin not found' });
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
    res.status(401).json({ error: 'Admin not verified' });
  }
} catch (error) {
  console.log(error);
  res.status(500).json({ error: 'Internal Server Error' });
}
};

exports.loginUser = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Check if the user exists in the database
    let user = await User.findOne({ mobileNumber });

    if (!user) {
      // If the user is not found, register them
      const otp = randomatic('0', 4); // Generate a 4-digit OTP
      user = new User({
        mobileNumber,
        otp,
      });

      // Save the user to the database
      await user.save();

      // Send OTP to the user via SMS or any other preferred method
      // Example: SMSService.sendOTP(mobileNumber, otp);

      res.json({ message: 'OTP generated and sent to the user', user });
    } else {
      // If the user already exists, generate a new OTP
      const otp = randomatic('0', 4); // Generate a new 4-digit OTP
      user.otp = otp;
      user.isVerified = false;

      // Save the updated OTP to the user's record in the database
      await user.save();

      // Send the new OTP to the user via SMS or any other preferred method
      // Example: SMSService.sendOTP(mobileNumber, otp);

      res.json({ message: 'New OTP generated and sent to the user', user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
      // exports.loginAdmin = async (req, res) => {
    
      //   try {
      //     const { mobileNumber } = req.body;
      
      //     // Check if the user exists in the database
      //     const user = await User.findOne({ mobileNumber , role:'admin'});
      
      //     if (!user) {
      //       return res.status(404).json({ error: 'Admin not found' });
      //     }
      
      //     // Generate OTP
      //     const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
      // console.log(otp);
      //     // Save the OTP to the user's record in the database
      //     user.otp = otp;
      //     await user.save();
      
      //     // Send the OTP to the user (e.g., via SMS, email, etc.)
      //     // ...
      
      //     res.json({ message: 'OTP generated and sent to the admin' });
      //   } catch (error) {
      //     console.log(error);
      //     res.status(500).json({ error: 'Internal Server Error' });
      //   }
      // };

      exports.verifyOtplogin = async (req, res) => {
        try {
            const { mobileNumber, otp } = req.body;
        
            // Find the user based on the mobile number
            const user = await User.findOne({ mobileNumber });
        
            if (!user) {
              return res.status(404).json({ error: 'User not found' });
            }
        
            // Check if the OTP matches
            if (otp === user.otp) {
              // Generate a JWT token
            //   const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'));
              const token = jwt.sign({ id: user._id }, "node5flyweis");
              // Clear the OTP from the user's record in the database
              user.otp = undefined;
              user.isVerified = true;
              await user.save();
        
              res.json({ message: 'OTP verification successful.',user, token });
            } else {
              res.status(401).json({ error: 'Invalid OTP' });
            }
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        };
        
        exports.verifyadminlogin = async (req, res) => {
          try {
              const { mobileNumber, otp } = req.body;
          
              // Find the user based on the mobile number
              const user = await User.findOne({ mobileNumber, role:'admin' });
          
              if (!user) {
                return res.status(404).json({ error: 'User not found' });
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
          

        exports.getUserDetails = async (req, res) => {
          try {
            const user = await User.findById(req.user._id);
            if (!user) {
              res.status(404).send({ status: 404, message: "user not found ", data: {}, });
            } else {
              res.status(200).send({ status: 200, message: "get profile ", data: user, });
            }
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
          }
        };

        exports.updateProfile = async (req, res) => {
          const { id } = req.params;
          const { name, email, address } = req.body;
        
          try {
            let image;
            if (req.file) {
              image = req.file.path;
            }
        
            // Find the user by ID
            const user = await User.findById(id);
        
            if (!user) {
              return res.status(404).json({ error: 'User not found' });
            }
        
            // Update the user's profile fields
            user.name = name;
            user.email = email;
            user.address = address;
            user.profilePicture = image; // Fix: Use '=' instead of ':'
        
            // Save the updated user profile
            await user.save();
        
            res.json({ message: 'User profile updated successfully', user });
          } catch (error) {
            console.error(error); // Log the error for debugging purposes
            res.status(500).json({ error: 'Internal server error' });
          }
        };
        


exports.loginAdmin = async (req, res) => {
  console.log("hi");
  try {
          const { email, password } = req.body;
          const user = await User.findOne({ email: email, role: "admin" });
          console.log(user);
          if (!user) {
                  return res.status(404).send({ status: 404, message: "user not found ! not registered" });
          }
          const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).send({ message: "Wrong password" });}
          // const accessToken = jwt.sign({ id: user._id }, authConfig.secret, { expiresIn: authConfig.accessTokenTime, });
          const token = jwt.sign({ id: user._id }, "node5flyweis");
          let obj = {
                  _id: user._id,
                  phone: user.phone,
                  // otpVerification: user.otpVerification,
                  // accessToken: accessToken
                  token:token
          }
          res.status(200).send({ status: 200, message: "logged in successfully", data: obj });
  } catch (error) {
          console.error(error);
          res.status(500).send({ status: 500, message: "Server error" + error.message });
  }
};
exports.deleteUser = async (req, res) => {

try {
  const userId = req.params.userId;

  // Find the user by ID and delete it
  const deletedUser = await User.findByIdAndDelete(userId);

  // Check if the user was found and deleted
  if (!deletedUser) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  // Send a success response with the deleted user details
  res.status(200).json({ success: true, message: 'User deleted successfully', deletedUser });
} catch (error) {
  // Handle errors, and send an error response
  console.error('Error deleting user:', error);
  res.status(500).json({ success: false, error: 'Internal server error' });
}
};

exports.allUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};