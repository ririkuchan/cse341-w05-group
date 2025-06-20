const { MongoClient } = require('mongodb');

let _db;

// コールバック方式
const initDb = (callback) => {
    if (_db) {
        console.warn('⚠️ Database is already initialized.');
        return callback(null, _db);
    }

    console.log('Connecting to MongoDB...');
    MongoClient.connect(process.env.MONGODB_URL)
        .then((client) => {
            _db = client.db("contacts"); // ⭐ ここを明示
            console.log('✅ Database connected to "contacts"');
            callback(null, _db);
        })
        .catch((err) => {
            console.error('❌ MongoDB connection error:', err);
            callback(err);
        });
};

// Promise対応版
const initDbPromise = async () => {
    if (_db) {
        console.warn('⚠️ Database already initialized.');
        return _db;
    }

    console.log('Connecting to MongoDB with Promise...');
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URL);
        _db = client.db("contacts"); // ⭐ ここも同じく
        console.log('✅ Database connected to "contacts" via Promise');
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
