const express = require("express");
const router = express.Router();
const { createVendor, getVendors } = require("../controllers/vendorController");
const { protect, authorize } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/vendors:
 *   post:
 *     summary: Create vendor shop
 *     description: Allows a vendor to create their shop
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Campus Bites
 *             description: Fast food and snacks
 *     responses:
 *       201:
 *         description: Vendor created successfully
 *         content:
 *          application/json:
 *            example:
 *              name: shop name
 *              description: shop description
 *              collegeId: college id
 *              isOpen: true
 *              _id: vendor id
 *              createdAt: 2024-06-01T12:00:00.000Z
 *              updatedAt: 2024-06-01T12:00:00.000Z
 *              __v: 0
 *       400:
 *         description: Vendor already has a shop
 */

router.post("/", protect, authorize("vendor"), createVendor);

/**
 * @swagger
 * /api/vendors:
 *   get:
 *     summary: Get vendors in the user's college
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendors
 */

router.get("/", protect, getVendors);

module.exports = router;