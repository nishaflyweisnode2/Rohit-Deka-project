const Product = require("../Models/productModel");
// const Wishlist = require("../Models/WishlistModel");
const mongoose = require("mongoose");
// const ApiFeatures = require("../utils/apifeatures");
// const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const cloudinary = require('cloudinary').v2;
// const Seller = require("../Models/sellerModel");
const SearchHistory = require("../Models/searchHistoryModel");
const Cart = require("../Models/cartModel");

const Category = require("../Models/ProductCategoryModel");

// const Subcategory = require("../Models/productSubcategoryModel");
const Brand = require("../Models/brandModel");

const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { loginAdmin } = require("./userController");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ 
  cloud_name: 'dtijhcmaa', 
  api_key: '624644714628939', 
  api_secret: 'tU52wM1-XoaFD2NrHbPrkiVKZvY' 
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });
// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  
  // const product = await Product.create(req.body);
  const { name, description, price,screenSize,simType,type,images,discountedPrice, category,subCategory, stock,features,color, ram ,brand,internalStorage,networkType} = req.body;
//   const sellerId=req.user.id;
const createdBy = req.user.id;
const createdByRole = req.user.role;
// console.log(createdBy);
      try {
          upload.array("image")(req, res, async (err) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            }
            let images = [];
          //   console.log(req.files);
            for (let i = 0; i < req.files.length; i++) {
              images.push(req.files[i] ? req.files[i].path : "");
            }
            const data = { name: req.body.name,
                description : req.body. description,
                price : req.body.price,
                brand : req.body.brand,
                unit : req.body.unit,
                quantity:req.body.quantity,
                discountedPrice :req.body.discountedPrice,
                images: images,
                type:req.body.type,
                category :req.body.category,
                subcategory:req.body.subcategory,
                stock:req.body.stock,     
                features:req.body.features,
                createdBy:req.user.id,
                createdByRole:req.user.role
               };
         
            const product = await Product.create(data);
           return res.status(200).json({ message: "product add successfully.", status: 200, data: product });
          })
        }
      
    
       catch (error) {
        console.log(req.body);
        res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
      }
    });
    
   
  // Get All Product (Admin)
// exports.getAllProduct = catchAsyncErrors(async (req, res, next) => {

//   const resultPerPage=10;
//   const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
//   const products = await apiFeature.query;

//   res.status(200).json({
//     success: true,
//     products,
//   });
// });
  //Get Product by Feature
  exports.getAllProduct = catchAsyncErrors(async (req, res, next) => {
    console.log("hi2");
    try {
      const products = await Product.find({ stock: { $gt: 0 } }); // Find products with stock greater than 0
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });


//Get Product by Category
  exports.getByCategory = catchAsyncErrors(async (req, res) => {
    const categoryId = req.params.categoryId;
    console.log(categoryId);
      // Find the products that belong to the subcategory
      Product.find({ category: categoryId })
        .then((products) => {
          res.json({ products });
        })
        .catch((error) => {
          res.status(500).json({ error: 'Failed to fetch products' });
        });
    });

//Get by Sub Category
exports.getBySubCategory = catchAsyncErrors(async (req, res) => {
  
  const subcategoryId = req.params.subCategoryId;
console.log(subcategoryId);
  // Find the products that belong to the subcategory
  Product.find({ subcategory: subcategoryId })
    .then((products) => {
      res.json({ products });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch products' });
    });
});

//Get by Category and Sub Category
exports.getByCategorySubCategory = catchAsyncErrors(async (req, res) => {
  const categoryId = req.params.categoryId;
  const subCategoryId = req.params.subCategoryId;

  try {
    // Find the products with the same category and subcategory IDs
    const products = await Product.find({ category: categoryId, subCategory: subCategoryId }).exec();

    // Filter out products with different category or subcategory IDs
    const filteredProducts = products.filter(
      (product) => String(product.category) === categoryId && String(product.subCategory) === subCategoryId
    );

    res.json({ products: filteredProducts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

//Get Single Product
exports.singleProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId).populate([
      { path: "category", select: "name " },
      { path: "subcategory", select: "name" },
      { path: "sellerId", select: "name storeName storeAddress" },
      { path: "createdBy",  },
      { path: "brand",  },

    ]);
    

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Failed to retrieve product:', error);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});
  //Get Seller Product
exports.getSellerProduct = catchAsyncErrors(async (req, res, next) => {

  const products =await Product.find({sellerId: req.seller.id}).populate('sellerId');
  if(products.length==0){
    return next(new ErrorHander("Products not found", 404));
  }else{
    res.status(200).json({success: true,products});
  }
});

// Update Product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ status: 404, message: 'Product not found' });
    }

    // Check if images were provided and handle image upload
    upload.array('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ status: 400, message: err.message });
      }

      try {
        const images = [];
        for (let i = 0; i < req.files.length; i++) {
          images.push(req.files[i] ? req.files[i].path : '');
        }

        // Update the product's information and images if provided
        Object.assign(product, req.body);

        // If new images were provided, update the images
        if (images.length > 0) {
          product.images = images;
        }

        // Save the updated product
        const updatedProduct = await product.save();

        return res.status(200).json({
          status: 200,
          message: 'Product updated successfully',
          data: updatedProduct,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error.message,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: error.message,
    });
  }
});



// Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params.id;
console.log(productId);
  // Find the product by ID
  const product = await Product.findById(productId);
console.log(product);
  // Check if the product exists
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  // Delete the product from the Product collection
  await Product.findByIdAndDelete(productId);

  // Remove the product from all user carts
  await Cart.updateMany(
    { 'products.productId': productId },
    { $pull: { products: { productId: productId } } }
  );

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});


//Create Wishlist

exports.createWishlist = catchAsyncErrors(async (req, res, next) => {
  const  product  = req.params.id;
  //console.log(user)
  let wishList = await Wishlist.findOne({ user: req.user._id });
  if (!wishList) {
    wishList = new Wishlist({
      user: req.user,
    });
  }
  wishList.products.addToSet(product);
  await wishList.save();
  res.status(200).json({
    message: "product addedd to wishlist Successfully",
  });
});

//Remove Wishlist
exports.removeFromWishlist = catchAsyncErrors(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    return next(new ErrorHander("Wishlist not found", 404));
  }
  const product  = req.params.id;

  wishlist.products.pull(new mongoose.Types.ObjectId(product));

  await wishlist.save();
  res.status(200).json({
    success: true,
    message: "Removed From Wishlist",
  });
});

  //My Wishlist
  exports.myWishlist = catchAsyncErrors(async (req, res, next) => {
    let myList = await Wishlist.findOne({ user: req.user._id }).populate(
      "products"
    );
  
    if (!myList) {
      myList = await Wishlist.create({
        user: req.user._id,
      });
    }
    res.status(200).json({
      success: true,
      wishlist: myList,
    });
  });

  const saveProductsInBulk = async (productData) => {
    try {
      // Assuming you have a Product model in your application
      const Product = require("../Models/productModel");
  
      // Save the products in bulk using the insertMany function
      const savedProducts = await Product.insertMany(productData);
  
      return savedProducts;
    } catch (error) {
      console.error('Error saving products:', error);
      throw new Error('Failed to save products');
    }
  };
  exports.createBulkProduct = catchAsyncErrors(async (req, res, next) => {
    const sellerId=req.user.id;
      // Get the seller details from the request
      // const { id, email } = req.seller;
    
      // Get the product data from the request body
      const productData = req.body.products; // Assuming the product data is an array of objects
     
      if (!productData || !Array.isArray(productData) || productData.length === 0) {
        return res.status(400).json({ error: 'Invalid product data' });
      }
    
      try {
        // Process and save the products in bulk
        const savedProducts = await saveProductsInBulk(productData);
    
        // Return a success response with the saved products
        res.json({
          message: 'Products added successfully',
          products: savedProducts
        });
      } catch (error) {
        console.error('Error adding products:', error);
        res.status(500).json({ error: 'Failed to add products' });
      }
    });

    exports.search = catchAsyncErrors(async (req, res, next) => {
      
      const productsCount = await Product.count();
      let apiFeature = await Product.aggregate([
        {
          $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category" },
        },
        { $unwind: "$category" },
        {
          $lookup: { from: "subcategories", localField: "subcategory", foreignField: "_id", as: "subcategory", },
        },
        { $unwind: "$subcategory" },
      ]);
      if (req.query.search != (null || undefined)) {
        let data1 = [
          {
            $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category" },
          },
          { $unwind: "$category" },
          {
            $lookup: { from: "subcategories", localField: "subcategory", foreignField: "_id", as: "subcategory", },
          },
          { $unwind: "$subcategory" },
          {
            $match: {
              $or: [
                { "category.name": { $regex: req.query.search, $options: "i" }, },
                { "subcategory.name": { $regex: req.query.search, $options: "i" }, },
                { "name": { $regex: req.query.search, $options: "i" }, },
                { "description": { $regex: req.query.search, $options: "i" }, },
                { "colors": { $regex: req.query.search, $options: "i" }, }
              ]
            }
          }
        ]
        apiFeature = await Product.aggregate(data1);
        if (req.user) {
          const searchHistory = new SearchHistory({
            user: req.user._id, // Assuming you have a user object in the request
            query: req.query.search,
          });
  console.log(searchHistory);
          await searchHistory.save();
        }
      }
      res.status(200).json({ success: true, productsCount, apiFeature, });
    });

    exports.recentSearch = catchAsyncErrors(async (req, res, next) => {
      try {
        const userId = req.user._id; // Assuming you have a user object in the request
    
        const recentSearches = await SearchHistory.find({ user: userId })
          .sort({ timestamp: -1 }) // Sort in descending order by timestamp
          .limit(10); // Limit to the most recent 10 searches
    
        res.status(200).json(recentSearches);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching recent searches' });
      }
    });
    exports.getwarehouseProduct = catchAsyncErrors(async (req, res, next) => {
      try {
        const products = await Product.find({ createdByRole: "warehouse" });
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products.' });
      }
    });


    exports.newbydate = catchAsyncErrors(async (req, res) => {
      try {
        const products = await Product.find().sort({ createdAt: -1 });
    
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get products' });
      }
    });
   

    exports.lowestprice = catchAsyncErrors(async (req, res) => {
      try {
        const products = await Product.find().sort({ price: 1 });
    
        res.json(products);
        // console.log(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get products' });
      }
    });

    exports.easybaking = catchAsyncErrors(async (req, res) => {
      const type = 'Easy Baking';
    
      try {
        const products = await Product.find({ type });
    
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get products' });
      }
    });
    exports.easymeal= catchAsyncErrors(async (req, res) => {
      const type = 'Easy Meal';
    
      try {
        const products = await Product.find({ type });
    
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get products' });
      }
    });

    exports.assamspecial= catchAsyncErrors(async (req, res) => {
      const type = 'Assam Special';
    
      try {
        const products = await Product.find({ type });
    
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get products' });
      }
    });

    exports.weekendspecial = catchAsyncErrors(async (req, res) => {
      const type = 'Weekend Special';
    
      try {
        const products = await Product.find({ type });
    
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get products' });
      }
    });

    exports.brand = catchAsyncErrors(async (req, res) => {
      try {
        const brands = await Product.distinct('brand');
    
        res.json(brands);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get brands' });
      }
    });

    exports.productinbrand = catchAsyncErrors(async (req, res) => {
      try {
        const brand = req.params.brand;
        const products = await Product.find({ brand });
    
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get products by brand' });
      }
    });

    exports.updateProductType = async (req, res) => {
      try {
        const productId = req.params.productId;
        const newProductType = req.body.type // Set the new product type
    
        // Find the product by ID and update its type
        const updatedProduct = await Product.findByIdAndUpdate(
          productId,
          { type: newProductType },
          { new: true }
        );
    
        if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        res.status(200).json({ message: 'Product type updated successfully', updatedProduct });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };



exports.getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    // Find products associated with the given vendor
    const products = await Product.find({ createdBy
      : vendorId });

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
