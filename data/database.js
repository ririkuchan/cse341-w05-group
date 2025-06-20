const { MongoClient } = require('mongodb');

console.log('MONGODB_URL:', process.env.MONGODB_URL);

const client = new MongoClient(process.env.MONGODB_URL);
let database;

const initDb = async (callback) => {
    if (database) {
        console.log('Db is already initialized!');
        return callback(null, database);
    }

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        database = client.db('contacts'); // ✅ DB name confirmed
        console.log('✅ Database connected');
        callback(null, database);
    } catch (err) {
        console.error('❌ Database connection error:', err);
        callback(err);
    }
};

const getDb = () => {
    if (!database) {
        throw new Error('❌ Database not initialized');
    }
    return database;
};

module.exports = {
    initDb,
    getDb
};
