require('winston-mongodb');
const winston = require('winston');
const { format, transports } = require('winston');
const config = require('config');
const path = require('path');

module.exports = function() {
    const dbConfig = config.get('database');

    let alignColorsAndTime = format.combine(
        format.colorize({
            all: true
        }),
        format.label({
            label: 'WINSTON'
        }),
        format.timestamp({
            format: 'YY-MM-DD HH:MM:SS'
        }),
        format.printf(
            info =>
                ` ${info.label} - ${info.timestamp} - ${info.level} : ${
                    info.message
                }`
        )
    );

    let alignTime = format.combine(
        format.label({
            label: 'ACADEMY'
        }),
        format.timestamp({
            format: 'YY-MM-DD HH:MM:SS'
        }),
        format.printf(({ level, message, label, timestamp }) => {
            return `{ label: "${label}", time: "${timestamp}", level: "${level}", message: "${message}" },`;
        })
    );

    winston.exceptions.handle(
        new transports.Console({
            format: format.combine(format.colorize(), alignColorsAndTime)
        }),
        new transports.File({
            filename: 'uncaughtExceptions.log',
            dirname: path.join(__dirname, '../log/'),
            timestamp: true,
            format: format.combine(alignTime)
        })
    );

    //unhandle Promise rejection
    process.on('unhandledRejection', ex => {
        throw ex;
    });

    //log error and exception in logFile.log
    winston.add(
        new transports.File({
            filename: config.get('logfile'),
            dirname: path.join(__dirname, '../log/'),
            format: format.combine(alignTime)
        })
    );

    winston.add(
        new transports.Console({
            format: format.combine(format.colorize(), alignColorsAndTime)
        })
    );

    //log error in mongo db
    winston.add(
        new transports.MongoDB({
            db: dbConfig,
            level: 'error'
        })
    );
};
