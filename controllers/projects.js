const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

const getAllProjects = async (req, res) => {
    try {
        const db = getDb();
        console.log('✅ DB object:', db); // ← 追加（getDb() の返り値を確認）

        const projects = await db.collection('projects').find().toArray();
        console.log('✅ Projects:', projects); // ← 実際の取得結果も確認

        res.status(200).json(projects);
    } catch (error) {
        console.error('❌ Error in getAllProjects:', error); // ← エラーの詳細を表示
        res.status(500).json({ message: 'Error fetching projects', error });
    }
};

const getProjectById = async (req, res) => {
    const id = req.params.id;

    // 👇 ここが重要
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

const createProject = async (req, res) => {
    try {
        const project = {
            title: req.body.title,
            description: req.body.description,
            deadline: req.body.deadline
        };
        const result = await getDb().collection('projects').insertOne(project);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error creating project', error: err });
    }
};

const updateProject = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const result = await getDb().collection('projects').replaceOne(
            { _id: new ObjectId(id) },
            req.body
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error updating project', error: err });
    }
};

const deleteProject = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

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
