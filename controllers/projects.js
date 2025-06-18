const { ObjectId } = require('mongodb');
const db = require('../data/database');

const getAllProjects = async (req, res) => {
    try {
        const projects = await db.collection('projects').find().toArray();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await db.collection('projects').findOne({ _id: new ObjectId(req.params.id) });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error });
    }
};

const createProject = async (req, res) => {
    try {
        const project = req.body;
        if (!project.title || !project.status || !project.deadline) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const result = await db.collection('projects').insertOne(project);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = req.body;
        const result = await db.collection('projects').replaceOne({ _id: new ObjectId(req.params.id) }, project);
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
