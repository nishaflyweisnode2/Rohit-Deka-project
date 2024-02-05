const mongoose = require("mongoose");
const warehouseDetailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    warehouseType: {
        type: String,
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
    storeImage: {
        type: Array,
    },
    openingTime: {
        type: String,
    },
    closingTime: {
        type: String,
    },
    categoryProduct: {
        type: Array,
        ref: "Category"
    },
    status: {
        type: String,
        enum: ["Approved", "Reject", "Pending"],
        default: "Pending"
    },
});

module.exports = mongoose.model("warehouseDetails", warehouseDetailsSchema);