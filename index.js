const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, uncolorize, colorize, printf, splat, prettyPrint, simple, json } = format;

const myFormat = printf(info => { return `${info.timestamp} ${info.level}: ${info.message}`; });

// const logger = createLogger({
//     level: 'debug',
//     format: combine(
//         colorize(),
//         timestamp(),
//         //splat(),
//         myFormat
//     ),
//     transports: [
//         new transports.File({ filename: 'error.log', level: 'error', format: uncolorize()}),
//         new transports.File({ filename: 'info.log', level: 'info', format: uncolorize()}),
//         new transports.Console({ level: 'debug'})
//     ],
//     exceptionHandlers: [
//         new transports.Console(),
//         new transports.File({filename: 'uncaughtExceptions.log', format: combine(uncolorize(), json())})
//     ]
// });

const logger = createLogger({
    format: combine(
        colorize(),
        timestamp(),
        splat(),
        myFormat
    ),
    transports: [
        new transports.File({filename: 'uncaughtExceptions.log', format: combine(uncolorize(), json()), handleExceptions: true}),
        new transports.Console({ level: 'debug'}),
        new transports.File({ filename: 'error.log', level: 'error', format: combine(uncolorize(), json())}),
        new transports.File({ filename: 'info.log', level: 'info', format: combine(uncolorize(), json())})
    ]
});



// Need to listen to Global uncaughtException event to print it to the console.
process.on('uncaughtException', (ex) => { console.log(new Date().toISOString() + '\x1b[35m%s\x1b[0m' + ex.message, ' [Uncaught Exception]: ') });
process.on('unhandledRejection', (reason, promise) => { throw new Error(reason) });


async function exec(){
    await logger.info('Some info message!');
    await logger.error('Some error message!');
    await logger.debug('Some debug message!');

    throw await new Error('This is an uncaught Exception!');
}

exec();

/*logger.info('Some info message!');
logger.error('Some error message!');
logger.debug('Some debug message!');
throw new Error('This is an uncaught exception!');
*/
