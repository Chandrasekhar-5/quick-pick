const express = require('express');
const router = express.Router();
const { getVendorMetrics } = require('../controllers/analyticsController');
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

module.exports = router;