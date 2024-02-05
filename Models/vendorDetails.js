const mongoose = require("mongoose");
const vendorDetailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
    storeName: {
        type: String,
    },
    storeAddress: {
        type: String,
    },
    pinCode: {
        type: String,
    },
    image: {
        type: String
    },
    openingTime: {
        type: String,
    },
    closingTime: {
        type: String,
    },
    // categoryProduct: {
    //     type: Array,
    //     ref: "Category"
    // },
    status: {
        type: String,
        enum: ["Approved", "Reject", "Pending"],
        default: "Pending"
    },
});

module.exports = mongoose.model("vendorDetails", vendorDetailsSchema);