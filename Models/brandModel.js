const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name brand Required"],
    },
    image: {
        type: String
    },
   
});

module.exports = mongoose.model("Brand", brandSchema);