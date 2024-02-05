const mongoose = require("mongoose");

const printerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name Banner Required"],
    },
    image: {
        type: String
    },
    locationType: {
        type: String,
        enum: ['home', 'office'],
      
      },
      addressLine1: {
        type: String,
       
      },
      addressLine2: {
        type: String
      },
      city: {
        type: String,
      
      },
      state: {
        type: String,
     
      },
      postalCode: {
        type: String,
      
      },
      paperSize: {
        type: String,
      
      },
      numberOfCopies: {
        type: Number,
      
      },
      printType: {
        type: String,
     
      }
    
});

module.exports = mongoose.model("Printer", printerSchema);