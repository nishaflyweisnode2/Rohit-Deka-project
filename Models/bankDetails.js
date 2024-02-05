const mongoose = require("mongoose");
const bankDetailSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    bankName: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
    holderName: {
        type: String,
    },
    ifsc: {
        type: String,
    },
    panCard: {
        type: String,
    },
    drivingLicense: {
        type: String,
    },
    passbook: {
        type: String,
    },
    aadharCard: {
        type: String,
    },
    type: {
        type: String,
        enum: ['bankdetails', 'document'],
      },
});

module.exports = mongoose.model("bankDetails", bankDetailSchema);