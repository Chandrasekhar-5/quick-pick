const express = require('express');
const router = express.Router();
const { getAllTransactions, getWalletStats } = require('../controllers/adminWalletController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/transactions', protectAdmin, getAllTransactions);
router.get('/stats', protectAdmin, getWalletStats);

module.exports = router;