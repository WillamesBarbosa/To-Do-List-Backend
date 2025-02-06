require('dotenv').config();
const knexConfig = require('../../../knexfile');

const enviroment = process.env.NODE_ENV
const knexConfigured = knexConfig[enviroment]

const database = require('knex')(knexConfigured);


process.on('SIGTERM', async () => {
    console.log('\nEncerrando o servidor...');
    await knex.destroy();
    server.close(() => process.exit(0));
  });
  
process.on('SIGINT', async () => {
    console.log('Fechando conexão com o banco...');
    await knex.destroy();
    process.exit(0);
});

module.exports = database;