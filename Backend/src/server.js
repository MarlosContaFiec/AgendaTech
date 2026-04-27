'use strict';
require('dotenv').config();
const app  = require('./app');
const env  = require('./config/env');
const { startJobs } = require('./jobs');

const PORT = env.server.port;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`   Ambiente : ${env.server.env}`);
  console.log(`   DB       : ${env.db.host}:${env.db.port}/${env.db.database}`);
  console.log(`   Health   : http://localhost:${PORT}/health\n`);
  startJobs();
});

process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason);
});
