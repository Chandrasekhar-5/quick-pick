const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getVendorOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             vendorId: vendorId
 *             items:
 *               - menuItem: menuItemId
 *                 quantity: 2
 *     responses:
 *       201:
 *         description: Order created
 */

router.post('/', protect, placeOrder);
router.get('/myOrders', protect, getMyOrders);

router.get('/vendor-orders', protect, authorize('vendor'), getVendorOrders);
router.put('/:id/status', protect, authorize('vendor'), updateOrderStatus);

module.exports = router;