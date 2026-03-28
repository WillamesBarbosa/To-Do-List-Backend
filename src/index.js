require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');

const routes = require('./routes/routes');
const logger = require('./app/utils/helpers/logger/logger');

const app = express();
app.use(express.json());
app.use(pinoHttp({ logger, redact: ['req.headers.authorization'] }));

const ambient = process.env.NODE_ENV;
const PORT = ambient === 'test' ? 0 : process.env.PORT || 3000;

const corsOptions = {
  credentials: true,
  origin: process.env.CORS_ORIGIN,
};

app.use(cors(corsOptions));
app.use(routes);

process.on('uncaughtException', (error) => {
    logger.fatal({ err: error }, 'Exceção não capturada — sistema encerrando');
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.fatal({ reason }, 'Promise rejeitada não tratada — sistema encerrando');
    process.exit(1);
}); 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;