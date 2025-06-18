const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Items & Users API',
        description: 'API for managing items and users',
    },
    host: 'project1-l4hm.onrender.com',
    schemes: ['https'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['routes/users.js', 'routes/items.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
