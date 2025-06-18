const { getDatabase } = require('../data/database');
const { ObjectId } = require('mongodb');

// GET all users
const getAllUsers = async (req, res) => {
    try {
        const users = await getDatabase().collection('users').find().toArray();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// GET user by ID
const getUserById = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const user = await getDatabase().collection('users').findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user by ID:', err);
        res.status(500).json({ error: 'Invalid ID or user not found' });
    }
};

// POST new user
const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const newUser = { name, email };
        const result = await getDatabase().collection('users').insertOne(newUser);
        res.status(201).json({ insertedId: result.insertedId, ...newUser });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

// PUT update user
const updateUser = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const result = await getDatabase().collection('users').updateOne(
            { _id: id },
            { $set: { name, email } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// DELETE user
const deleteUser = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const result = await getDatabase().collection('users').deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
