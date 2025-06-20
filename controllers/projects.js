const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database'); // ✅ 修正ポイント

const getAllProjects = async (req, res) => {
    try {
        const db = getDb();
        const projects = await db.collection('projects').find().toArray();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
};

const getProjectById = async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid project ID format' });
    }

    try {
        const project = await getDb().collection('projects').findOne({ _id: new ObjectId(id) });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching project', error: err });
    }
};

const createProject = async (req, res) => {
    try {
        const { name, clientId, status, dueDate } = req.body;
        if (!name || !clientId || !status || !dueDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const db = getDb();
        const result = await db.collection('projects').insertOne({
            name,
            clientId,
            status,
            dueDate
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error });
    }
};

const updateProject = async (req, res) => {
    try {
        const db = getDb();
        const project = req.body;
        const result = await db.collection('projects').replaceOne(
            { _id: new ObjectId(req.params.id) },
            project
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error });
    }
};

const deleteProject = async (req, res) => {
    try {
        const db = getDb();
        const result = await db.collection('projects').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};
