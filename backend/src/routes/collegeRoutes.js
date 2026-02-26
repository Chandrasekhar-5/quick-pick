const express = require("express");
const router = express.Router();
const { createCollege } = require("../controllers/collegeController");

router.post("/", createCollege);

module.exports = router;