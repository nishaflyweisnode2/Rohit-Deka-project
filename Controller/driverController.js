const User = require("../Models/userModel");
const DriverDetails = require("../Models/driverDetails");

const DriverEarningHistory = require("../Models/earningHistory");

const DailyIncentive = require("../Models/incentiveModel");
// const moment = require('moment');

const dotenv = require("dotenv");
require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const router = express.Router();
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const config = require("config");
const randomatic = require("randomatic");
const WorkLog = require('../Models/workLogModel');
const twilio = require('twilio');


const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const twilioClient = new twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.twilioPhoneNumber;


// const multer = require('multer');
const cloudinary = require("cloudinary").v2;
// const twilio = require('twilio');
const Product = require("../Models/productModel");
const bankDetails = require("../Models/bankDetails");
const Order = require("../Models/orderModel");
// Initialize Twilio client
// const twilioClient = twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
//   );
cloudinary.config({
  cloud_name: "dtijhcmaa",
  api_key: "624644714628939",
  api_secret: "tU52wM1-XoaFD2NrHbPrkiVKZvY",
});
exports.registerDriver = async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber;
    const language = req.body.language;

    const email = req.body.email;

    const existingUser = await User.findOne({ mobileNumber, role: "driver" });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Driver with this mobile number already exists" });
    }

    // Generate OTP
    const otp = randomatic("0", 4); // Generate a 4-digit OTP

    // Save the generated OTP to the user's record in the database

    const user = await User.findOneAndUpdate(
      { mobileNumber, role: "driver", language: language, email: email },
      { $set: { otp } },
      { new: true, upsert: true }
    );

    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      to: `+91${mobileNumber}`,
      from: twilioPhoneNumber,
    });

    res.json({ message: "OTP sent successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifyDriver = async (req, res) => {
  try {
    const mobileNumber = req.body.mobileNumber;
    const otp = req.body.otp;
    // Fetch the user's record from the database based on the mobile number
    const user = await User.findOne({ mobileNumber, role: "driver" });
    if (!user) {
      // User not found, handle accordingly
      return res.status(404).json({ error: "Driver not found" });
    }

    // Check if the provided OTP matches the one saved in the user's record
    if (user.otp !== otp) {
      // Invalid OTP, handle accordingly
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP is valid, save the user in the database
    user.isVerified = true;
    await user.save();

    // Check if the user is verified
    if (user.isVerified) {
      // Generate a JWT token
      // const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'));
      const token = jwt.sign({ id: user._id }, "node5flyweis");
      res.json({ message: "OTP verification successful.", token });
    } else {
      res.status(401).json({ error: "Driver not verified" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.driverDetails = async (req, res) => {

  try {
    let user = await User.findById({ _id: req.params.id });

    if (!user) {
      res.status(404).send({ message: "Data not found", status: 404, data: [] });
    } else {
      let findData = await DriverDetails.findOne({ user: user._id });

      let data = {
        user: user._id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        door: req.body.door,
        street: req.body.street,
        city: req.body.city,
        pincode: req.body.pincode,
        landmark: req.body.landmark,
        gender: req.body.gender,
        location: {
          type: req.body.locationType || 'Point',
          coordinates: req.body.coordinates || [0, 0],
        },
      };

      if (findData) {
        let update = await DriverDetails.findByIdAndUpdate(
          { _id: findData._id },
          data,
          { new: true }
        );

        if (update) {
          res.status(200).send({
            message: "Data updated successfully",
            status: 200,
            data: update,
          });
        }
      } else {
        const userCreate = await driverDetails.create(data);
        res.status(200).send({
          message: "Data created successfully",
          status: 200,
          data: userCreate,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", status: 500 });
  }
};

exports.shiftDetails = async (req, res) => {
  try {
    let user = await User.findById({ _id: req.params.id });
    if (!user) {
      res
        .status(404)
        .send({ message: "Data not found", status: 404, data: [] });
    } else {
      let findData = await driverDetails.findOne({ user: user._id });
      if (findData) {
        let data = {
          user: user._id,
          shift: req.body.shift,
          area: req.body.area,
          time: req.body.time,
        };
        let update = await driverDetails.findByIdAndUpdate(
          { _id: findData._id },
          { data },
          { new: true }
        );
        if (update) {
          res.status(200).send({
            message: "Data update successfully",
            status: 200,
            data: update,
          });
        }
      } else {
        let data = {
          user: user._id,
          shift: req.body.shift,
          area: req.body.area,
          time: req.body.time,
        };
        const userCreate = await driverDetails.create(data);
        res.status(200).send({
          message: "Data create successfully",
          status: 200,
          data: userCreate,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", status: 500 });
  }
};
exports.loginDriver = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ mobileNumber, role: "driver" });

    if (!user) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Generate OTP
    const otp = randomatic("0", 4); // Generate a 4-digit OTP

    const isVerified = false;
    console.log(otp);
    // Save the OTP to the user's record in the database
    user.otp = otp;
    await user.save();

    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      to: `+91${mobileNumber}`,
      from: twilioPhoneNumber,
    });

    res.json({ message: "OTP generated and sent to the Driver", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifydriverlogin = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    // Find the user based on the mobile number
    const user = await User.findOne({ mobileNumber, role: "driver" });

    if (!user) {
      return res.status(404).json({ error: "driver not found" });
    }

    // Check if the OTP matches
    if (otp === user.otp) {
      // Generate a JWT token
      //   const token = jwt.sign({ userId: user._id }, config.get('jwtSecret'));
      const token = jwt.sign({ id: user._id }, "node5flyweis");
      // Clear the OTP from the user's record in the database
      user.isVerified = true;
      user.otp = undefined;
      await user.save();

      res.json({ message: "OTP verification successful.", token, user });
    } else {
      res.status(401).json({ error: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ mobileNumber, role: "driver" });

    if (!user) {
      return res.status(404).json({ error: "Driver not found" });
    }
    const otp = randomatic("0", 4); // Generate a 4-digit OTP

    const isVerified = false;
    const updated = await User.findOneAndUpdate(
      { _id: user._id },
      { otp, isVerified },
      { new: true }
    );
    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      to: `+91${mobileNumber}`,
      from: twilioPhoneNumber,
    });
    
    res.status(200).send({ message: "OTP resent", otp: otp });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" + error.message });
  }
};

exports.getdriverDetail = async (req, res, next) => {
  try {
    const driverdetails = await driverDetails.find().populate("user");
    res.json(driverdetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
};

exports.getsingledriverDetail = async (req, res, next) => {
  const driverId = req.params.id;

  try {
    const driverDetail = await driverDetails.findOne({ user: driverId }).populate('user').populate('shift').populate('area').populate('time');

    if (!driverDetail) {
      return res.status(404).json({ error: 'Driver not found.' });
    }

    res.json(driverDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch driver detail.' });
  }
};

exports.driverProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const detail = await DriverDetails.findOne({ user: req.user._id });

    if (!user) {
      res.status(404).send({ status: 404, message: "User not found", data: {} });
    } else {
      res.status(200).send({ status: 200, message: "Get profile", data: { user, detail } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateBankDetails = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    console.log(user);
    if (!user) {
      res
        .status(404)
        .send({ message: "Data not found", status: 404, data: [] });
    } else {
      const data1 = await bankDetails.findById(user);
      if (data1) {
        let obj = {
          bankName: req.body.bankName,
          accountNumber: req.body.accountNumber,
          holderName: req.body.holderName,
          type: "bankdetails",
          ifsc: req.body.ifsc,
          user: user._id,
        };
        let update = await bankDetails.findByIdAndUpdate(data1._id, obj, {
          new: true,
        });
        res.status(200).send({
          message: "Data update successfully",
          status: 200,
          data: update,
        });
      } else {
        let obj = {
          bankName: req.body.bankName,
          accountNumber: req.body.accountNumber,
          holderName: req.body.holderName,
          ifsc: req.body.ifsc,
          type: "bankdetails",
          user: user._id,
        };
        const address = await bankDetails.create(obj);
        res.status(200).send({
          message: "Data saved successfully",
          status: 200,
          data: address,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", status: 500 });
  }
};


exports.updateDocument = async (req, res) => {
  try {
    // Check if the document with the given user ID exists
    const existingUser = await driverDetails.findOne({ user: req.params.id });

    if (!existingUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Handle file uploads
    if (req.files && req.files["frontPass"] && req.files["frontPan"] && req.files["drive"] && req.files["aad"] && req.files["pic"]) {
      let frontpass = req.files["frontPass"];
      let frontpan = req.files["frontPan"];
      let driveLic = req.files["drive"];
      let Adhaar = req.files["aad"];
      let Profile = req.files["pic"];

      req.body.frontPassbook = frontpass[0].path;
      req.body.frontCard = frontpan[0].path;
      req.body.drivingLic = driveLic[0].path;
      req.body.Aadhaar = Adhaar[0].path;
      req.body.profilePic = Profile[0].path;
    }

    // Update the document in the database
    const user = await driverDetails.findOneAndUpdate(
      { user: req.params.id },
      {
        $set: {
          frontPassbook: req.body.frontPassbook,
          frontCard: req.body.frontCard,
          drivingLic: req.body.drivingLic,
          Aadhaar: req.body.Aadhaar,
          profilePic: req.body.profilePic,
        },
      },
      { new: true }
    );

    return res.status(200).json({ msg: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 500, message: "Server error" + error.message });
  }
};



exports.getBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(userId);
    // Find the user by ID and filter the bank details based on type "bank details"
    const banks = await bankDetails.find({ user: userId, type: "bankdetails" });

    if (!banks) {
      return res
        .status(404)
        .json({ error: "Bank details not found for the user" });
    }

    res.status(200).json({ banks });
  } catch (error) {
    res.status(500).json({ error: "Failed to get user bank details" });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(userId);
    // Find the user by ID and filter the bank details based on type "bank details"
    const document = await bankDetails.find({ user: userId, type: "document" });

    if (!document) {
      return res
        .status(404)
        .json({ error: "Bank details not found for the user" });
    }

    res.status(200).json({ document });
  } catch (error) {
    res.status(500).json({ error: "Failed to get user bank details" });
  }
};

exports.pendingOrders = async (req, res) => {
  try {
    const pendingOrders = await Order.find({ driverId: req.user.id, orderStatus: "confirmed" });
    console.log(pendingOrders);
    res.status(200).json(pendingOrders);
  } catch (error) {
    res.status(500).json({ error: "Failed to get pending orders" });
  }
};



exports.acceptOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const driverId = req.user.id;

    // Validate that the order exists and is in the "pending" status
    const order = await Order.findOne({ _id: orderId, status: "pending" });
    if (!order) {
      return res
        .status(404)
        .json({ error: "Order not found or already accepted" });
    }
    // Check if the current order status is "pending"
    if (order.status !== "pending") {
      return res.status(400).json({ error: "Invalid order status." });
    }
    // Update the order status to "accepted" and add delivery boy's user id
    order.status = "accepted";
    order.driverId = driverId;
    await order.save();

    res.status(200).json({ message: "Order accepted successfully", order });
  } catch (error) {
    res.status(500).json({ error: "Failed to accept the order" });
  }
};

exports.orderPicked = async (req, res) => {
  try {
    const driverId = req.user.id;
    const orderId = req.params.orderId;

    // Validate that the delivery boy and order exist
    const driver = await User.findById(driverId);
    const order = await Order.findById(orderId);
    //     console.log(driver);

    if (!driver || !order) {
      return res.status(404).json({ error: "Delivery boy or order not found" });
    }

    // Check if the delivery boy is assigned to the order
    if (order.driverId.toString() !== driverId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this order" });
    }
    // Check if the current order status is "ready to deliver"
    if (order.status !== "ready to deliver") {
      return res.status(400).json({ error: "Invalid order status. " });
    }
    // Update the order status to "picked"
    order.status = "picked";
    await order.save();

    res
      .status(200)
      .json({ message: 'Order status updated to "picked"', order });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};

exports.orderChecked = async (req, res) => {
  try {
    const driverId = req.user.id;
    const orderId = req.params.orderId;

    // Validate that the delivery boy and order exist
    const driver = await User.findById(driverId);
    const order = await Order.findById(orderId);
    //     console.log(driver);

    if (!driver || !order) {
      return res.status(404).json({ error: "Delivery boy or order not found" });
    }

    // Check if the delivery boy is assigned to the order
    if (order.driverId.toString() !== driverId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this order" });
    }
    console.log(order.driverId.toString());

    // Check if the current order status is "picked"
    if (order.status !== "picked") {
      return res.status(400).json({ error: "Invalid order status." });
    }
    // Update the order status to "checked"
    order.status = "checked";
    await order.save();

    res
      .status(200)
      .json({ message: 'Order status updated to "checked"', order });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};
exports.orderDelivered = async (req, res) => {
  console.log("hi");
  try {
    const driverId = req.user.id;
    const orderId = req.params.orderId;

    // Validate that the delivery boy and order exist
    const driver = await User.findById(driverId);
    const drivers = await DriverDetails.findOne({ user: driverId });
    const order = await Order.findById(orderId);

    if (!driver || !drivers || !order) {
      return res.status(404).json({ error: "Delivery boy, driver details, or order not found" });
    }
    if (order.status === "delivered") {
      return res.status(400).json({ error: "Order is already delivered" });
    }
    // Fetch the perOrderEarning from the DailyIncentive model
    const dailyIncentive = await DailyIncentive.findOne();
    console.log("Daily Incentive:", dailyIncentive);
    const perOrderEarning = dailyIncentive ? dailyIncentive.perOrderEarning : 0;
    console.log("Driver Details:", drivers);

    // Calculate and update the driver's earnings
    const earnings = perOrderEarning;

    console.log("Order:", order);
    drivers.earnings += earnings;
    await drivers.save();

    // Log the earning history
    const earningHistoryEntry = new DriverEarningHistory({
      driverId: driverId,
      orderId: orderId,
      earnings: earnings,
      totalEaring: earnings
    });
    await earningHistoryEntry.save();

    // Update the order status to "delivered"
    order.status = "delivered";
    await order.save();

    res.status(200).json({
      message: 'Order status updated to "delivered"',
      order,
      driverEarnings: earnings,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};


exports.orderOTP = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // Check if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the OTP in the order
    order.otpOrder = otp;
    await order.save();

    // Send the OTP to the user
    // Replace the sendOTP function with your implementation to send the OTP to the user
    // await sendOTP(order.phoneNumber, otp);

    res.json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

exports.verifyorderOTP = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { otp } = req.body;

    // Check if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the OTP matches the saved OTP in the order
    if (order.otpOrder !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Update the payment method status to cash on delivery
    order.paymentMethod = "cash-on-delivery";
    // Clear the OTP after it's verified
    order.otp = null;
    await order.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

exports.rejectOrder = async (req, res) => {
  const orderId = req.params.orderId;
  const { rejectionReason, comment } = req.body;
  const driverId = req.user.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }
    // Check if the delivery boy is assigned to the order
    if (order.driverId.toString() !== driverId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this order" });
    }
    order.status = "rejected";
    order.rejectionReason = rejectionReason;
    order.comment = comment;
    await order.save();

    res.json({ status: "success", message: "Order rejected successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.myrejectOrders = async (req, res) => {
  try {
    // Assuming you have an authentication middleware to get the delivery boy's ID from the request
    const deliveryBoyId = req.user.id;

    // Find all orders where status is 'Canceled' and deliveryBoyId matches the logged-in delivery boy
    const rejectedOrders = await Order.find({
      status: "rejected",
      driverId: deliveryBoyId,
    });

    res.json({ status: "success", data: rejectedOrders });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.mydeliveredOrders = async (req, res) => {
  try {
    // Assuming you have an authentication middleware to get the delivery boy's ID from the request
    const deliveryBoyId = req.user.id;

    // Find all orders where status is 'Canceled' and deliveryBoyId matches the logged-in delivery boy
    const rejectedOrders = await Order.find({
      status: "delivered",
      driverId: deliveryBoyId,
    });

    res.json({ status: "success", data: rejectedOrders });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.todayEarning = async (req, res) => {
  try {
    const driverId = req.user.id; // Assuming you have the driver's ID in the request object
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Find earning history entries for today and the specific driver
    const todayEarningHistory = await DriverEarningHistory.find({
      driverId: driverId,
      createdAt: { $gte: today, $lt: tomorrow },
    }).populate("driverId").populate("orderId");

    res.status(200).json({ success: true, data: todayEarningHistory });
  } catch (error) {
    console.error('Error fetching driver earning history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch driver earning history' });
  }
};
//   try {
//     const deliveryBoyId = req.params.deliveryBoyId;

//     // Get the current date
//     const currentDate = new Date().toISOString().split('T')[0];

//     // Find the work log for the current date and delivery boy
//     const workLog = await WorkLog.findOne({
//       deliveryBoy: deliveryBoyId,
//       date: currentDate,
//     });

//     if (!workLog) {
//       return res.status(404).json({ message: 'Work log not found for the delivery boy on the current date.', status: 404 });
//     }

//     res.status(200).json({
//       message: 'Total hours worked retrieved successfully',
//       status: 200,
//       deliveryBoyId: workLog.deliveryBoy,
//       date: workLog.date,
//       totalHoursWorked: workLog.totalHoursWorked,
//       distanceTraveled: workLog.totalHoursWorked,
//       rainBonus: workLog.rainBonus,
//       peakHour: workLog.peakHour,
//       earning: workLog.earning,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', status: 500, error: error.message });
//   }
// };


exports.weeklyEarning = async (req, res) => {

  try {
    const driverId = req.user.id; // Assuming you have the driver's ID in the request object
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7);
    console.log(startOfWeek);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    console.log(endOfWeek);

    // Find earning history entries for the current week and the specific driver
    const weeklyEarningHistory = await DriverEarningHistory.find({
      driverId: driverId,
      createdAt: { $gte: startOfWeek, $lt: endOfWeek },
    });

    res.status(200).json({ success: true, data: weeklyEarningHistory });
  } catch (error) {
    console.error('Error fetching driver earning history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch driver earning history' });
  }
};

exports.activeOrder = async (req, res) => {

  try {
    const { driverId } = req.params;

    // Find orders assigned to the driver with a status other than "delivered"
    const orders = await Order.find({ driverId: driverId, status: { $ne: 'delivered' } }).populate("products.productId");

    res.status(200).json({ message: 'Driver orders retrieved successfully', status: 200, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', status: 500, error: error.message });
  }
};
exports.loginDetail = async (req, res) => {

  try {
    const { driverId } = req.params;

    // Find the work log for the driver
    const workLog = await WorkLog.findOne({ deliveryBoy: driverId });

    if (!workLog) {
      return res.status(404).json({ message: 'Work log not found for the specified driver', status: 404 });
    }

    // Extract start times and total hours worked from shifts
    const shifts = workLog.shifts.map((shift) => ({
      startTime: shift.startTime,
      totalHoursWorked: shift.duration.hours + shift.duration.minutes / 60,
    }));

    res.status(200).json({ message: 'Driver work log details retrieved successfully', status: 200, data: shifts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', status: 500, error: error.message });
  }
};

exports.addBonus = async (req, res) => {

  try {
    const { rainBonus, peakHourBonus } = req.body;
    const historyId = req.params.historyId;

    // Validate that the earning history entry exists
    const earningHistory = await DriverEarningHistory.findById(historyId);

    if (!earningHistory) {
      return res.status(404).json({ error: "Earning history entry not found" });
    }

    // Update rainBonus and peakHourBonus fields
    earningHistory.rainBonus = rainBonus || earningHistory.rainBonus;
    earningHistory.peakHourBonus = peakHourBonus || earningHistory.peakHourBonus;

    // Calculate total earning with bonuses
    const totalEarning = earningHistory.earnings + earningHistory.rainBonus + earningHistory.peakHourBonus;
    console.log(totalEarning);
    earningHistory.totalEaring = totalEarning;

    // Save the updated earning history entry
    await earningHistory.save();

    res.status(200).json({
      success: true,
      message: 'Earning history entry updated successfully',
      data: earningHistory,
    });
  } catch (error) {
    console.error('Error updating earning history entry:', error);
    res.status(500).json({ success: false, error: 'Failed to update earning history entry' });
  }
};