const express = require('express');
const router = express.Router();
const { addMenuItem, getMenuItemsByVendor } = require('../controllers/menuController');
const { protect, authorize } = require('../middlewares/authMiddleware');


/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Add menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Veg Biryani
 *             price: 80
 *             isVeg: true
 *     responses:
 *       201:
 *         description: Menu item created
 */

router.post('/', protect, authorize('vendor'), addMenuItem);

/**
 * @swagger
 * /menu/{vendorId}:
 *   get:
 *     summary: Get menu items for a vendor
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor menu
 */

router.get('/:vendorId', getMenuItemsByVendor);

module.exports = router;