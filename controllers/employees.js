const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

const getAllEmployees = async (req, res) => {
    try {
        const employees = await getDb().collection('employees').find().toArray();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employees', error: err });
    }
};

const getEmployeeById = async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    try {
        const employee = await getDb().collection('employees').findOne({ _id: new ObjectId(id) });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employee', error: err });
    }
};

const createEmployee = async (req, res) => {
    try {
        const { name, position, email } = req.body;
        if (!name || !position || !email) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const result = await getDb().collection('employees').insertOne({ name, position, email });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error creating employee', error: err });
    }
};

const updateEmployee = async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    const { name, position, email } = req.body;
    if (!name || !position || !email) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const result = await getDb().collection('employees').replaceOne(
            { _id: new ObjectId(id) },
            { name, position, email }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error updating employee', error: err });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const result = await getDb().collection('employees').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting employee', error: err });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};