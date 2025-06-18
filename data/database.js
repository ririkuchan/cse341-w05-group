const { MongoClient } = require('mongodb');

// MONGODB_URL が正しく読めているか確認
console.log('MONGODB_URL:', process.env.MONGODB_URL);

const client = new MongoClient(process.env.MONGODB_URL);  // オプション不要OK！

let database;

const initDb = async (callback) => {
    if (database) {
        console.log('Db is already initialized!');
        return callback(null, database);
    }

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        database = client.db('contacts');  // DB名はcontacts → OK
        console.log('Database connected');
        callback(null, database);
    } catch (err) {
        console.error('Database connection error:', err);  // エラー内容を出す
        callback(err);
    }
};

const getDatabase = () => {
    if (!database) {
        throw new Error('Database not initialized');
    }
    return database;
};

module.exports = {
    initDb,
    getDatabase
};
