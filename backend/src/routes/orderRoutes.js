const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getVendorOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/myOrders', protect, getMyOrders);

router.get('/vendor-orders', protect, authorize('vendor'), getVendorOrders);
router.put('/:id/status', protect, authorize('vendor'), updateOrderStatus);

module.exports = router;