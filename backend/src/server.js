require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "success", message: "Quick pick api is running successfully" });
});

app.listen(process.env.PORT, () => {
    console.log("Server is running...");
});