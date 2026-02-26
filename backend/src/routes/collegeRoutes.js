const express = require("express");
const router = express.Router();
const { createCollege } = require("../controllers/collegeController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/", protect, authorize("admin"), createCollege);

module.exports = router;