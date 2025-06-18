// controllers/items.js
const { getDatabase } = require('../data/database');
const { ObjectId } = require('mongodb');

const getAllItems = async (req, res) => {
    try {
        const items = await getDatabase().collection('items').find().toArray();
        res.status(200).json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

const getItemById = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const item = await getDatabase().collection('items').findOne({ _id: id });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(item);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Invalid ID' });
    }
};

const createItem = async (req, res) => {
    try {
        const { name, price } = req.body;
        if (!name || !price) return res.status(400).json({ error: 'Missing required fields' });
        const result = await getDatabase().collection('items').insertOne({ name, price });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create item' });
    }
};

const updateItem = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const { name, price } = req.body;
        if (!name || !price) return res.status(400).json({ error: 'Missing required fields' });
        const result = await getDatabase().collection('items').updateOne(
            { _id: id },
            { $set: { name, price } }
        );
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update item' });
    }
};

const deleteItem = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const result = await getDatabase().collection('items').deleteOne({ _id: id });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
};

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
};
