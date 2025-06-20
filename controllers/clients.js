// controllers/clients.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

// Get all clients
const getAllClients = async (req, res) => {
    try {
        const clients = await getDb().collection('clients').find().toArray();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients', error });
    }
};

// Get client by ID
const getClientById = async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid client ID format' });
    }

    try {
        const client = await getDb().collection('clients').findOne({ _id: new ObjectId(id) });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching client', error });
    }
};

// Create a new client
const createClient = async (req, res) => {
    try {
        const client = {
            name: req.body.name,
            industry: req.body.industry,
            contact: req.body.contact
        };

        if (!client.name || !client.industry || !client.contact) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const result = await getDb().collection('clients').insertOne(client);
        res.status(201).json(result);
    } catch (err) {
        console.error("❌ Error creating client:", err);
        res.status(500).json({ message: "Error creating client", error: err.toString() });
    }
};

// Update a client by ID
const updateClient = async (req, res) => {
    try {
        const client = req.body;
        const result = await getDb().collection('clients').replaceOne(
            { _id: new ObjectId(req.params.id) },
            client
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error updating client', error });
    }
};

// Delete a client by ID
const deleteClient = async (req, res) => {
    try {
        const result = await getDb().collection('clients').deleteOne({ _id: new ObjectId(req.params.id) });
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
