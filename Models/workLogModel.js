const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  startTime: { type: String, required: true },
  endTime: { type: String },
  // duration: { type: Number, default: 0 },
  duration: {
    hours: {
      type: Number,
      default: 0,
    },
    minutes: {
      type: Number,
      default: 0,
    },
  },
});

const workLogSchema = new mongoose.Schema({
  deliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, required: true },
  shifts: [shiftSchema],
  totalHoursWorked: { type: Number, default: 0 },
  startLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  endLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  distanceTraveled: { type: String,default:"0" },
  rainBonus: { type: String,default:"0" },
  peakHour: { type: String,default:"0" },
  
  earning: { type: String,default:"0" },

  image: {
    type: String,
  },
});

const WorkLog = mongoose.model("WorkLog", workLogSchema);

module.exports = WorkLog;
