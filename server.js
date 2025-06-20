require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');

const session = require('express-session');
const passport = require('passport');
require('./config/passport');

const MongoStore = require('connect-mongo');

const clientsRoutes = require('./routes/clients');
const projectsRoutes = require('./routes/projects');
const tasksRoutes = require('./routes/tasks');
const employeesRoutes = require('./routes/employees');

const app = express();
const port = process.env.PORT || 3001;

app.set('trust proxy', 1);
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URL,
            collectionName: 'sessions',
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/clients', clientsRoutes);
app.use('/projects', projectsRoutes);
app.use('/tasks', tasksRoutes);
app.use('/employees', employeesRoutes);
app.use('/auth', require('./routes/auth'));

app.get('/protected', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Hello, ${req.user.displayName}! This is a protected route.`);
    } else {
        res.redirect('/auth/google');
    }
});

if (require.main === module) {
    mongodb.initDb((err) => {
        if (err) {
            console.error('❌ Failed to connect to database:', err);
        } else {
            app.listen(port, () => {
                console.log(`✅ Database is connected. Server is running on port ${port}`);
            });
        }
    });
}

module.exports = app;
