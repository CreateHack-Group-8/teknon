const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');

const specs = swaggerDocument;

module.exports = {
  specs,
  swaggerUi,
  swaggerServe: swaggerUi.serve,
};


