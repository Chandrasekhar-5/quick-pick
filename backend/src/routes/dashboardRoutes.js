const express = require('express');
const router = express.Router();
const { getDashboardStats, getRevenueData, getOrdersPerDay, getTopVendors, getRecentOrders } = require('../controllers/dashboardController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/stats', protectAdmin, getDashboardStats);
router.get('/revenue', protectAdmin, getRevenueData);
router.get('/orders-per-day', protectAdmin, getOrdersPerDay);
router.get('/top-vendors', protectAdmin, getTopVendors);
router.get('/recent-orders', protectAdmin, getRecentOrders);

module.exports = router;