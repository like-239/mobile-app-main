require('dotenv').config();
const express = require("express");
//const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
//const helmet = require("helmet");
const dotenv = require("dotenv");
const userRouter = require("./src/routes/userRoutes")
const authRouter = require('./src/routes/authRoutes');

const transactionRoutes = require("./src/routes/transactionRoutes");
const { handle401Error, errorHandler } = require('./src/middlewares/errorHandlers');
/*
const categoryRouter = require('./routes/categoryRoutes');
const shopRouter = require('./routes/shopRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require("./routes/cartRouter");
const orderRouter = require('./routes/orderRoutes');
const couponRouter = require('./routes/couponRouter');
const eventRouter = require('./routes/eventRouter');
const reviewRouter = require('./routes/reviewRouter');
const messageRouter = require('./routes/messageRoutes');
*/
const cloudinary = require('cloudinary').v2;


// Kết nối đến cơ sở dữ liệu MongoDB
// dotenv.config();

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

  .then(() => {
    const db = mongoose.connection;
    
     
    
    console.log('Kết nối thành công đến MongoDB!');
   
  })
  .catch((error) => {
    console.error('Lỗi kết nối:', error);
  });

// config cloudinary
cloudinary.config({
cloud_name: process.env.CLOUDINARY_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET,
})


// test upload image
// async function uploadImage() {
//   try {
//     const result = await cloudinary.uploader.upload('/Users/nguyenthihoanglan/Downloads/image.jpg');
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// }
// uploadImage();

  // setup
app.use(bodyParser.json({limit:"50mb"}));
//app.use(cors());
app.use(morgan("common"));



//router


app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/transactions',transactionRoutes );
app.use(handle401Error);

// Middleware xử lý lỗi
app.use(errorHandler);
/*
app.use('/categories', categoryRouter);
app.use('/shops', shopRouter);
app.use('/products', productRouter);
app.use("/carts", cartRouter);
app.use('/orders', orderRouter);
app.use("/coupon", couponRouter);
app.use("/event", eventRouter);
app.use("/review", reviewRouter);
app.use("/message", messageRouter);

*/
// server running


app.listen( process.env.PORT , () => {
  console.log("Server is running...");
});
