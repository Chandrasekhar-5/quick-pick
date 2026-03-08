const express = require("express");
const router = express.Router();
const { createCollege, getColleges } = require("../controllers/collegeController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/", protect, authorize("admin"), createCollege);
router.get("/", getColleges);

module.exports = router;