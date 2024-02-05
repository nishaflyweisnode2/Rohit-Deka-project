const mongoose = require("mongoose"); 

const aboutusSchema = mongoose.Schema({
    aboutus: {
        type: String
    }
})



const aboutus  = mongoose.model('aboutus', aboutusSchema);

module.exports = aboutus