const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'CSE341 W05 Project',
        description: 'API documentation for clients and projects'
    },
    host: 'localhost:3000',
    schemes: ['http']
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
