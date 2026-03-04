require('dotenv').config();
const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const pinoHttp = require('pino-http');

const routes = require('./routes/routes');
const logger = require('./app/utils/helpers/logger/logger');

const textInitialWhenConnect = `
-----------------------------------------------
|                                             |
|              SERVER STARTED                 |
|                                             |
| Server is running at https://localhost:3000 |
|                                             |
-----------------------------------------------
`;

// Server config
const app = express();
// For convert JSON on Js Object
app.use(express.json());
app.use(pinoHttp({ logger, redact: ['req.headers.authorization'] }));

const ambient = process.env.NODE_ENV;

const PORT = ambient === 'test' ? 0 : 3000

const corsOptions = {
  credentials: true,
  origin: `https://localhost:${PORT}`,
};

// For minimize erros about cors
app.use(cors(corsOptions));
app.use(routes);

// For read ssl certified
const options = {
  key: fs.readFileSync('ssl/code.key'),
  cert: fs.readFileSync('ssl/code.crt'),
};

// Function for create the HTTPS server
const server = https.createServer(options, app);

process.on('uncaughtException', (error) => {
    logger.fatal({ err: error }, 'Exceção não capturada — sistema encerrando');
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.fatal({ reason }, 'Promise rejeitada não tratada — sistema encerrando');
    process.exit(1);
}); 

// Calling the function to start the server.
server.listen(PORT, () => console.log(textInitialWhenConnect));

module.exports =  app;
