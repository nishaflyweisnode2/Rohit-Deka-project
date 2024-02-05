const express = require("express");
const app = express();
const dotenv = require("dotenv");
// const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
// const cloudinary = require("cloudinary");


app.use(cors());
app.use(express.json());
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.get("/",(req,res)=>{
  res.send("Hello world")
})

// Route Imports
const user = require("./Routers/userRoute");
const vendor = require("./Routers/vendorRoute");
const warehouse = require("./Routers/warehouseRoute");
const driver = require("./Routers/driverRoute");
const category = require("./Routers/productCategoryRoute");
const subcategory = require("./Routers/productSubcategoryRoute");
const product = require("./Routers/productRoute");
const banner = require("./Routers/bannerRoute");
const printer = require("./Routers/printerRoute");
const coupon = require("./Routers/couponRoute");
const cart = require("./Routers/cartRoute");
const faq = require("./Routers/faqRoute");
const terms = require('./Routers/termRoute');
const policy = require('./Routers/privacyRoute');
const order = require('./Routers/orderRoute');
const aboutus = require('./Routers/aboutusRoute');
const support = require('./Routers/supportRoute');
const timeslot = require('./Routers/timeSlotRoute');
const shift = require('./Routers/shiftRoute');
const area = require('./Routers/areaRoute');
const time = require('./Routers/timeRoute');
const cancelOrder = require('./Routers/cancelOrderRoute');
const workLog = require('./Routers/workLogRoute');
const brand = require('./Routers/brandRoute');
const notify = require('./Routers/notificationRoute');
const wallet = require('./Routers/walletRoute');
const tax = require("./Routers/taxRoute");
const shipping = require("./Routers/shippingRoute");
const incentive = require("./Routers/incentiveRoute");
const watch = require("./Routers/watchRoute");
const qrcode = require("./Routers/qrcodeRoute");
const announcement = require("./Routers/announRoute");


app.use("/api/v1", user);
app.use("/api/v1", vendor);
app.use("/api/v1", warehouse);
app.use("/api/v1", driver);
app.use('/api/v1/admin',category );
app.use('/api/v1/admin',subcategory );
app.use("/api/v1", product);
app.use('/api/v1/banner',banner );
app.use('/api/v1/printer',printer );
app.use('/api/v1/coupon',coupon );
app.use('/api/v1/cart',cart );
app.use('/api/v1/faq',faq );
app.use('/api/v1/terms', terms);
app.use('/api/v1/privacy', policy);
app.use('/api/v1/order', order);
app.use('/api/v1/aboutus', aboutus);
app.use('/api/v1/support', support);
app.use('/api/v1/timeslot', timeslot);
app.use('/api/v1/shift', shift);
app.use('/api/v1/area', area);
app.use('/api/v1/time', time);
app.use('/api/v1/cancel/order', cancelOrder);
app.use('/api/v1/work/log', workLog);
app.use('/api/v1/brand',brand );
app.use('/api/v1/notify',notify );
app.use('/api/v1/wallet',wallet );
app.use("/api/v1/tax", tax);
app.use("/api/v1/shipping", shipping);
app.use("/api/v1/incentive", incentive);
app.use("/api/v1/watch", watch);
app.use("/api/v1/qrcode", qrcode);
app.use("/api/v1/announcement", announcement);

dotenv.config({ path: "config/config.env" });
const mongoose = require("mongoose");


connectDatabase = () => {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(process.env.MONGO_URI)
      .then((con) =>
        console.log(`Mongodb connected with server: ${con.connection.host}`)
      );
  };
  
  // Connecting to database
  connectDatabase();
  
  const server = app.listen(process.env.PORT, () => {
      console.log(`Server is working on port ${process.env.PORT}`);
    }); 