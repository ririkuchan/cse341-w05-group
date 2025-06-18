require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');

const session = require('express-session');
const passport = require('passport');
require('./config/passport'); // パスポート設定読み込み

const MongoStore = require('connect-mongo');

const clientsRoutes = require('./routes/clients');   // ✅ 追加
const projectsRoutes = require('./routes/projects'); // ✅ 追加

const app = express();
const port = process.env.PORT || 3001;

app.set('trust proxy', 1);

// JSONのリクエストボディを扱えるようにする
app.use(bodyParser.json());

// === CORS対応 ===
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );
    next();
});

// === Session 設定 ===
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URL, // ← .env のキー名が「MONGODB_URI」ならここも修正！
            collectionName: 'sessions',
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
        },
    })
);

// === Passport 初期化 ===
app.use(passport.initialize());
app.use(passport.session());

// === Swagger UI ===
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// === 課題用のルーティング（今回の主役） ===
app.use('/clients', clientsRoutes);
app.use('/projects', projectsRoutes);

// === 前のルーティング（任意） ===
//app.use('/users', require('./routes/users'));
//app.use('/items', require('./routes/items'));
app.use('/auth', require('./routes/auth'));

// === Renderの動作確認用ルート（/） ===
app.get('/protected', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Hello, ${req.user.displayName}! This is a protected route.`);
    } else {
        res.redirect('/auth/google');
    }
});

// === MongoDB 接続後にサーバーを起動 ===
mongodb.initDb((err) => {
    if (err) {
        console.error('❌ Failed to connect to database:', err);
    } else {
        app.listen(port, () => {
            console.log(`✅ Database is connected. Server is running on port ${port}`);
        });
    }
});
