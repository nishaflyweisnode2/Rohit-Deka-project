const Cart = require('../Models/cartModel')
const Product= require('../Models/productModel')
const Coupon= require('../Models/couponModel')
const Order= require('../Models/orderModel')
const User = require('../Models/userModel');
const Shipping = require("../Models/shippingModel");
const Tax = require("../Models/taxModel");
const DailyIncentive = require("../Models/incentiveModel");
 
exports.AddOrder = async (req, res) => {
  try {
    const { includePaperBag, instruction, address, timeSlotId } = req.body;

    // Find the cart by its ID
    const cart = await Cart.findOne({
      userId: req.user.id,
    }).populate('products.product').populate('couponCode'); // Add populate for couponCode

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Calculate the subtotal
    let subTotal = 0;
    for (const product of cart.products) {
      if (!product.price || !product.quantity) {
        return res.status(400).json({ error: 'Invalid product data' });
      }
      const price = parseFloat(product.price);
      const quantity = parseInt(product.quantity);

      if (isNaN(price) || isNaN(quantity)) {
        return res.status(400).json({ error: 'Invalid product data' });
      }

      // Add the price of each product to the subtotal
      subTotal += price * quantity;
    }

    // Fetch tax rate from Tax model (assuming you have a tax rate)
    const tax = await Tax.findOne();
    const taxRate = tax ? tax.tax : 0;

    // Calculate tax amount
    const taxAmount = (subTotal * parseFloat(taxRate)) / 100;

    // Retrieve shipping charge from Shipping model (assuming you have a shipping charge)
    const shipping = await Shipping.findOne();
    const shippingCharge = shipping ? shipping.shipping : 0;

    // Calculate the totalAmount including tax, shipping, and coupon discount
    let totalAmount = subTotal + taxAmount + parseFloat(shippingCharge);

    // Apply coupon discount if a coupon is applied
    let couponDiscount = 0;
    if (cart.couponCode) {
      console.log('Coupon Code:', cart.couponCode);
      couponDiscount = cart.couponCode.discount;
      console.log('Coupon Discount:', couponDiscount);
      totalAmount -= couponDiscount; // Deduct coupon discount from totalAmount
    }

    // Create the order
    const order = new Order({
      cartId: cart._id,
      user: req.user.id,
      products: cart.products,
      includePaperBag,
      address,
      shipping: shippingCharge,
      tax: taxAmount,
      timeSlotId,
      instruction,
      subTotal,
      couponDiscount,
      totalAmount,
    });

    // Save the order to the database
    await order.save();

    // Clear the coupon code from the cart after creating the order
    // cart.couponCode = null;
    // await cart.save();

    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};





    
    exports.myOrders = async (req, res) => {
      try {
        const user = req.user.id;
    
        // Find all orders belonging to the user
        const orders = await Order.find({ user }).populate("products.productId");
    
        // Create an array to store orders with tax and shipping details
        const ordersWithDetails = [];
    
        // Iterate through each order and update the total price
        for (const order of orders) {
          // Calculate tax and shipping prices based on the order details
          const taxPrice = calculateTax(order);
          const shippingPrice = calculateShipping(order);
    
          // Add tax and shipping prices to the total amount
          order.totalAmount += taxPrice + shippingPrice;
    
          // Create an object to represent the order with tax and shipping details
          const orderWithDetails = {
            order: order,
            tax: taxPrice,
            shipping: shippingPrice,
          };
    
          ordersWithDetails.push(orderWithDetails);
        }
    
        res.json(ordersWithDetails);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
      }
    };
        // exports.myOrders = async (req, res) => {
        //     try {
        //       const user = req.user.id;
          
        //       // Find all orders belonging to the user
        //       const orders = await Order.find({ user });
          
        //       res.json(orders);
        //     } catch (error) {
        //       console.error(error);
        //       res.status(500).json({ error: 'Failed to fetch orders' });
        //     }
        //   };


          exports.acceptOrders = async (req, res, next) => {
            
            try {
              const { orderId } = req.params;
          
              // Find the order by its ID
              const order = await Order.findById(orderId);
          
              if (!order) {
                return res.status(404).json({ error: 'Order not found' });
              }
          
              // Update the order status to 'accepted'
              order.status = 'accepted';
          
              // Save the updated order
              await order.save();
          
              res.json({ message: 'Order accepted successfully', order });
            } catch (error) {
              console.error('Error accepting order:', error);
              res.status(500).json({ error: 'Failed to accept order' });
            }
          };


           //Cash On Delivery
  exports.cashOnDelivery = async (req, res, next) => {
   
    try {
      const { orderId } = req.params;
  
      // Find the order by its ID
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ error: `Order not found with ID ${orderId}` });
      }
  
      // Update the order payment method to 'cash-on-delivery'
      order.paymentMethod = 'cash-on-delivery';
      order.paymentMethod = 'status';

  
      // Save the updated order to the database
      await order.save();
  
      res.json({ message: 'Order payment method updated to cash on delivery', order });
    } catch (error) {
      console.error('Error updating order payment method:', error);
      res.status(500).json({ error: 'Failed to update order payment method' });
    }
  };
    

  //Reviews
  exports.addReview = async (req, res, next) => {
    try {
      const { rating, comment } = req.body;
      const { orderId } = req.params;
  
      // Validate the input data
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid rating' });
      }
  
      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Add the review and rating to the order
      order.review = {
        rating,
        comment
      };
  
      // Save the updated order
      await order.save();
  
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add review and rating' });
    }
  };




  exports.singleOrder = async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
  
      // Find the order by its ID
      const order = await Order.findById(orderId).populate("driverId").populate("products.productId");
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // res.json({order});
      return res.status(200).json({ message: "order successfully.", status: 200, order: order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get order' });
    }
  };

  exports.orderItems = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by its ID and select only the 'products' field
    const order = await Order.findById(orderId).select('products');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order.products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get products of order' });
  }
};

exports.preparingOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // const vendorId = req.user.id; // Assuming the vendor ID is retrieved from the login session

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the order is assigned to the vendor making the request
  //  if (order.createdBy.toString() !== vendorId) {
  //     return res.status(403).json({ error: 'You are not authorized to update this order status' });
  //   } 

    // Update the order status based on the request body
    // Assuming the request body includes a "status" field
    order.status = req.body.status;

    // Save the updated order
    await order.save();

    res.json({ message: `Order status updated to "${req.body.status}"` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

exports.mysellerOrders = async (req, res) => {
  try {
    const vendorId  = req.user.id;

    // Fetch orders by the given vendor ID
    const orders = await Order.find( {createdBy: vendorId} );

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};


exports.readyOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const vendorId = req.user.id; // Assuming the vendor ID is retrieved from the login session

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the order is assigned to the vendor making the request
    if (order.createdBy.toString() !== vendorId) {
      return res.status(403).json({ error: 'You are not authorized to update this order status' });
    }

    // Check if the current order status is "preparing"
    if (order.status !== 'preparing') {
      return res.status(400).json({ error: 'Invalid order status. Only "accepted" orders can be updated to "preparing"' });
    }

    // Update the order status to "preparing"
    order.status = 'ready to deliver';
    await order.save();

    res.json({ message: 'Order status updated to "ready to deliver"' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

exports.allOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find().populate("user").populate("products.productId");

    // Send the orders as a JSON response
    res.status(200).json({ success: true, orders });
  } catch (error) {
    // Handle errors, and send an error response
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


// Assuming you have the vendor's ID (sellerId) in the request
exports.getOrdersForVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId; // Assuming you have the vendor's ID in the request parameters

    // Find orders where at least one product belongs to the vendor
    const orders = await Order.find({
      'products.sellerId': vendorId,
    }).populate('products.productId', 'name'); // Assuming you want to populate product details

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders for vendor:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


