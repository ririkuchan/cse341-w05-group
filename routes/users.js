/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

// 認証チェックミドルウェア
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({ error: 'Unauthorized: Please login first' });
    }
}

// GET all users
// #swagger.tags = ['Users']
router.get('/', isAuthenticated, usersController.getAllUsers);

// GET user by ID
// #swagger.tags = ['Users']
router.get('/:id', isAuthenticated, usersController.getUserById);

// POST new user
// #swagger.tags = ['Users']
router.post('/', isAuthenticated, usersController.createUser);

// PUT update user
// #swagger.tags = ['Users']
router.put('/:id', isAuthenticated, usersController.updateUser);

// DELETE user
// #swagger.tags = ['Users']
router.delete('/:id', isAuthenticated, usersController.deleteUser);

module.exports = router;
