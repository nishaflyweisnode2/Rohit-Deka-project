const mongoose = require('mongoose');

const rejectionReasonSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true
  }, 
  comment: {
    type: String,
    required: true
  }, 
});

const RejectionReason = mongoose.model('RejectionReason', rejectionReasonSchema);

module.exports = RejectionReason;