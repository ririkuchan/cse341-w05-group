const { MongoClient } = require('mongodb');
const connectionString = process.env.MONGODB_URL;

let client;
let database;

async function initDb(callback) {
    if (database) {
        console.log('✅ Database already initialized.');
        return callback(null, database);
    }

    try {
        client = new MongoClient(connectionString);
        await client.connect();
        database = client.db('projectDB');
        console.log('✅ Database initialized for testing.');
        callback(null, database);
    } catch (err) {
        console.error('❌ Error initializing database:', err);
        callback(err);
    }
}

function getDb() {
    if (!database) {
        throw Error('❌ Database not initialized');
    }
    return database;
}

module.exports = {
    initDb,
    getDb
};
