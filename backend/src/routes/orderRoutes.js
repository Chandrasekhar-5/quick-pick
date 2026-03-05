const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getVendorOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     description: Student places an order from a vendor
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             vendorId: 64f123abc
 *             items:
 *               - menuItem: 64fmenu123
 *                 quantity: 2
 *               - menuItem: 64fmenu456
 *                 quantity: 1
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid order request
 */

router.post('/', protect, placeOrder);


/**
 * @swagger
 * /api/orders/myOrders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 */

router.get('/myOrders', protect, getMyOrders);


/**
 * @swagger
 * /api/orders/vendor-orders:
 *   get:
 *     summary: Get orders for vendor shop
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor orders list
 *       403:
 *         description: Not authorized
 */

router.get('/vendor-orders', protect, authorize('vendor'), getVendorOrders);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             status: Completed
 *     responses:
 *       200:
 *         description: Order updated
 *       404:
 *         description: Order not found
 */

router.put('/:id/status', protect, authorize('vendor'), updateOrderStatus);

module.exports = router;