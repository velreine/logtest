const {
    createLogger,
    format,
    transports
} = require('winston');
const {
    combine,
    timestamp,
    label,
    uncolorize,
    colorize,
    printf,
    splat,
    prettyPrint,
    simple,
    json
} = format;
const fs = require('fs');
const myFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});
const winston = require('winston');
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

// Delete log files. (only for testing purposes)
if (fs.existsSync('error.log')) {

    fs.unlinkSync('error.log');
}
if (fs.existsSync('info.log')) {

    fs.unlinkSync('info.log');
}
if (fs.existsSync('uncaughtExceptions.log')) {

    fs.unlinkSync('uncaughtExceptions.log');
}


const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'debug',
            format: combine(colorize(), timestamp(), splat(), myFormat)
        }),
        new transports.File({
            filename: 'error.log',
            level: 'error',
            format: combine(timestamp(), json())
        }),
        new transports.File({
            filename: 'info.log',
            level: 'info',
            format: combine(json(), timestamp())
        })
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'uncaughtExceptions.log', format: combine(timestamp(), json()), handleExceptions: true})
    ]
});


/*logger.exceptions.handle(new transports.File({
    filename: 'uncaughtExceptions.log',
    format: combine(uncolorize(), json()),
    handleExceptions: true
}));
*/


// Need to listen to Global uncaughtException event to print it to the console.
process.on('unhandledRejection', (reason, promise) => {
    throw new Error(reason)
});

process.on('uncaughtException', (ex) => {
    console.log(new Date().toISOString() + '\x1b[35m%s\x1b[0m' + ex.message, ' [Uncaught Exception]: ')
});


async function exec() {
    await logger.info('Some info message!');
    await logger.error('Some error message!');
    await logger.debug('Some debug message!');

    // Testing sleep before throw...
    await sleep(2500);


    throw await new Error('This is an uncaught Exception!');
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

exec();

/*logger.info('Some info message!');
logger.error('Some error message!');
logger.debug('Some debug message!');
throw new Error('This is an uncaught exception!');
*/