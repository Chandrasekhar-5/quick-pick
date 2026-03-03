const express = require('express');
const router = express.Router();
const { getVendorMetrics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/vendor-metrics', protect, authorize('vendor'), getVendorMetrics);

module.exports = router;