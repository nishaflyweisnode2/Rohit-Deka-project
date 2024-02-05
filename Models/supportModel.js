const mongoose = require("mongoose"); 

const supportsSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
    },
    name: {
        type: String,
    },
    email: {
        type: String
    },
    mobile: {
        type: Number
    },
    query: {
        type: String
    },
    adminReply: {
        type: String
      },
      adminRepliedAt: {
        type: Date
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
})




const supports  = mongoose.model('supports', supportsSchema);

module.exports = supports