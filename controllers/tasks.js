const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

const getAllTasks = async (req, res) => {
    try {
        const tasks = await getDb().collection('tasks').find().toArray();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks', error: err });
    }
};

const getTaskById = async (req, res) => {
    const id = req.params.id;

    // 🔐 ObjectIdとして有効か事前にチェック
    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid task ID format' });
    }

    try {
        const task = await getDb().collection('tasks').findOne({ _id: new ObjectId(id) });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching task', error: err });
    }
};

const createTask = async (req, res) => {
    try {
        const task = {
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate
        };
        const result = await getDb().collection('tasks').insertOne(task);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error creating task', error: err });
    }
};

const updateTask = async (req, res) => {
    try {
        const updatedTask = req.body;
        const result = await getDb().collection('tasks').replaceOne(
            { _id: new ObjectId(req.params.id) },
            updatedTask
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error updating task', error: err });
    }
};

const deleteTask = async (req, res) => {
    try {
        const result = await getDb().collection('tasks').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err });
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
