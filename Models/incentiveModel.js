const mongoose = require("mongoose");

const dailyIncentiveSchema = new mongoose.Schema(
  {
    perOrderEarning: {
      type: Number,
      required: true,
    },
    orderIncentives: {
      maxOrder: {
        type: Number,
        required: true,
      },
      incentiveAmount: {
        type: Number,
        required: true,
      },
    },

    rainBonus: {
      type: Number,
      required: true,
    },
    peakHourBonus: {
      type: Number,
    },
  },
  { timestamps: true }
);

const DailyIncentive = mongoose.model("DailyIncentive", dailyIncentiveSchema);

module.exports = DailyIncentive;
