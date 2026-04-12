const express = require('express');
const router = express.Router();
const { getAllUsers, toggleUserBlock, deleteUser } = require('../controllers/userController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.get('/', protectAdmin, getAllUsers);
router.put('/:id/block', protectAdmin, toggleUserBlock);
router.delete('/:id', protectAdmin, deleteUser);

module.exports = router;