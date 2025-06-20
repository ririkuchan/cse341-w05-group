const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

// GET ALL
const getAllProjects = async (req, res) => {
    try {
        const db = getDb();
        const projects = await db.collection('projects').find().toArray();
        res.status(200).json(projects);
    } catch (error) {
        console.error('❌ Error in getAllProjects:', error);
        res.status(500).json({ message: 'Error fetching projects', error });
    }
};

// GET BY ID
const getProjectById = async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid project ID format' });
    }

    try {
        const db = getDb();
        const project = await db.collection('projects').findOne({ _id: new ObjectId(id) });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error });
    }
};

// POST（新規作成）
const createProject = async (req, res) => {
    const { title, description, deadline } = req.body;

    // ✅ バリデーション
    if (!title || !description || !deadline) {
        return res.status(400).json({ message: 'All fields (title, description, deadline) are required.' });
    }

    try {
        const project = { title, description, deadline };
        const result = await getDb().collection('projects').insertOne(project);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error creating project', error: err });
    }
};

// PUT（更新）
const updateProject = async (req, res) => {
    const id = req.params.id;
    const { title, description, deadline } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    // ✅ バリデーション
    if (!title || !description || !deadline) {
        return res.status(400).json({ message: 'All fields (title, description, deadline) are required.' });
    }

    try {
        const result = await getDb().collection('projects').replaceOne(
            { _id: new ObjectId(id) },
            { title, description, deadline }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error updating project', error: err });
    }
};

// DELETE
const deleteProject = async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const result = await getDb().collection('projects').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting project', error: err });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};
