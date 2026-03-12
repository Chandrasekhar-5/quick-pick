const express = require('express');
const router = express.Router();
const { getVendorMetrics, getDashboardStats, getBestSellers, getRevenueData, getCategoryDistribution, getTopItems } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');


/**
 * @swagger
 * /api/analytics/vendor:
 *   get:
 *     summary: Get vendor performance metrics
 *     description: Returns revenue and total completed orders for the vendor's shop
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor metrics
 *         content:
 *           application/json:
 *             example:
 *               totalRevenue: 5400
 *               totalOrders: 83
 *       404:
 *         description: Vendor shop not found
 */

router.get('/vendor', protect, authorize('vendor'), getVendorMetrics);


router.get('/dashboard-stats', protect, authorize('vendor'), getDashboardStats);


router.get('/best-sellers', protect, authorize('vendor'), getBestSellers);


router.get('/revenue/:period', protect, authorize('vendor'), getRevenueData);


router.get('/category-distribution', protect, authorize('vendor'), getCategoryDistribution);


router.get('/top-items', protect, authorize('vendor'), getTopItems);


module.exports = router;