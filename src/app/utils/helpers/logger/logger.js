const pino = require('pino');

const isDev = process.env.NODE_ENV === 'development';

const logger = isDev
    ? pino({
        level: 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
                ignore: 'pid,hostname'
            }
        }
    })
    : pino({ level: 'info' });

module.exports = logger;