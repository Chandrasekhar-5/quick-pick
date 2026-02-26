const express = require("express");
const router = express.Router();
const { createVendor, getVendors } = require("../controllers/vendorController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/", protect, authorize("vendor"), createVendor);
router.get("/", protect, getVendors);

module.exports = router;