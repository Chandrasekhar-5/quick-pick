const express = require('express');
const router = express.Router();
const { getWallet, addFunds, deductFunds } = require('../controllers/walletController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getWallet);
router.post('/add', protect, addFunds);
router.post('/deduct', protect, deductFunds);

module.exports = router;