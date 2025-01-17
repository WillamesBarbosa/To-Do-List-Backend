const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');

const routes = require('./routes/routes');
const responsesHTTP = require('./app/utils/helpers/responsesHTTPS');

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

const corsOptions = {
  credentials: true,
  origin: 'https://localhost:3000',
};

// For minimize erros about cors
app.use(cors(corsOptions));
app.use(routes);

// Middleware so that errors can respond to the client in case of errors
app.use((error, request, response, next) => {
  response.status(responsesHTTP.INTERNAL_SERVER_ERROR.status).json(responsesHTTP.INTERNAL_SERVER_ERROR);
});

// For read ssl certified
const options = {
  key: fs.readFileSync('ssl/code.key'),
  cert: fs.readFileSync('ssl/code.crt'),
};

// Server port
const port = 3000;

// Function for create the HTTPS server
const server = https.createServer(options, app);

// Calling the function to start the server.
server.listen(port, () => console.log(textInitialWhenConnect));

module.exports =  app;
