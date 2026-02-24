const mongoose = require("mongoose");

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb connected...");
    } catch (error) {
        console.error("Database connection failed: ", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;