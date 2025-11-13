// api/index.js
const serverless = require('serverless-http');
const app = require('../server'); // root-level server.js

module.exports = serverless(app);
