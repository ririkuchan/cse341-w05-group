/**
 * @swagger
 * tags:
 *   name: Items
 *   description: API for managing items
 */
const express = require('express');
const router = express.Router();
const {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} = require('../controllers/items');

// GET all items
/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 */
router.get('/', getAllItems);

// GET item by ID
/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [Items]
 */
router.get('/:id', getItemById);

// POST new item
/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create new item
 *     tags: [Items]
 */
router.post('/', createItem);

// PUT update item
/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update item
 *     tags: [Items]
 */
router.put('/:id', updateItem);

// DELETE item
/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete item
 *     tags: [Items]
 */
router.delete('/:id', deleteItem);

module.exports = router;
