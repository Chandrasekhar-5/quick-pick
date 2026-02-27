const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/myOrders', protect, getMyOrders);

module.exports = router;