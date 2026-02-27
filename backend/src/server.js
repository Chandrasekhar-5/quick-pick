require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("../src/routes/authRoutes");
const collegeRoutes = require("../src/routes/collegeRoutes");
const vendorRoutes = require("../src/routes/vendorRoutes");
const menuRoutes = require("../src/routes/menuRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/menu", menuRoutes);


app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "success", message: "Quick pick api is running successfully" });
});

app.listen(process.env.PORT, () => {
    console.log("Server is running...");
});