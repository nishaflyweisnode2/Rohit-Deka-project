const mongoose = require('mongoose');

const preferredAreaSchema = new mongoose.Schema({
  area: {
    type: String,
    required: true,
  },
  monthlyEarning: {
    type: Number,
    required: true,
  },
});

const PreferredArea = mongoose.model('PreferredArea', preferredAreaSchema);

module.exports = PreferredArea;