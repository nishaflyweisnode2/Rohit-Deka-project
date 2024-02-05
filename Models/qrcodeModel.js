const mongoose = require("mongoose");

const qrcodeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name qrcode Required"],
    },
    image: {
        type: String
    },
    
});

module.exports = mongoose.model("qrcode", qrcodeSchema);