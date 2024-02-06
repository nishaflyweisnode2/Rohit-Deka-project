const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},
sellerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Seller',
},
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
     
      },
      quantity: {
        type: Number,
     
      },
      price: {
        type: Number,
      
      },
      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    }
  ],
  shipping: {
    type: Number,
  
  },
  tax: {
    type: Number,
   
  },
  couponDiscount: {
    type: Number,
   
  },
  coupon: {
    type: String,
   
  },
  subTotal: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  includePaperBag: {
    type: String,
    default:"false"
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    flat: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    // Adding latitude and longitude
    // location: {
    //   type: {
    //     type: String,
    //     enum: ['Point'],
    //     default: 'Point',
    //     // required: false,
    //   },
    //   coordinates: {
    //     type: [Number],
    //     // required: false,
    //   },
    // }
    
    
  },
  
  
  status: {
    type: String,
    enum: ['pending','confirmed', 'accepted','rejected','picked','checked','preparing','ready to deliver' ,'rejected','delivered'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['unconfirmed','confirmed', ],
    default: 'unconfirmed'
  },
  otpOrder: {
    type: String,
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming that the product's createdBy field is a reference to the User model
    // required: true,
  },
  paymentMethod: { type: String, enum: ['cash-on-delivery', 'not paid','upi'], default: 'not paid' },
  createdAt: {
    type: Date,
    default: Date.now
  },
  returned: {
    type: Boolean,
    default: false,
  },
  
  reasonForReturn: {
    type: String,
  },
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    }
  },
  timeSlotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot',
    // required: true,
  },
  instruction: {
      type: String,
      default: "",
    },
  rejectionReason: {
    type: String
  },
  comment: {
    type: String
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
// });
}, { timestamps: true });
orderSchema.index({ 'address.location': '2dsphere' });


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

