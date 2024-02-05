const mongoose = require("mongoose");

const aboutusSchema = mongoose.Schema({
  announ: {
    type: String,
  },
});

const announ = mongoose.model("announ", aboutusSchema);

module.exports = announ;
