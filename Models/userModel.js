const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
  },
  otp: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  profilePicture: {type:String,
    default:""
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  confirmPassword: {
    type: String,
  },
  phone: {
    type: String,
  },
  fullName: {
    type: String,
  },
  address: {
    type: String,
  },
  language:{
    type:String
  },
  email: {
    type: String,
    
  },
  address: {
    type: String,
    
  },
 
  profileImage: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin','vendor','warehouse','driver'],
    default: 'user',
  },
  wallet: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;