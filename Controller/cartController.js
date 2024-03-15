const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");
const Shipping = require("../Models/shippingModel");
const Tax = require("../Models/taxModel");

const Coupon = require("../Models/couponModel");

exports.AddCart = async (req, res) => {
  console.log("hi");
  try {
    const { products, instruction } = req.body;
    console.log(req.body);
    const userId = req.user.id;

    // Check if a cart exists for the user
    let cart = await Cart.findOne({ userId });
    console.log(cart);
    if (cart) {
      // If cart exists, add the products to it
      for (const product of products) {
        const { productId, quantity, price } = product;
        const dbProduct = await Product.findById(productId);
        console.log(dbProduct);
        if (!dbProduct) {
          return res.status(400).json({ error: "Invalid product ID" });
        }
        const productcreatedBy = await dbProduct.createdBy;
        const productPrice = dbProduct.price;
        // const totalPrice = productPrice * quantity;

        // Add the product to the cart
        cart.products.push({
          productId,
          quantity,
          price: productPrice,
          createdBy: productcreatedBy,
          // totalPrice,
        });

        // Update the total amount of the cart
        // cart.subtotal += totalPrice;
      }
    } else {
      // If cart doesn't exist, create a new cart
      const cartProducts = [];
      // let subtotal = 0;

      for (const product of products) {
        const { productId, quantity, price } = product;
        const dbProduct = await Product.findById(productId);
        if (!dbProduct) {
          return res.status(400).json({ error: "Invalid product ID" });
        }
        const productcreatedBy = await dbProduct.createdBy;
        const productPrice = dbProduct.price;
        // const totalPrice = productPrice * quantity;

        // Add the product to the cart
        cartProducts.push({
          productId,
          quantity,
          price: productPrice,
          createdBy: productcreatedBy,
          // totalPrice,
        });

        // Update the subtotal of the cart
        // subtotal += totalPrice;
      }

      // Create a new cart
      cart = new Cart({
        userId,
        products: cartProducts,
        instruction,
        // price: productPrice,
        // createdBy: productcreatedBy,
        // subtotal,
      });
    }

    // Calculate tax and shipping amount (you need to adjust these values)
    // const taxAmount = 0.1 * cart.subtotal; // Assume tax is 10%
    // const shippingAmount = 15; // Assume a fixed shipping amount

    // Update cart with tax and shipping
    // cart.taxAmount = taxAmount;
    // cart.shippingAmount = shippingAmount;
    // cart.totalAmount = cart.subtotal + taxAmount + shippingAmount;

    // Save the cart to the database
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create or update cart" });
  }
};

exports.getCart = async (req, res) => {
  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate("products.productId")
      .populate("couponCode");

    if (!cart || !cart.products || cart.products.length === 0) {
      // If no cart or no products, return default values
      return res.json({
        cart: { products: [] },
        subtotal: 0,
        shippingCharge: 0,
        taxAmount: 0,
        couponDiscount: 0,
        total: 0,
      });
    }

    // Calculate subtotal
    let subtotal = 0;
    cart.products.forEach((product) => {
      subtotal += product.quantity * product.productId.price;
    });

    // Retrieve shipping charge from Shipping model (assuming you have a shipping method)
    const shipping = await Shipping.findOne();
    const shippingCharge = shipping ? shipping.shipping : 100; // Default value of 100

    // Retrieve tax rate from Tax model (assuming you have a tax rate)
    const tax = await Tax.findOne();
    const taxRate = tax ? tax.tax : 0;

    // Calculate tax amount
    const taxAmount = (subtotal * parseFloat(taxRate)) / 100;

    // Apply coupon discount if a coupon is applied
    let couponDiscount = 0;
    if (cart.couponCode) {
      // Assuming couponCode.discountAmount is the discount amount from the coupon
      couponDiscount = cart.couponCode.discount;
    }

    // Calculate total
    let total = subtotal + parseFloat(shippingCharge) + taxAmount - couponDiscount;

    res.json({
      cart,
      subtotal,
      shippingCharge,
      taxAmount,
      couponDiscount,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.applyCoupon = async (req, res) => {
  const { couponCode } = req.body;
  console.log(req.body);
  try {
    // Find the cart by user ID
    const cart = await Cart.findOne({ userId: req.user.id });

    // Check if the cart exists
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Fetch the coupon by the provided coupon code
    const coupon = await Coupon.findOne({ _id: couponCode });
    console.log(coupon);
    // Check if the coupon exists and is valid
    if (!coupon || coupon.expirationDate < Date.now()) {
      return res.status(400).json({ error: "Invalid coupon code or expired coupon" });
    }

    // Apply the coupon discount to the cart
    cart.couponCode = coupon._id; // Assuming coupon._id is the ObjectId of the coupon

    // Save the updated cart
    await cart.save();

    // Populate the coupon details in the response
    // await cart.populate('couponCode').execPopulate();

    res.json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to apply coupon" });
  }
};
exports.removeCoupon = async (req, res) => {
  try {
    // Find the cart by user ID
    const cart = await Cart.findOne({ userId: req.user.id });

    // Check if the cart exists
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    console.log(cart);
    // Remove the coupon from the cart
    cart.couponCode = null;

    // Save the updated cart
    await cart.save();

    res.json({ message: "Coupon removed successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove coupon" });
  }
};


exports.removeSingle = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find the cart for the user
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const product = cart.products.find(
      (product) => product.productId.toString() === productId
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Fetch the product price from the Product model
    const productData = await Product.findById(productId);
    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    const productPrice = productData.price;
    const productQuantity = product.quantity;

    // Subtract the price of the deleted product from the total amount
    cart.totalAmount -= productPrice * productQuantity;
    console.log(cart.totalAmount);
    // Remove the product from the cart
    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== productId
    );

    // Save the updated cart
    await cart.save();

    res.json({ totalAmount: cart.totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeAllcart = async (req, res) => {
  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Set the total amount to zero and remove all products from the cart
    cart.totalAmount = 0;
    cart.products = [];

    // Save the updated cart
    await cart.save();

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.increaseQuantity = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the cart for the user and populate the products
    let cart = await Cart.findOne({ userId: req.user.id }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (product) => product.productId._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Increase the quantity by 1
    cart.products[productIndex].quantity += 1;

    // Update the total amount by adding the price of the product
    const product = cart.products[productIndex].productId;

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    cart.totalAmount += product.price;

    // Save the updated cart
    cart = await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to increase quantity in cart" });
  }
};

exports.decreaseQuantity = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the cart for the user and populate the products
    let cart = await Cart.findOne({ userId: req.user.id }).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (product) => product.productId._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Increase the quantity by 1
    cart.products[productIndex].quantity -= 1;

    // Update the total amount by adding the price of the product
    const product = cart.products[productIndex].productId;

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    cart.totalAmount -= product.price;

    // Save the updated cart
    cart = await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to increase quantity in cart" });
  }
};

// exports.decreaseQuantity = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     // const userId = req.user.id;

//     // Find the cart of the logged-in user
//     const cart = await Cart.findOne({ userId:req.user.id }).populate('products.productId');

//     // Check if the cart exists
//     if (!cart) {
//       return res.status(404).json({ error: 'Cart not found' });
//     }

//     // Find the product in the cart
//     const productIndex = cart.products.findIndex((product) => product.productId.toString() === productId);

//     // Check if the product exists in the cart
//     if (productIndex === -1) {
//       return res.status(404).json({ error: 'Product not found in cart' });
//     }

//     // Decrease the quantity of the product by 1
//     cart.products[productIndex].quantity -= 1;

//     // Calculate the price of the product
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
//     const productPrice = product.price;

//     // Subtract the price of the product from the total amount
//     cart.totalAmount -= productPrice;

//     // Save the updated cart
//     await cart.save();

//     res.json(cart);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to decrease product quantity in cart' });
//   }
// };
