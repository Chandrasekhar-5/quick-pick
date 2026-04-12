const express = require('express');
const router = express.Router();
const { searchItems, addMenuItem, updateMenuItem, getMenuItemsByVendor, getTrendingItems, deleteMenuItem, getAllMenuItemsForAdmin, updateMenuItemByAdmin, deleteMenuItemByAdmin } = require('../controllers/menuController');
const { protect, authorize, protectAdmin } = require('../middlewares/authMiddleware');


router.get('/search', protect, searchItems);

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
 *             description: A flavorful rice dish with vegetables and spices.
 *             isVeg: true
 *     responses:
 *       201:
 *         description: Menu item created
 *         content:
 *          application/json:
 *            example:
 *              name: Veg Biryani,
 *              price: 250,
 *              description: A flavorful rice dish with vegetables and spices.,
 *              isVeg: true,
 *              isAvailable: true,
 *              vendorId: vendor id,
 *              _id: menu item id,
 *              createdAt: 2026-03-05T06:34:49.268Z,
 *              updatedAt: 2026-03-05T06:34:49.268Z,
 *              __v: 0

 */

router.post('/', protect, authorize('vendor'), addMenuItem);


/**
 * @swagger
 * /api/menu/{id}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth:[]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 */

router.put('/:id', protect, authorize('vendor'), updateMenuItem);


/**
 * @swagger
 * /api/menu/campus/trending:
 *   get:
 *     summary: Get trending items for the campus
 *     tags: [Menu]
 *     security:
 *       - bearerAuth:[]
 *     responses:
 *       200:
 *         description: Trending menu items retrieved
 */

router.get('/campus/trending', protect, getTrendingItems);

router.get('/admin/all', protectAdmin, getAllMenuItemsForAdmin);

/**
 * @swagger
 * /api/menu/{vendorId}:
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


router.delete('/:id', protect, authorize('vendor'), deleteMenuItem);

router.put('/admin/:id', protectAdmin, updateMenuItemByAdmin);
router.delete('/admin/:id', protectAdmin, deleteMenuItemByAdmin);

module.exports = router;