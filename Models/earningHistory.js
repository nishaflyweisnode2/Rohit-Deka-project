const mongoose = require("mongoose");

const driverEarningHistorySchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to your Driver model
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to your Order model
      required: true,
    },
    earnings: {
      type: Number,
      required: true,
    },
    rainBonus: {
      type: Number,
      default: 0,
    },
    peakHourBonus: {
      type: Number,
      default: 0,
    },
    totalEaring: {
        type: Number,
        default: 0,
      },
  },
  { timestamps: true }
);

const DriverEarningHistory = mongoose.model(
  "DriverEarningHistory",
  driverEarningHistorySchema
);

module.exports = DriverEarningHistory;
