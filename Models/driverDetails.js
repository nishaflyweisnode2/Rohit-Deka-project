const mongoose = require("mongoose");
const driverDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  incentive: {
    type: String,
    default:"0"
  }, earnings: {
    type: Number,
    default: 0,
  },
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShiftPreference",
  },
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PreferredArea",
  },
  time: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PreferredTimingShift",
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  door: {
    type: String,
  },
  street: {
    type: String,
  },
  city: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", ""],
    default: "",
  },
  pincode: {
    type: String,
  },
  landmark: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  pancard: {
    type: String,
  },
 
  Aadhaar: {
    type: String,
  },
  frontPassbook: {
    type: String,
  },
  frontCard: {
    type: String,
  },
  drivingLic: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Approved", "Reject", "Pending"],
    default: "Pending",
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
  },
});

module.exports = mongoose.model("driverDetails", driverDetailsSchema);
