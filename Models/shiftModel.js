const mongoose = require('mongoose');

const shiftPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
   
  },
  shift: {
    type: String,
    required: true,
  },
  timeOfWork: {
    type: String,
    required: true,
  },
  earningPerMonth: {
    type: String,
    required: true,
  },
  estimate: {
    type: String,
    required: true,
  },
});

const ShiftPreference = mongoose.model('ShiftPreference', shiftPreferenceSchema);

module.exports = ShiftPreference;