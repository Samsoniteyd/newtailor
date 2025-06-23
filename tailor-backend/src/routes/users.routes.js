const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// Get all users (admin only)
router.get('/', userController.getAllUsers);

// Get specific user
router.get('/:id', userController.getUser);

// Update specific user
router.put('/:id', userController.updateUser);

// Delete specific user
router.delete('/:id', userController.deleteUser);

module.exports = router; 