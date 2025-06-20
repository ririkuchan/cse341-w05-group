const { MongoClient } = require('mongodb');

let _db;

// コールバック方式（既存）
const initDb = (callback) => {
    if (_db) {
        console.warn('⚠️ Database is already initialized.');
        return callback(null, _db);
    }

    console.log('Connecting to MongoDB...');
    MongoClient.connect(process.env.MONGODB_URL)
        .then((client) => {
            _db = client.db();
            console.log('✅ Database connected');
            callback(null, _db);
        })
        .catch((err) => {
            console.error('❌ MongoDB connection error:', err);
            callback(err);
        });
};

// Promise対応版（テスト用に新たに追加）
const initDbPromise = async () => {
    if (_db) {
        console.warn('⚠️ Database already initialized.');
        return _db;
    }

    console.log('Connecting to MongoDB with Promise...');
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URL);
        _db = client.db();
        console.log('✅ Database connected via Promise');
        return _db;
    } catch (err) {
        console.error('❌ MongoDB Promise connection error:', err);
        throw err;
    }
};

const getDb = () => {
    if (!_db) {
        throw new Error('❌ Database not initialized');
    }
    return _db;
};

module.exports = {
    initDb,
    initDbPromise,
    getDb
};
