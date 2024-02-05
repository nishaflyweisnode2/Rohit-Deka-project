const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
          required: true,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Assuming that the product's createdBy field is a reference to the User model
        },
      },
    ],
    // code: {
    //   type: String,
    //   default: "",
    // },
    // shippingAmount: {
    //   type: Number,
    //   default: 0,
    // },

    // subtotal: {
    //   type: Number,
    //   default: 0,
    // },
    // taxAmount: {
    //   type: Number,
    //   default: 0,
    // },
    // instruction: {
    //   type: String,
    //   default: "",
    // },
    // discountAmount: {
    //   type: Number,
    //   default: 0,
    // },
    // subtotalAmount: {
    //   type: Number,
    //   default: 0,
    // },
    // totalAmount: {
    //   type: Number,
    // },
    couponCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: false,
    },
    // couponDiscount: {
    //   type: Number,
    //   default: 0,
    // },
  },
  { timestamps: true, strictPopulate: false }
);

module.exports = mongoose.model("Cart", cartSchema);
