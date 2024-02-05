const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
    unique: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;