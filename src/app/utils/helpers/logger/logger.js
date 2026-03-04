const pino = require('pino');

const isDev = process.env.NODE_ENV === 'development';

const logger = pino(
    {
        level: 'info',
        redact: ['req.headers.authorization']
    },
    isDev
        ? pino.transport({
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
                ignore: 'pid,hostname'
            }
        })
        : pino.destination('./logs/app.log')
);

module.exports = logger;