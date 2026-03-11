require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("../src/routes/authRoutes");
const collegeRoutes = require("../src/routes/collegeRoutes");
const vendorRoutes = require("../src/routes/vendorRoutes");
const menuRoutes = require("../src/routes/menuRoutes");
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const swaggerSpec = require("./config/swagger");
<<<<<<< HEAD
require("dotenv").config();
=======
const uploadRoutes = require("./routes/uploadRoutes");

>>>>>>> 336727d33076e2ffad2d6a4a23565aa7d66ff62b
const app = express();

connectDB();

const allowedOrigins = 
    process.env.NODE_ENV === 'production'
        ? ['https://quick-pick-student.vercel.app',
            'https://quick-pick-vendor.vercel.app'
          ]
        : ['http://localhost:3000'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/upload", uploadRoutes);



app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "success", message: "Quick pick api is running successfully" });
});


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server is running...");
});