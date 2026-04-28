const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getVendorOrders, updateOrderStatus, getOrderStats, getAvailableSlots, getSingleOrder, getAllOrders, updateOrderStatusByAdmin } = require('../controllers/orderController');
const { protect, authorize, protectAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/orders:
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
 *         content:
 *           application/json:
 *             example:
 *               userId: user id
 *               vendorId: vendor id
 *               items:
 *                 - menuItem: menu item id
 *                   quantity: 3
 *                   priceAtOrder: 150
 *                   _id: "69a92ba270d96fda71f54d2f"
 *               totalAmount: 450
 *               status: "Pending"
 *               paymentStatus: "Pending"
 *               _id: "69a92ba270d96fda71f54d2e"
 *               createdAt: "2026-03-05T07:07:14.689Z"
 *               updatedAt: "2026-03-05T07:07:14.689Z"
 *               __v: 0
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


router.get('/stats', protect, getOrderStats);

router.get('/admin/all', protectAdmin, getAllOrders);


router.get('/:vendorId/slots', protect, getAvailableSlots);


router.get('/single/:id', protect, getSingleOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
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

router.put('/admin/:id/status', protectAdmin, updateOrderStatusByAdmin);

module.exports = router;