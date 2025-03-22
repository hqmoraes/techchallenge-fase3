const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FastFood API',
      version: '1.0.0',
      description: 'API para sistema de autoatendimento de fast food',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
  },
  apis: [
    './src/interfaces/routes/*.js',
    './src/interfaces/controllers/*.js',
  ],
};

const specs = swaggerJsdoc(options);
module.exports = specs;