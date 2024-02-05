const mongoose = require('mongoose');

const preferredTimingShiftSchema = new mongoose.Schema({
  shift: {
    type: String,
    required: true,
  },
  timing: {
    type: String,
    required: true,
  },
});

const PreferredTimingShift = mongoose.model('PreferredTimingShift', preferredTimingShiftSchema);

module.exports = PreferredTimingShift;