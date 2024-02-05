const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");



const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      unit: {
        type: String,
        enum: ['kg', 'liter', 'packet', 'pieces'],
        required: true
      },
      quantity: {
        type: Number,
        default:1
      },
      price: {
        type: Number,
        required: true
      },
  description: {
    type: String,
   
  },

  images: {
    type: [String],
    required: true,
  },
  discountedPrice: {
    type: Number,
  },
  category: {
    type: String,
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
  subcategory: {
    type: String,
    type: mongoose.Schema.ObjectId,
    ref: "Subcategory",
  },
  stock: {
    type: Number,
    required: [true, "Please Enter Stock"],
    default: 1,
  },
  // details: {
  //   type: String,
  //   default:"This is product details"
   
  // },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  sellerId: {
    type: mongoose.Schema.ObjectId,
    ref: "Seller",
    
  },
  type: {
    type: String,
  },
  brand:{
   
    type: mongoose.Schema.ObjectId,
    ref: "Brand",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdByRole: {
    type: String,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  },
});
productSchema.plugin(mongoosePaginate);
productSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Product", productSchema);