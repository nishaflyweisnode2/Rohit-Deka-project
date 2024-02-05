const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name Blog Required"],
    },
    video: {
        type: String
    },
    image: {
        type: String,
        default:"https://res.cloudinary.com/dtijhcmaa/image/upload/v1699959016/images/image/meyct32dtejwd25ezkal.png"
    },
});

module.exports = mongoose.model("Blog", blogSchema);