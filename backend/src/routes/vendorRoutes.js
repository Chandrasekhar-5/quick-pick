const express = require("express");
const router = express.Router();
const { createVendor, getVendors, getVendorByOwner, getVendorById, updateVendor, uploadLogo, getAllVendorsForAdmin, toggleVendorStatus, deleteVendor, createVendorByAdmin } = require("../controllers/vendorController");
const { protect, authorize, protectAdmin } = require("../middlewares/authMiddleware");


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


router.get("/owner/:ownerId", protect, getVendorByOwner);


router.get("/me", protect, authorize("vendor"), getVendorByOwner);


router.put("/me", protect, authorize("vendor"), updateVendor);


router.get("/:id", protect, getVendorById);

router.get('/admin/all', protectAdmin, getAllVendorsForAdmin);
router.put('/admin/:id/toggle', protectAdmin, toggleVendorStatus);
router.delete('/admin/:id', protectAdmin, deleteVendor);
router.post('/admin', protectAdmin, createVendorByAdmin);



module.exports = router;