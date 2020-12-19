const chalk = require('chalk');
const logToFile = require('log-to-file');
const config = require('../config');

class Logger {
    static log(message) {
        var dateTime = new Date().toLocaleTimeString();

        console.log(
            chalk.gray('[' +
                dateTime.replace(/\..+/, '') +
                ']' +
                '[Console/Log]', message));

        if (config.global.enableLogDNA) {
            logDNALogger.log(message, {
                level: 'Info'
            });
        }
        if (config.global.enableLogToFile) {
            logToFile('[Console/Log]' + message, 'console.log');
        }
    }

    static warn(message) {
        var dateTime = new Date().toLocaleTimeString();

        console.log(
            chalk.yellow('[' +
                dateTime.replace(/\..+/, '') +
                ']') +
            chalk.yellow('[Console/Warn]' +
                message));

        if (config.global.enableLogDNA) {
            logDNALogger.log(message, {
                level: 'Warn'
            });
        }
        if (config.global.enableLogToFile) {
            logToFile('[Console/Warn]' + message, 'console.log');
        }
    }

    static error(message) {
        var dateTime = new Date().toLocaleTimeString();

        console.log(
            chalk.red('[' +
                dateTime.replace(/\..+/, '') +
                ']') +
            chalk.red('[Console/Error]' +
                message));

        if (config.global.enableLogDNA) {
            logDNALogger.log(message, {
                level: 'Error'
            });
        }
        if (config.global.enableLogToFile) {
            logToFile('[Console/Error]' + message, 'console.log');
        }
    }

    static fatal(message) {
        var dateTime = new Date().toLocaleTimeString();

        console.log(
            chalk.bgRedBright('[' +
                dateTime.replace(/\..+/, '') +
                ']') +
            chalk.bgRedBright('[Console/Fatal]' +
                message));

        if (config.global.enableLogDNA) {
            logDNALogger.log(message, {
                level: 'Fatal'
            });
        }
        if (config.global.enableLogToFile) {
            logToFile('[Console/Fatal]' + message, 'console.log');
        }
    }

    static db_log(message) {
        var dateTime = new Date().toLocaleTimeString();

        console.log(
            chalk.gray('[' +
                dateTime.replace(/\..+/, '') +
                ']' +
                '[Database/Log]', message));

        if (config.global.enableLogToFile) {
            logToFile('[Database/Log]' + message, 'console.log');
        }
    }

    static db_warn(message) {
        var dateTime = new Date().toLocaleTimeString();

        console.log(
            chalk.yellow('[' +
                dateTime.replace(/\..+/, '') +
                ']') +
            chalk.yellow('[Database/Warn]' +
                message));

        if (config.global.enableLogDNA) {
            logDNALogger.log(message, {
                level: 'Warn',
                app: 'Wilbur_DB'
            });
        }
        if (config.global.enableLogToFile) {
            logToFile('[Database/Warn]' + message, 'console.log');
        }
    }

    static db_error(message) {
        var dateTime = new Date().toLocaleTimeString();

        console.log(
            chalk.red('[' +
                dateTime.replace(/\..+/, '') +
                ']') +
            chalk.red('[Database/Error]' +
                message.stack));

        if (config.global.enableLogDNA) {
            logDNALogger.log(message.stack, {
                level: 'Error',
                app: 'Wilbur_DB'
            });
        }
        if (config.global.enableLogToFile) {
            logToFile('[Database/Error]' + message.stack, 'console.log');
        }
    }
}

module.exports = Logger;