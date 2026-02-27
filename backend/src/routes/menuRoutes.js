const express = require('express');
const router = express.Router();
const { addMenuItem, getMenuItemsByVendor } = require('../controllers/menuController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('vendor'), addMenuItem);
router.get('/:vendorId', getMenuItemsByVendor);

module.exports = router;