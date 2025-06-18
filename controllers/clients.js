const { ObjectId } = require('mongodb');
const db = require('../data/database');

const getAllClients = async (req, res) => {
    try {
        const clients = await db.collection('clients').find().toArray();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients', error });
    }
};

const getClientById = async (req, res) => {
    try {
        const client = await db.collection('clients').findOne({ _id: new ObjectId(req.params.id) });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching client', error });
    }
};

const createClient = async (req, res) => {
    try {
        const client = req.body;
        if (!client.name || !client.industry || !client.contact) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const result = await db.collection('clients').insertOne(client);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error creating client', error });
    }
};

const updateClient = async (req, res) => {
    try {
        const client = req.body;
        const result = await db.collection('clients').replaceOne({ _id: new ObjectId(req.params.id) }, client);
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error updating client', error });
    }
};

const deleteClient = async (req, res) => {
    try {
        const result = await db.collection('clients').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({ message: 'Client deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client', error });
    }
};

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
};
